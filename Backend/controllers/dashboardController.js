import Transaction from '../models/Transaction.js'
import Budget from '../models/Budget.js'

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // All transactions
    const allTransactions = await Transaction.find({ userId })
    
    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    // This month
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

    // Recent transactions (last 5)
    const recentTransactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(5)

    res.status(200).json({
      success: true,
      summary: {
        totalBalance: totalIncome - totalExpense,
        totalIncome,
        totalExpense,
        thisMonthIncome,
        thisMonthExpense,
        thisMonthBalance: thisMonthIncome - thisMonthExpense,
        recentTransactions,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Get spending by category
// @route   GET /api/dashboard/spending-by-category
// @access  Private
export const getSpendingByCategory = async (req, res) => {
  try {
    const userId = req.user.id
    const { month } = req.query // Optional: filter by specific month

    let filter = { userId, type: 'expense' }

    if (month) {
      const [year, monthNum] = month.split('-')
      const monthStart = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      const monthEnd = new Date(parseInt(year), parseInt(monthNum), 1)
      filter.date = { $gte: monthStart, $lt: monthEnd }
    }

    const transactions = await Transaction.find(filter)

    // Group by category
    const categorySpending = {}
    transactions.forEach(t => {
      if (!categorySpending[t.category]) {
        categorySpending[t.category] = 0
      }
      categorySpending[t.category] += t.amount
    })

    // Convert to array format
    const categories = Object.keys(categorySpending).map(category => ({
      name: category,
      amount: categorySpending[category],
    }))

    res.status(200).json({
      success: true,
      categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Get monthly income/expense trend
// @route   GET /api/dashboard/monthly-trend
// @access  Private
export const getMonthlyTrend = async (req, res) => {
  try {
    const userId = req.user.id
    const { months = 6 } = req.query // Default last 6 months

    const trends = []
    const now = new Date()

    for (let i = parseInt(months) - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

      const monthTransactions = await Transaction.find({
        userId,
        date: { $gte: monthStart, $lt: monthEnd },
      })

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      trends.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income,
        expense,
      })
    }

    res.status(200).json({
      success: true,
      trends,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}

// @desc    Get budget status
// @route   GET /api/dashboard/budget-status
// @access  Private
export const getBudgetStatus = async (req, res) => {
  try {
    const userId = req.user.id
    const now = new Date()
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // Get budgets for this month
    let budgets = await Budget.find({ userId, month: monthStr })

    // If no budgets exist, use default limits
    if (budgets.length === 0) {
      const { BUDGET_LIMITS } = await import('../data/constants.js')
      budgets = Object.entries(BUDGET_LIMITS).map(([category, limit]) => ({
        userId,
        category,
        limit,
        month: monthStr,
      }))
    }

    // Get spending by category this month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthTransactions = await Transaction.find({
      userId,
      type: 'expense',
      date: { $gte: monthStart, $lte: now },
    })

    const budgetStatus = budgets.map(budget => {
      const spent = monthTransactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining: budget.limit - spent,
        percentage: (spent / budget.limit) * 100,
      }
    })

    res.status(200).json({
      success: true,
      budgetStatus,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    })
  }
}
