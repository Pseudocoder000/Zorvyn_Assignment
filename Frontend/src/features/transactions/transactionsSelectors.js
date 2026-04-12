/**
 * ════════════════════════════════════════════════════════════════
 * BALANCE & METRICS SELECTORS
 * ════════════════════════════════════════════════════════════════
 * 
 * Redux selectors for calculating balance, income, expenses, and
 * advanced metrics derived from transactions and user profile.
 * 
 * All selectors are memoized and reactive - they automatically
 * update when Redux state changes.
 */

/**
 * ════════════════════════════════════════════════════════════════
 * 1. BASIC BALANCE SELECTORS
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Get all transactions
 */
export const selectAllTransactions = (state) => state.transactions.items || []

/**
 * Get user's initial balance (from profile)
 */
export const selectInitialBalance = (state) => state.auth.user?.initialBalance || 0

/**
 * Calculate total income from all transactions
 * Used in: Balance calculation, monthly comparisons, insights
 */
export const selectTotalIncome = (state) => {
  const transactions = selectAllTransactions(state)
  return transactions
    .filter((txn) => txn.type === 'income')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0)
}

/**
 * Calculate total expense from all transactions
 * Used in: Balance calculation, budget tracking, spending analysis
 */
export const selectTotalExpense = (state) => {
  const transactions = selectAllTransactions(state)
  return transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0)
}

/**
 * Calculate net balance
 * Formula: initialBalance + totalIncome - totalExpense
 * This is the primary balance shown in dashboard and sidebar
 */
export const selectTotalBalance = (state) => {
  const initialBalance = selectInitialBalance(state)
  const totalIncome = selectTotalIncome(state)
  const totalExpense = selectTotalExpense(state)
  return initialBalance + totalIncome - totalExpense
}

/**
 * Calculate transaction-based balance (without initialBalance)
 * Useful for seeing impact of transactions only
 */
export const selectTransactionBalance = (state) => {
  const totalIncome = selectTotalIncome(state)
  const totalExpense = selectTotalExpense(state)
  return totalIncome - totalExpense
}

/**
 * ════════════════════════════════════════════════════════════════
 * 2. MONTHLY METRICS
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Helper: Get current month's transactions
 */
const getThisMonthTransactions = (state) => {
  const transactions = selectAllTransactions(state)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return transactions.filter((txn) => {
    const date = new Date(txn.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })
}

/**
 * Get last month's transactions
 */
const getLastMonthTransactions = (state) => {
  const transactions = selectAllTransactions(state)
  const now = new Date()
  const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()

  return transactions.filter((txn) => {
    const date = new Date(txn.date)
    return date.getMonth() === lastMonth && date.getFullYear() === lastYear
  })
}

/**
 * This month's income
 */
export const selectThisMonthIncome = (state) => {
  const thisMonth = getThisMonthTransactions(state)
  return thisMonth
    .filter((txn) => txn.type === 'income')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0)
}

/**
 * This month's expense
 */
export const selectThisMonthExpense = (state) => {
  const thisMonth = getThisMonthTransactions(state)
  return thisMonth
    .filter((txn) => txn.type === 'expense')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0)
}

/**
 * Last month's income
 */
export const selectLastMonthIncome = (state) => {
  const lastMonth = getLastMonthTransactions(state)
  return lastMonth
    .filter((txn) => txn.type === 'income')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0)
}

/**
 * Last month's expense
 */
export const selectLastMonthExpense = (state) => {
  const lastMonth = getLastMonthTransactions(state)
  return lastMonth
    .filter((txn) => txn.type === 'expense')
    .reduce((sum, txn) => sum + (txn.amount || 0), 0)
}

/**
 * This month's balance
 */
export const selectThisMonthBalance = (state) => {
  return selectThisMonthIncome(state) - selectThisMonthExpense(state)
}

/**
 * Last month's balance
 */
export const selectLastMonthBalance = (state) => {
  return selectLastMonthIncome(state) - selectLastMonthExpense(state)
}

/**
 * ════════════════════════════════════════════════════════════════
 * 3. COMPARISON & TREND METRICS
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Income growth percentage (this month vs last month)
 * Formula: ((thisMonth - lastMonth) / lastMonth) * 100
 * Positive = growth, Negative = decline
 */
export const selectIncomeGrowthPercent = (state) => {
  const thisMonth = selectThisMonthIncome(state)
  const lastMonth = selectLastMonthIncome(state)

  if (lastMonth === 0) {
    return thisMonth > 0 ? 100 : 0 // If no income last month, 100% growth if income this month
  }

  return Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
}

