/**
 * Text Bank Statement Parser
 * Parses Indian bank statement text files and extracts transactions
 */

import { detectTransactionType, categorizeTransaction } from './csvParser.js';

/**
 * Parse text bank statement file
 * Handles multiple bank statement formats
 */
export const parseTxtBankStatement = async (txtContent) => {
  const lines = txtContent.split('\n').map(line => line.trim()).filter(line => line);
  const transactions = [];

  // Try different parsing strategies
  let result = tryTableFormat(lines);
  
  if (!result || result.length === 0) {
    result = tryKeyValueFormat(lines);
  }
  
  if (!result || result.length === 0) {
    result = tryFreeTextFormat(lines);
  }

  return result || [];
};

/**
 * Try to parse table format (most common for bank statements)
 * Format: Date | Description | Debit | Credit | Balance
 */
function tryTableFormat(lines) {
  const transactions = [];
  
  // Find first data line with date in table format
  let startIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for lines starting with DD/MM/YYYY pattern
    if (/^\d{2}\/\d{2}\/\d{4}\s*\|/.test(line)) {
      startIndex = i;
      break;
    }
  }

  // If no table format found, return null
  if (startIndex === -1) {
    return null;
  }

  // Parse transaction lines starting from the first date line
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip separator and header lines
    if (!line || line.match(/^[=\-\s|]+$/) || line.toLowerCase().includes('total')) {
      continue;
    }

    const txn = parseTableFormattedLine(line);
    if (txn) {
      transactions.push(txn);
    }
  }

  return transactions.length > 0 ? transactions : null;
}

/**
 * Parse a table-formatted transaction line
 * Handles: Date | Description | Debit | Credit | Balance
 */
