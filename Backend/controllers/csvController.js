import Transaction from '../models/Transaction.js'
import parseWithGemini from '../utils/geminiParser.js'
import pdf from 'pdf-parse/lib/pdf-parse.js'

/**
 * Upload and parse ANY format - CSV, PDF, or TXT
 * Uses Gemini AI for flexible, format-independent parsing
 * @route POST /api/transactions/upload-csv
 * @access Private
 */
export const uploadCSV = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    // Detect file format from filename
    const fileName = req.file.originalname.toLowerCase()
    let fileFormat = null
    let content = null

    if (fileName.endsWith('.csv')) {
      fileFormat = 'csv'
      // Convert CSV to text (Gemini will parse it)
      content = req.file.buffer.toString('utf-8')
    } else if (fileName.endsWith('.pdf')) {
      fileFormat = 'pdf'
      // Extract text from PDF first
      try {
        const pdfData = await pdf(req.file.buffer)
        content = pdfData.text
      } catch (pdfError) {
        return res.status(400).json({
          success: false,
          message: 'Failed to read PDF. Please ensure it\'s a valid PDF file.'
        })
      }
    } else if (fileName.endsWith('.txt')) {
      fileFormat = 'txt'
      // Plain text file
      content = req.file.buffer.toString('utf-8')
    } else {
      return res.status(400).json({
        success: false,
        message: 'Only CSV, PDF, and TXT files are allowed'
      })
    }

    // Validate content exists
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'File is empty or unreadable'
      })
    }

    // 🔥 Send to Gemini AI for parsing (works with ANY format!)
    console.log(`[${fileFormat.toUpperCase()}] Sending to Gemini AI...`)
    const parsedTransactions = await parseWithGemini(content)

    if (!parsedTransactions || parsedTransactions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid transactions found in file. Make sure it contains transaction data (dates, amounts, descriptions).'
      })
    }

    // Add userId to each transaction
    const transactionsToSave = parsedTransactions.map(t => ({
      ...t,
      userId: req.user.id
    }))

    // Save to database
    const savedTransactions = await Transaction.insertMany(transactionsToSave)

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${savedTransactions.length} transactions from ${fileFormat.toUpperCase()}`,
      count: savedTransactions.length,
      format: fileFormat,
      transactions: savedTransactions
    })
  } catch (error) {
    console.error('File Upload Error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file'
    })
  }
}

/**
 * Get CSV upload sample
 * @route GET /api/transactions/csv-sample
 * @access Public
 */
export const getCSVSample = async (req, res) => {
  try {
    const sampleCSV = `Date,Description,Amount
2024-01-15,Salary Credited,50000
2024-01-16,Amazon Purchase,-1500
2024-01-17,Coffee,-200
2024-01-18,Refund,500
2024-01-19,Netflix Subscription,-499
2024-01-20,Uber Ride,-250`

    res.status(200)
       .header('Content-Type', 'text/csv')
       .header('Content-Disposition', 'attachment; filename="sample.csv"')
       .send(sampleCSV)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

/**
 * Get upload format guide
 * @route GET /api/transactions/upload-guide
 * @access Public
 */
export const getUploadGuide = async (req, res) => {
  try {
    const guide = {
      formats: ['CSV', 'PDF', 'TXT'],
      maxFileSize: '100 MB',
      flexibility: '✅ AI-Powered Parsing - ANY format accepted!',
      requirements: {
        CSV: {
          format: 'ANY CSV structure - no strict column requirements',
          flexibility: '✨ Automatically detects columns regardless of order or names',
          dateFormats: ['DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM/DD/YYYY'],
          amountFormat: 'Any numbering format (commas, decimals, negative signs)',
          example: 'Works with ANY structure:\nDate | Description | Withdrawal | Deposit\n2024-01-15 | Salary | | 50000\n2024-01-16 | Amazon | 1500 |\nOR\ntxn_date, narrative, debits, credits\n15-01-2024, SalaryIn, 0, 50000\netc.'
        },
        PDF: {
          format: 'Bank statement PDF (any layout)',
          flexibility: 'AI extracts transactions from any PDF structure',
          dateFormats: ['DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM/DD/YYYY'],
          amountFormat: 'Any formatting recognized',
          tip: 'Works with ANY bank PDF - different banks, layouts, languages'
        },
        TXT: {
          format: 'Plain text bank statements',
          flexibility: 'Copy-paste any bank statement format',
          dateFormats: 'Any date format recognized',
          amountFormat: 'Any amount format'
        }
      },
      autoCategorization: {
        enabled: true,
        categories: ['Salary', 'Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Finance', 'Other'],
        description: 'Transactions automatically categorized using AI keyword analysis'
      },
      notes: [
        '🎯 NO column order required - CSV can have ANY structure',
        '🤖 Gemini AI intelligently parses transaction data from ANY format',
        '✅ Income/expense detection works regardless of formatting',
        'Dates, amounts, and descriptions extracted automatically',
        'File must contain at least one valid transaction',
        'Supports bank statements from any country/format'
      ]
    }
    
    res.status(200).json({
      success: true,
      data: guide
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
