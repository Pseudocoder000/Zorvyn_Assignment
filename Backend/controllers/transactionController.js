import Transaction from '../models/Transaction.js'

// @desc    Get all transactions for user
// @route   GET /api/transactions?page=1&limit=20&type=all&category=all&sort=date&order=desc
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 20, type = 'all', category = 'all', sort = 'date', order = 'desc' } = req.query

    // Build filter
    const filter = { userId }
    if (type !== 'all') filter.type = type
    if (category !== 'all') filter.category = category

    // Calculate skip
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Build sort
    const sortObj = {}
    if (sort === 'date') {
      sortObj.date = order === 'desc' ? -1 : 1
    } else if (sort === 'amount') {
      sortObj.amount = order === 'desc' ? -1 : 1
    }

    // Get total count
    const total = await Transaction.countDocuments(filter)

    // Get transactions
    const transactions = await Transaction.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip)

    res.status(200).json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      })
    }

    // Check if user owns this transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this transaction',
      })
    }

    res.status(200).json({
      success: true,
      transaction,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, name, date, description } = req.body

    // Validation
    if (!type || !category || !amount || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      })
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      category,
      amount,
      name,
      date: date || new Date(),
      description,
    })

    res.status(201).json({
      success: true,
      transaction,
      message: 'Transaction added successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      })
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this transaction',
      })
    }

    const { type, category, amount, name, date, description } = req.body

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, category, amount, name, date, description },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      transaction,
      message: 'Transaction updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      })
    }

    // Check ownership
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this transaction',
      })
    }

    await Transaction.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Get transaction stats (for dashboard)
// @route   GET /api/transactions/stats/summary
// @access  Private
export const getTransactionStats = async (req, res) => {
  try {
    const userId = req.user.id
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // All time stats
    const allTransactions = await Transaction.find({ userId })

    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    // This month stats
    const monthTransactions = await Transaction.find({
      userId,
      date: { $gte: monthStart, $lte: now },
    })

    const thisMonthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const thisMonthExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    res.status(200).json({
      success: true,
      stats: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        thisMonthIncome,
        thisMonthExpense,
        thisMonthBalance: thisMonthIncome - thisMonthExpense,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}
