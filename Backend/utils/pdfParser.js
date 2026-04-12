// PDF Parser for bank statements
// Extracts text from PDF and parses transactions

import { detectTransactionType, categorizeTransaction } from './csvParser.js'

/**
 * Parse PDF content and extract transactions
 * Handles typical bank statement PDF formats
 * @param {string} pdfText - Extracted text from PDF
 * @returns {Promise<Array>} Array of parsed transactions
 */
export const parsePDF = async (pdfText) => {
  if (!pdfText || pdfText.trim().length === 0) {
    throw new Error('PDF is empty or unreadable')
  }

  const lines = pdfText.split('\n').map(line => line.trim()).filter(line => line)
  
  if (lines.length < 2) {
    throw new Error('PDF must contain transaction data')
  }

  const transactions = []
  
  // Try to detect and parse transaction lines
  // Look for patterns like: DATE DESCRIPTION AMOUNT
  for (const line of lines) {
    // Skip headers and non-transaction lines
    if (line.toLowerCase().includes('statement') || 
        line.toLowerCase().includes('account') ||
        line.toLowerCase().includes('page')) {
      continue
    }

    const txn = parseTransactionLine(line)
    if (txn) {
      transactions.push(txn)
    }
  }

  if (transactions.length === 0) {
    throw new Error('No valid transactions found in PDF. Please ensure it contains transaction data.')
  }

  return transactions
}

/**
 * Parse a single line to extract transaction details
 * Handles multiple format variations
 */
function parseTransactionLine(line) {
  // Skip empty or short lines
  if (!line || line.length < 10) return null

  // Pattern 1: DATE DESCRIPTION AMOUNT (common format)
  // Example: 15/01/2024 Amazon Purchase 2500
  // Example: 15-01-2024 Salary Credited 50000
  
  let dateMatch = line.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\s+(.+?)\s+([\d,]+(?:\.\d{2})?)\s*$/)
  if (dateMatch) {
    return parseWithDate(dateMatch[1], dateMatch[2], dateMatch[3])
  }

  // Pattern 2: DESCRIPTION DATE AMOUNT (alternate format)
  // Example: Amazon Purchase 15/01/2024 2500
  dateMatch = line.match(/^(.+?)\s+(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\s+([\d,]+(?:\.\d{2})?)\s*$/)
  if (dateMatch) {
    return parseWithDate(dateMatch[2], dateMatch[1], dateMatch[3])
  }

  // Pattern 3: Tab or multiple space separated
  // Example: 15/01/2024    Amazon Purchase    2500
  const parts = line.split(/\s{2,}|\t/).filter(p => p.trim())
  if (parts.length >= 3) {
    // Try to identify which part is date, description, amount
    const dateIdx = parts.findIndex(p => isDateLike(p))
    const amountIdx = parts.findIndex(p => isAmountLike(p))
    
    if (dateIdx !== -1 && amountIdx !== -1) {
      let description = parts.filter((_, i) => i !== dateIdx && i !== amountIdx).join(' ')
      if (description.length > 0) {
        return parseWithDate(parts[dateIdx], description, parts[amountIdx])
      }
    }
  }

  return null
}

/**
 * Check if string looks like a date
 */
function isDateLike(str) {
  return /^\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}$/.test(str) ||
         /^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(str)
}

/**
 * Check if string looks like an amount
 */
function isAmountLike(str) {
  return /^[\d,]+(?:\.\d{1,2})?$/.test(str) || 
         /^-[\d,]+(?:\.\d{1,2})?$/.test(str) ||
         /^[\d,]+(?:\.\d{1,2})?$/.test(str)
}

/**
 * Parse transaction with extracted date, description, amount
 */
function parseWithDate(dateStr, description, amountStr) {
  try {
    // Parse date (handle multiple formats)
    const date = parseDate(dateStr)
    if (!date || isNaN(date.getTime())) {
      return null
    }

    // Parse amount (remove commas, convert to number)
    const amount = parseFloat(amountStr.replace(/,/g, ''))
    if (isNaN(amount)) {
      return null
    }

    // Validate description
    if (!description || description.trim().length === 0) {
      return null
    }

    const desc = description.trim()
    const absoluteAmount = Math.abs(amount)
    const type = detectTransactionType(desc, amount)
    const category = categorizeTransaction(desc)

    return {
      date,
      name: desc,
      description: desc,
      amount: absoluteAmount,
      type,
      category,
      source: 'pdf-upload'
    }
  } catch (err) {
    return null
  }
}

/**
 * Parse date from various formats
 * Supports: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, etc.
 */
function parseDate(dateStr) {
  // Try common date formats
  const formats = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, // DD/MM/YYYY or MM/DD/YYYY
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/  // YYYY/MM/DD
  ]

  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      let year, month, day
      
      if (match[3].length === 4) {
        // DD/MM/YYYY format
        day = parseInt(match[1])
        month = parseInt(match[2])
        year = parseInt(match[3])
      } else {
        // YYYY/MM/DD format
        year = parseInt(match[1])
        month = parseInt(match[2])
        day = parseInt(match[3])
      }

      // Validate month and day
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        continue
      }

      const date = new Date(year, month - 1, day)
      
      // Verify the date is valid
      if (date.getFullYear() === year && 
          date.getMonth() === month - 1 && 
          date.getDate() === day) {
        return date
      }
    }
  }

  // Fallback to JavaScript date parser
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Validate PDF was successfully extracted
 */
export const validatePDFContent = (pdfText) => {
  if (!pdfText || pdfText.trim().length === 0) {
    return {
      valid: false,
      error: 'PDF is empty or could not be read'
    }
  }

  // Check for common transaction-like patterns
  const hasNumbers = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(pdfText) || 
                     /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/.test(pdfText)
  const hasAmounts = /[\d,]+(?:\.\d{1,2})?/.test(pdfText)

  if (!hasNumbers || !hasAmounts) {
    return {
      valid: false,
      error: 'PDF does not appear to contain transaction data. Please ensure it has dates and amounts.'
    }
  }

  return {
    valid: true
  }
}

/**
 * Detect file format from buffer/filename
 */
export const detectFileFormat = (file) => {
  if (file.originalname?.endsWith('.csv') || file.mimetype === 'text/csv') {
    return 'csv'
  }
  if (file.originalname?.endsWith('.pdf') || file.mimetype === 'application/pdf') {
    return 'pdf'
  }
  return null
}