/**
 * Expense growth percentage (this month vs last month)
 */
export const selectExpenseGrowthPercent = (state) => {
  const thisMonth = selectThisMonthExpense(state)
  const lastMonth = selectLastMonthExpense(state)

  if (lastMonth === 0) {
    return thisMonth > 0 ? 100 : 0
  }

  return Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
}

/**
 * Savings amount (income - expense)
 */
export const selectMonthlyNetSavings = (state) => {
  return selectThisMonthIncome(state) - selectThisMonthExpense(state)
}

/**
 * Savings rate percentage
 * Formula: (savings / income) * 100
 */
export const selectSavingsRate = (state) => {
  const income = selectThisMonthIncome(state)
  const savings = selectMonthlyNetSavings(state)

  if (income === 0) return 0
  return Math.round((savings / income) * 100)
}

/**
 * Expense ratio percentage
 * Formula: (expense / income) * 100
 */
export const selectExpenseRatio = (state) => {
  const income = selectThisMonthIncome(state)
  const expense = selectThisMonthExpense(state)

  if (income === 0) return 0
  return Math.round((expense / income) * 100)
}

/**
 * ════════════════════════════════════════════════════════════════
 * 4. CATEGORY BREAKDOWN
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Spending breakdown by category (all time)
 * Returns: { category: { total, percentage, transactions_count } }
 */