function parseTableFormattedLine(line) {
  if (!line || line.length < 10) return null;
  
  // Skip separator lines
  if (line.match(/^[=\-\s|]+$/)) return null;

  // Split by pipe, tab, or multiple spaces
  let parts = line.split('|').map(p => p.trim());
  
  if (parts.length < 3) {
    parts = line.split('\t').map(p => p.trim());
  }
  if (parts.length < 3) {
    parts = line.split(/\s{2,}/).map(p => p.trim());
  }

  if (parts.length < 2) return null;

  try {
    // Expected format: Date | Description | Debit | Credit | Balance
    // Or shorter: Date | Description | Amount
    
    let dateStr = parts[0];
    let description = parts[1];
    let debit = 0;
    let credit = 0;

    if (!dateStr || !description) return null;

    // Check if first part is a valid date
    if (!isDateLike(dateStr)) return null;

    // Parse remaining parts for amounts
    if (parts.length >= 4) {
      // Format: Date | Description | Debit | Credit | Balance...
      const debitStr = parts[2];
      const creditStr = parts[3];
      
      debit = parseAmount(debitStr);
      credit = parseAmount(creditStr);
    } else if (parts.length === 3) {
      // Format: Date | Description | Amount
      const amountStr = parts[2];
      const amount = parseAmount(amountStr);
      
      if (amount >= 0) credit = amount;
      else debit = Math.abs(amount);
    } else {
      return null;
    }

    // Must have at least one amount
    if (debit === 0 && credit === 0) return null;

    // Parse date
    const date = parseDate(dateStr);
    if (!date) return null;

    // Calculate net amount
    const amount = credit > 0 ? credit : -debit;

    // Determine transaction type and category
    const type = detectTransactionType(description, amount);
    const category = categorizeTransaction(description);

    return {
      date,
      description: cleanDescription(description),
      amount,
      type,
      category,
      source: 'bank_statement'
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if string looks like a date
 */
function isDateLike(str) {
  if (!str) return false;
  return /\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{2}[\/\-]\d{2}[\/\-]\d{2}|\d{4}[\/\-]\d{2}[\/\-]\d{2}/.test(str);
}

/**
 * Try key-value format parsing
 * Format: key: value pairs
 */
function tryKeyValueFormat(lines) {
  const transactions = [];
  let currentTxn = {};

  for (const line of lines) {
    // Transaction separators
    if (line === '---' || line === '====') {
      if (currentTxn.date && (currentTxn.debit !== undefined || currentTxn.credit !== undefined)) {
        const txn = buildTransaction(currentTxn);
        if (txn) transactions.push(txn);
      }
      currentTxn = {};
      continue;
    }

    // Parse key-value pairs
    if (line.includes(':')) {
      const [key, value] = line.split(':').map(p => p.trim());
      const lowerKey = key.toLowerCase();

      if (lowerKey.includes('date')) currentTxn.date = value;
      else if (lowerKey.includes('desc') || lowerKey.includes('narration')) currentTxn.description = value;
      else if (lowerKey.includes('debit') || lowerKey.includes('dr')) currentTxn.debit = parseAmount(value);
      else if (lowerKey.includes('credit') || lowerKey.includes('cr')) currentTxn.credit = parseAmount(value);
      else if (lowerKey.includes('amount')) currentTxn.amount = parseAmount(value);
    }
  }

  // Process last transaction
  if (currentTxn.date && (currentTxn.debit !== undefined || currentTxn.credit !== undefined)) {
    const txn = buildTransaction(currentTxn);
    if (txn) transactions.push(txn);
  }

  return transactions.length > 0 ? transactions : null;
}

/**
 * Try free text line format
 * Format: Date Description Amount
 */
function tryFreeTextFormat(lines) {
  const transactions = [];

  for (const line of lines) {
    const txn = parseFreeTextLine(line);
    if (txn) transactions.push(txn);
  }

  return transactions.length > 3 ? transactions : null;
}

/**
 * Parse free text line
 * Format: DD/MM/YYYY Description -2500 or DD/MM/YYYY Description 5000
 */
function parseFreeTextLine(line) {
  if (!line || line.length < 15) return null;

  // Extract date at start
  const dateMatch = line.match(/^(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}|\d{4}-\d{1,2}-\d{1,2})/);
  if (!dateMatch) return null;

  const dateStr = dateMatch[1];
  const remaining = line.substring(dateStr.length).trim();

  // Extract amount at end
  const amountMatch = remaining.match(/[\s-](\d+(?:[.,]\d+)?)\s*(?:DR|CR|D|C)?$/i);
  if (!amountMatch) return null;

  const amountStr = amountMatch[1];
  const description = remaining.substring(0, remaining.length - amountMatch[0].length).trim();

  if (!description || description.length < 3) return null;

  try {
    const date = parseDate(dateStr);
    if (!date) return null;

    const amount = parseAmount(amountStr);
    if (amount === 0) return null;

    // Check if it's debit (negative) from context
    let finalAmount = amount;
    const isDebit = remaining.includes('DR') || 
                    remaining.includes('D ') ||
                    description.toLowerCase().includes('withdrawal') ||
                    description.toLowerCase().includes('debit') ||
                    amount < 0;

    if (isDebit && amount > 0) {
      finalAmount = -amount;
    }

    const type = detectTransactionType(description, finalAmount);
    const category = categorizeTransaction(description);

    return {
      date,
      description: cleanDescription(description),
      amount: finalAmount,
      type,
      category,
      source: 'bank_statement'
    };
  } catch (error) {
    return null;
  }
}

/**
 * Build transaction from parsed components
 */
function buildTransaction(txnObj) {
  if (!txnObj.date || (txnObj.debit === undefined && txnObj.credit === undefined)) {
    return null;
  }

  try {
    const date = parseDate(txnObj.date);
    if (!date) return null;

    const debit = txnObj.debit || 0;
    const credit = txnObj.credit || 0;
    const amount = credit > 0 ? credit : -debit;

    if (amount === 0) return null;

    const type = detectTransactionType(txnObj.description, amount);
    const category = categorizeTransaction(txnObj.description);

    return {
      date,
      description: cleanDescription(txnObj.description),
      amount,
      type,
      category,
      source: 'bank_statement'
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parse date in multiple formats
 * Supports: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD/MM/YY, etc.
 */
function parseDate(dateStr) {
  if (!dateStr) return null;

  dateStr = dateStr.trim();

  // DD/MM/YYYY
  let match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    const date = new Date(year, month - 1, day);
    if (isValidDate(date)) return date;
  }

  // DD-MM-YYYY
  match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    const date = new Date(year, month - 1, day);
    if (isValidDate(date)) return date;
  }

  // YYYY-MM-DD
  match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    const date = new Date(year, month - 1, day);
    if (isValidDate(date)) return date;
  }

  // DD/MM/YY (2-digit year)
  match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (match) {
    const [, day, month, year] = match;
    const fullYear = parseInt(year) > 50 ? 1900 + parseInt(year) : 2000 + parseInt(year);
    const date = new Date(fullYear, month - 1, day);
    if (isValidDate(date)) return date;
  }

  return null;
}

/**
 * Validate if date is valid
 */
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Parse amount string
 * Handles: 1000, 1,000, 1000.50, -1000, 1000 DR, etc.
 */
function parseAmount(amountStr) {
  if (!amountStr || !amountStr.trim()) return 0;

  amountStr = amountStr.trim().toUpperCase();

  // Return 0 for empty strings
  if (!amountStr) return 0;

  // Remove letters except minus at start
  let numStr = amountStr.replace(/[A-Z\s]/g, '');
  
  // Remove commas (thousands separator)
  numStr = numStr.replace(/,/g, '');

  // Clean up spacing and special chars
  numStr = numStr.trim();
  
  if (!numStr || numStr === '-') return 0;

  const amount = parseFloat(numStr);
  return isNaN(amount) ? 0 : Math.abs(amount);
}

/**
 * Clean description
 * Removes extra whitespace and special characters
 */
function cleanDescription(description) {
  if (!description) return 'Unknown';
  
  return description
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-\/.&()]/g, '')
    .substring(0, 100);
}

/**
 * Validate if txt content looks like a bank statement
 */
export const validateTxtContent = (txtContent) => {
  if (!txtContent || txtContent.length < 50) {
    return {
      valid: false,
      error: 'File is too small or empty'
    };
  }

  const lowerContent = txtContent.toLowerCase();
  
  // Check for bank statement indicators
  const hasDatePattern = /\d{2}[\/\-]\d{2}[\/\-]\d{4}/.test(txtContent);
  const hasAmountPattern = /\d+[.,]\d{2}|\d{1,10}(?:\s|$)/.test(txtContent);
  const hasBankKeywords = /(statement|transaction|debit|credit|balance|narration|description|date)/i.test(txtContent);

  if (!hasDatePattern || !hasAmountPattern) {
    return {
      valid: false,
      error: 'No transaction data found. Please ensure file contains dates and amounts.'
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Detect file format
 */
export const detectFileFormat = (file) => {
  if (!file) return null;

  const mimetype = file.mimetype || '';
  const filename = file.originalname || '';

  if (filename.endsWith('.pdf') || mimetype === 'application/pdf') {
    return 'pdf';
  }
  if (filename.endsWith('.csv') || mimetype === 'text/csv') {
    return 'csv';
  }
  if (filename.endsWith('.txt') || mimetype === 'text/plain') {
    return 'txt';
  }

  return null;
};
