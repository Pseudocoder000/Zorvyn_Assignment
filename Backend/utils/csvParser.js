// CSV Parser for bank statements
// Detects transaction type and category automatically

// Keywords for categorizing transactions
const INCOME_KEYWORDS = [
  'salary', 'bonus', 'refund', 'transfer in', 'deposit', 'payment received',
  'interest', 'dividend', 'income', 'credit', 'recharge', 'cashback'
]

const EXPENSE_KEYWORDS = {
  'Shopping': ['amazon', 'flipkart', 'myntra', 'shop', 'store', 'mall', 'purchase', 'buy'],
  'Food & Dining': ['restaurant', 'cafe', 'pizza', 'coffee', 'burger', 'food', 'zomato', 'swiggy', 'uber eats'],
  'Travel': ['uber', 'ola', 'taxi', 'flight', 'hotel', 'train', 'bus', 'travel', 'fuel', 'gas'],
  'Entertainment': ['movie', 'cinema', 'netflix', 'spotify', 'youtube', 'gaming', 'game', 'entertainment'],
  'Bills & Utilities': ['electricity', 'water', 'gas', 'internet', 'phone', 'mobile', 'bill', 'utility'],
  'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medicine', 'health', 'medical'],
  'Education': ['school', 'college', 'university', 'course', 'tuition', 'books', 'education'],
  'Subscriptions': ['subscription', 'membership', 'premium', 'plan'],
  'Transfer Out': ['transfer', 'withdrawal', 'cash', 'atm'],
  'Others': []
}

/**
 * Detect if a transaction is income or expense
 * @param {string} description - Transaction description
 * @param {number} amount - Transaction amount (positive = credit, negative = debit)
 * @returns {string} 'income' or 'expense'
 */
export const detectTransactionType = (description, amount) => {
  const desc = description.toLowerCase()
  
  // Check if amount is negative (typically expense)
  if (amount < 0) {
    return 'expense'
  }
  
  // Check income keywords
  for (const keyword of INCOME_KEYWORDS) {
    if (desc.includes(keyword)) {
      return 'income'
    }
  }
  
  // Default to expense if positive but no income keywords
  return 'expense'
}

/**
 * Categorize transaction based on description
 * @param {string} description - Transaction description
 * @returns {string} Category name
 */
export const categorizeTransaction = (description) => {
  const desc = description.toLowerCase()
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(EXPENSE_KEYWORDS)) {
    if (category === 'Others') continue // Skip 'Others' for now
    
    for (const keyword of keywords) {
      if (desc.includes(keyword)) {
        return category
      }
    }
  }
  
  // Default category
  return 'Others'
}

/**
 * Parse CSV content and extract transactions
 * @param {string} csvContent - Raw CSV content
 * @param {string} format - CSV format: 'auto', 'date_desc_amount', 'date_amount_desc'
 * @returns {Promise<Array>} Array of parsed transactions
 */
export const parseCSV = async (csvContent, format = 'auto') => {
  const lines = csvContent.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least 1 transaction')
  }
  
  // Skip header row
  const dataLines = lines.slice(1)
  const transactions = []
  
  for (const line of dataLines) {
    if (!line.trim()) continue
    
    const fields = line.split(',').map(f => f.trim())
    
    if (fields.length < 3) continue
    
    let date, description, amount
    
    // Auto-detect format or use specified format
    if (format === 'auto' || format === 'date_desc_amount') {
      date = fields[0]
      description = fields[1]
      amount = parseFloat(fields[2])
    } else if (format === 'date_amount_desc') {
      date = fields[0]
      amount = parseFloat(fields[1])
      description = fields[2]
    }
    
    // Validate amount
    if (isNaN(amount)) {
      console.warn(`Skipping row: invalid amount "${fields[2]}"`)
      continue
    }
    
    // Parse date
    const transactionDate = new Date(date)
    if (isNaN(transactionDate.getTime())) {
      console.warn(`Skipping row: invalid date "${date}"`)
      continue
    }
    
    // Get absolute amount (convert negative to positive)
    const absoluteAmount = Math.abs(amount)
    
    // Detect type based on amount sign and keywords
    const type = detectTransactionType(description, amount)
    
    // Categorize
    const category = categorizeTransaction(description)
    
    transactions.push({
      date: transactionDate,
      name: description,
      description: description,
      amount: absoluteAmount,
      type: type,
      category: category,
      source: 'csv-upload'
    })
  }
  
  if (transactions.length === 0) {
    throw new Error('No valid transactions found in CSV')
  }
  
  return transactions
}

/**
 * Validate CSV format
 * @param {string} csvContent - Raw CSV content
 * @returns {Object} Validation result
 */
export const validateCSVFormat = (csvContent) => {
  const lines = csvContent.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    return {
      valid: false,
      error: 'CSV must have header row and at least 1 data row'
    }
  }
  
  const header = lines[0].toLowerCase()
  
  // Check for required columns
  const hasDate = header.includes('date')
  const hasAmount = header.includes('amount')
  const hasDescription = header.includes('desc') || header.includes('description') || header.includes('narration')
  
  if (!hasDate || !hasAmount || !hasDescription) {
    return {
      valid: false,
      error: 'CSV must have: date, amount, description (or narration) columns'
    }
  }
  
  return {
    valid: true,
    columnsFound: { hasDate, hasAmount, hasDescription }
  }
}

// Sample CSV format helper text
export const CSV_FORMAT_HELP = `
Expected CSV Format:
Date,Description,Amount

Examples:
2024-01-15,Salary Credited,50000
2024-01-16,Amazon Purchase,-1500
2024-01-17,Coffee,-200
2024-01-18,Refund,500

Rules:
- Date: YYYY-MM-DD format
- Description: Transaction details
- Amount: Positive for income, Negative for expense (or always positive, we'll detect type)
`