export const selectSpendingByCategory = (state) => {
  const transactions = selectAllTransactions(state)
  const expenses = transactions.filter((txn) => txn.type === 'expense')
  const totalExpense = selectTotalExpense(state)

  const categoryMap = {}

  expenses.forEach((txn) => {
    const category = txn.category || 'Uncategorized'
    if (!categoryMap[category]) {
      categoryMap[category] = { total: 0, count: 0 }
    }
    categoryMap[category].total += txn.amount || 0
    categoryMap[category].count += 1
  })

  // Convert to array with percentages
  return Object.entries(categoryMap)
    .map(([category, data]) => ({
      category,
      total: data.total,
      percentage: totalExpense > 0 ? Math.round((data.total / totalExpense) * 100) : 0,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.total - a.total)
}

/**
 * Spending breakdown by category for this month only
 */
export const selectThisMonthSpendingByCategory = (state) => {
  const thisMonth = getThisMonthTransactions(state)
  const expenses = thisMonth.filter((txn) => txn.type === 'expense')
  const totalExpense = selectThisMonthExpense(state)

  const categoryMap = {}

  expenses.forEach((txn) => {
    const category = txn.category || 'Uncategorized'
    if (!categoryMap[category]) {
      categoryMap[category] = { total: 0, count: 0 }
    }
    categoryMap[category].total += txn.amount || 0
    categoryMap[category].count += 1
  })

  return Object.entries(categoryMap)
    .map(([category, data]) => ({
      category,
      total: data.total,
      percentage: totalExpense > 0 ? Math.round((data.total / totalExpense) * 100) : 0,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.total - a.total)
}

/**
 * Top spending category
 */
export const selectTopSpendingCategory = (state) => {
  const byCategory = selectSpendingByCategory(state)
  return byCategory.length > 0 ? byCategory[0] : null
}

/**
 * ════════════════════════════════════════════════════════════════
 * 5. TRANSACTION INSIGHTS
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Recent transactions (last N)
 */
export const selectRecentTransactions = (state, limit = 5) => {
  const transactions = selectAllTransactions(state)
  return transactions.slice(0, limit)
}

/**
 * Total transaction count
 */
export const selectTransactionCount = (state) => {
  return selectAllTransactions(state).length
}

/**
 * Total transaction count this month
 */
export const selectThisMonthTransactionCount = (state) => {
  return getThisMonthTransactions(state).length
}

/**
 * Average transaction amount
 */
export const selectAverageTransactionAmount = (state) => {
  const transactions = selectAllTransactions(state)
  if (transactions.length === 0) return 0
  const total = transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0)
  return Math.round(total / transactions.length)
}

/**
 * Max transaction amount
 */
export const selectMaxTransactionAmount = (state) => {
  const transactions = selectAllTransactions(state)
  if (transactions.length === 0) return 0
  return Math.max(...transactions.map((txn) => txn.amount || 0))
}

/**
 * Largest expense
 */
export const selectLargestExpense = (state) => {
  const transactions = selectAllTransactions(state)
  const expenses = transactions.filter((txn) => txn.type === 'expense')
  if (expenses.length === 0) return null
  return expenses.reduce((max, txn) => (txn.amount > max.amount ? txn : max))
}

/**
 * Largest income
 */
export const selectLargestIncome = (state) => {
  const transactions = selectAllTransactions(state)
  const incomes = transactions.filter((txn) => txn.type === 'income')
  if (incomes.length === 0) return null
  return incomes.reduce((max, txn) => (txn.amount > max.amount ? txn : max))
}

/**
 * ════════════════════════════════════════════════════════════════
 * 6. SMART OBSERVATIONS & INSIGHTS
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Generate smart observations based on financial data
 * Returns array of insight objects: { type, message, severity, metric }
 */
export const selectSmartObservations = (state) => {
  const observations = []

  const totalBalance = selectTotalBalance(state)
  const savingsRate = selectSavingsRate(state)
  const incomeGrowth = selectIncomeGrowthPercent(state)
  const expenseGrowth = selectExpenseGrowthPercent(state)
  const thisMonthIncome = selectThisMonthIncome(state)
  const thisMonthExpense = selectThisMonthExpense(state)
  const topCategory = selectTopSpendingCategory(state)
  const expenseRatio = selectExpenseRatio(state)
  const transactionCount = selectThisMonthTransactionCount(state)

  // 1. Balance Status
  if (totalBalance < 0) {
    observations.push({
      type: 'warning',
      severity: 'high',
      metric: 'balance',
      message: `⚠️ Your balance is negative at ${totalBalance}. Consider reducing expenses or increasing income.`,
      value: totalBalance,
    })
  } else if (totalBalance > 0 && totalBalance < thisMonthIncome * 0.1) {
    observations.push({
      type: 'caution',
      severity: 'medium',
      metric: 'balance',
      message: `💭 Your balance is low. Try to build emergency savings of at least 3-6 months of expenses.`,
      value: totalBalance,
    })
  } else if (totalBalance > thisMonthIncome * 1) {
    observations.push({
      type: 'positive',
      severity: 'low',
      metric: 'balance',
      message: `✨ Great! You have a healthy balance. Consider investing or diversifying.`,
      value: totalBalance,
    })
  }

  // 2. Savings Rate
  if (savingsRate < 0) {
    observations.push({
      type: 'warning',
      severity: 'high',
      metric: 'savings',
      message: `⚠️ You're spending more than earning (${-savingsRate}% deficit). Review your expenses immediately.`,
      value: savingsRate,
    })
  } else if (savingsRate < 10) {
    observations.push({
      type: 'caution',
      severity: 'medium',
      metric: 'savings',
      message: `💭 Your savings rate is low (${savingsRate}%). Aim for at least 20% of income.`,
      value: savingsRate,
    })
  } else if (savingsRate >= 30) {
    observations.push({
      type: 'positive',
      severity: 'low',
      metric: 'savings',
      message: `🎯 Excellent savings rate (${savingsRate}%)! You're on track for financial goals.`,
      value: savingsRate,
    })
  }

  // 3. Income Growth
  if (incomeGrowth > 20) {
    observations.push({
      type: 'positive',
      severity: 'low',
      metric: 'income',
      message: `📈 Income growing strong (+${incomeGrowth}% vs last month)! Keep up this momentum.`,
      value: incomeGrowth,
    })
  } else if (incomeGrowth < -20) {
    observations.push({
      type: 'warning',
      severity: 'medium',
      metric: 'income',
      message: `📉 Income down ${incomeGrowth}% from last month. Check if this is seasonal or concerning.`,
      value: incomeGrowth,
    })
  }

  // 4. Expense Trend
  if (expenseGrowth > 30) {
    observations.push({
      type: 'warning',
      severity: 'high',
      metric: 'expense',
      message: `🚨 Expenses increased by ${expenseGrowth}%! Review spending and cut unnecessary costs.`,
      value: expenseGrowth,
    })
  } else if (expenseGrowth < -20) {
    observations.push({
      type: 'positive',
      severity: 'low',
      metric: 'expense',
      message: `👍 Great control! Expenses down ${-expenseGrowth}% from last month.`,
      value: expenseGrowth,
    })
  }

  // 5. Expense Ratio
  if (expenseRatio > 80) {
    observations.push({
      type: 'warning',
      severity: 'high',
      metric: 'spendingRatio',
      message: `🔴 You're spending ${expenseRatio}% of income. This leaves very little for savings.`,
      value: expenseRatio,
    })
  } else if (expenseRatio > 60) {
    observations.push({
      type: 'caution',
      severity: 'medium',
      metric: 'spendingRatio',
      message: `🟡 Spending ${expenseRatio}% of income. Try to reduce to 50% for better savings.`,
      value: expenseRatio,
    })
  }

  // 6. Top Category Analysis
  if (topCategory && topCategory.percentage > 40) {
    observations.push({
      type: 'caution',
      severity: 'medium',
      metric: 'topCategory',
      message: `📊 ${topCategory.category} accounts for ${topCategory.percentage}% of expenses. Consider if this is optimal.`,
      value: topCategory.percentage,
      category: topCategory.category,
    })
  }

  // 7. Activity Level
  if (transactionCount === 0) {
    observations.push({
      type: 'neutral',
      severity: 'low',
      metric: 'activity',
      message: `📋 No transactions logged this month yet. Start tracking your finances.`,
      value: transactionCount,
    })
  } else if (transactionCount > 50) {
    observations.push({
      type: 'positive',
      severity: 'low',
      metric: 'activity',
      message: `📊 You're actively tracking finances (${transactionCount} transactions). Great habit!`,
      value: transactionCount,
    })
  }

  // 8. Income vs Expense Balance
  if (thisMonthIncome === 0) {
    observations.push({
      type: 'warning',
      severity: 'high',
      metric: 'income',
      message: `⚠️ No income recorded this month. Verify data or check if you have delayed income.`,
      value: thisMonthIncome,
    })
  } else if (thisMonthExpense > thisMonthIncome) {
    observations.push({
      type: 'warning',
      severity: 'high',
      metric: 'balance',
      message: `🚨 Expenses exceed income this month. Cut costs or boost income urgently.`,
      value: thisMonthExpense - thisMonthIncome,
    })
  }

  return observations
}

/**
 * Get a single key observation (best one to highlight)
 */
export const selectKeyObservation = (state) => {
  const observations = selectSmartObservations(state)
  
  // Priority: warning (high) > positive > caution > neutral
  const byPriority = ['warning', 'positive', 'caution', 'neutral']
  const byHighSeverity = ['high', 'medium', 'low']

  const sorted = observations.sort((a, b) => {
    const priorityDiff = byPriority.indexOf(a.type) - byPriority.indexOf(b.type)
    if (priorityDiff !== 0) return priorityDiff
    return byHighSeverity.indexOf(a.severity) - byHighSeverity.indexOf(b.severity)
  })

  return sorted[0] || null
}

/**
 * ════════════════════════════════════════════════════════════════
 * 7. DASHBOARD SUMMARY (All-in-one)
 * ════════════════════════════════════════════════════════════════
 */

/**
 * Get complete dashboard summary
 * Usage: useSelector(selectDashboardSummary)
 */
export const selectDashboardSummary = (state) => {
  return {
    // Core Balance
    totalBalance: selectTotalBalance(state),
    initialBalance: selectInitialBalance(state),
    transactionBalance: selectTransactionBalance(state),

    // All-time totals
    totalIncome: selectTotalIncome(state),
    totalExpense: selectTotalExpense(state),

    // This Month
    thisMonth: {
      income: selectThisMonthIncome(state),
      expense: selectThisMonthExpense(state),
      balance: selectThisMonthBalance(state),
      transactionCount: selectThisMonthTransactionCount(state),
    },

    // Last Month
    lastMonth: {
      income: selectLastMonthIncome(state),
      expense: selectLastMonthExpense(state),
      balance: selectLastMonthBalance(state),
    },

    // Growth Metrics
    growth: {
      incomePercent: selectIncomeGrowthPercent(state),
      expensePercent: selectExpenseGrowthPercent(state),
    },

    // Savings Analysis
    savings: {
      netAmount: selectMonthlyNetSavings(state),
      ratePercent: selectSavingsRate(state),
      expenseRatio: selectExpenseRatio(state),
    },

    // Categories
    spendingByCategory: selectSpendingByCategory(state),
    topCategory: selectTopSpendingCategory(state),

    // Transactions
    recentTransactions: selectRecentTransactions(state, 5),
    transactionCount: selectTransactionCount(state),
    averageTransaction: selectAverageTransactionAmount(state),
    largestExpense: selectLargestExpense(state),
    largestIncome: selectLargestIncome(state),

    // Insights
    observations: selectSmartObservations(state),
    keyObservation: selectKeyObservation(state),
  }
}

export default {
  selectTotalBalance,
  selectTotalIncome,
  selectTotalExpense,
  selectThisMonthIncome,
  selectThisMonthExpense,
  selectSavingsRate,
  selectSpendingByCategory,
  selectSmartObservations,
  selectDashboardSummary,
}
