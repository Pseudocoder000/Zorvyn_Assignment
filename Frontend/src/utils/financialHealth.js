/**
 * Financial Health Calculator
 * calculates comprehensive financial health score based on multiple metrics
 */

/**
 * Calculate Financial Health Score
 * 
 * Formula Components:
 * 1. Savings Rate (40% weight) - How much of income is saved
 *    - >30% = 100 (Excellent)
 *    - 20-30% = 85 (Good)
 *    - 10-20% = 70 (Fair)
 *    - 0-10% = 50 (Poor)
 *    - <0% = 20 (Critical)
 * 
 * 2. Expense Ratio (30% weight) - How much is spent vs earned
 *    - <30% = 100 (Excellent)
 *    - 30-50% = 85 (Good)
 *    - 50-70% = 70 (Fair)
 *    - 70-100% = 50 (Poor)
 *    - >100% = 20 (Critical - deficit)
 * 
 * 3. Balance Trend (20% weight) - Is balance improving?
 *    - Growing month-over-month = 100
 *    - Positive this month = 80
 *    - Neutral = 50
 *    - Negative = 30
 * 
 * 4. Category Diversity (10% weight) - Well-planned diverse spending
 *    - 6+ categories = 100
 *    - 4-5 categories = 80
 *    - 2-3 categories = 50
 *    - 1 category = 30
 *    - 0 categories = 10
 * 
 * Final Score = Weighted Average of all 4 metrics
 */
export const calculateFinancialHealth = (transactions, initialBalance = 0) => {
  if (!transactions || transactions.length === 0) {
    return {
      score: 50,
      color: '#f59e0b',
      status: 'Getting Started',
      breakdown: {
        savingsScore: 50,
        expenseScore: 50,
        balanceGrowthScore: 50,
        diversityScore: 50,
      },
      metrics: {
        savingsRate: 0,
        expenseRatio: 0,
        balance: initialBalance,
        incomeThisMonth: 0,
        expenseThisMonth: 0,
        categories: 0,
      }
    }
  }

  // ==========================================
  // 1️⃣ SAVINGS RATE (40% weight)
  // ==========================================
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((a, t) => a + (t.amount || 0), 0)
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((a, t) => a + (t.amount || 0), 0)

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0
  let savingsScore = 0
  if (savingsRate > 30) savingsScore = 100
  else if (savingsRate > 20) savingsScore = 85
  else if (savingsRate > 10) savingsScore = 70
  else if (savingsRate > 0) savingsScore = 50
  else savingsScore = 20

  // ==========================================
  // 2️⃣ EXPENSE RATIO (30% weight)
  // ==========================================
  const expenseRatio = totalIncome > 0 ? totalExpense / totalIncome : 1
  let expenseScore = 0
  if (expenseRatio < 0.3) expenseScore = 100
  else if (expenseRatio < 0.5) expenseScore = 85
  else if (expenseRatio < 0.7) expenseScore = 70
  else if (expenseRatio < 1) expenseScore = 50
  else expenseScore = 20

  // ==========================================
  // 3️⃣ BALANCE TREND (20% weight)
  // ==========================================
  const now = new Date()
  const thisMonth = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const lastMonth = transactions.filter(t => {
    const d = new Date(t.date)
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear()
  })

  const incomeThisMonth = thisMonth
    .filter(t => t.type === 'income')
    .reduce((a, t) => a + t.amount, 0)
  const expenseThisMonth = thisMonth
    .filter(t => t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0)
  const incomeLastMonth = lastMonth
    .filter(t => t.type === 'income')
    .reduce((a, t) => a + t.amount, 0)
  const expenseLastMonth = lastMonth
    .filter(t => t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0)

  const thisMonthBalance = incomeThisMonth - expenseThisMonth
  const lastMonthBalance = incomeLastMonth - expenseLastMonth

  let balanceGrowthScore = 50
  if (thisMonthBalance > lastMonthBalance && lastMonthBalance !== 0) {
    balanceGrowthScore = 100
  } else if (thisMonthBalance > 0) {
    balanceGrowthScore = 80
  } else if (thisMonthBalance < 0) {
    balanceGrowthScore = 30
  }

  // ==========================================
  // 4️⃣ CATEGORY DIVERSITY (10% weight)
  // ==========================================
  const uniqueCategories = new Set(transactions.map(t => t.category)).size
  let diversityScore = 0
  if (uniqueCategories >= 6) diversityScore = 100
  else if (uniqueCategories >= 4) diversityScore = 80
  else if (uniqueCategories >= 2) diversityScore = 50
  else if (uniqueCategories >= 1) diversityScore = 30
  else diversityScore = 10

  // ==========================================
  // 🎯 FINAL SCORE (Weighted Average)
  // ==========================================
  const finalScore = Math.round(
    savingsScore * 0.4 +           // 40% weight
    expenseScore * 0.3 +           // 30% weight
    balanceGrowthScore * 0.2 +     // 20% weight
    diversityScore * 0.1           // 10% weight
  )

  // Determine color based on score
  let color, status
  if (finalScore > 75) {
    color = '#10b981'  // Green - Excellent
    status = 'Excellent'
  } else if (finalScore > 60) {
    color = '#14b8a6'  // Teal - Good
    status = 'Good'
  } else if (finalScore > 40) {
    color = '#f59e0b'  // Amber - Fair
    status = 'Fair'
  } else {
    color = '#f87171'  // Red - Poor
    status = 'Needs Improvement'
  }

  // Calculate current balance
  const balance = initialBalance + totalIncome - totalExpense

  return {
    score: Math.min(100, Math.max(0, finalScore)),
    color,
    status,
    breakdown: {
      savingsScore,
      expenseScore,
      balanceGrowthScore,
      diversityScore,
    },
    metrics: {
      savingsRate: parseFloat(savingsRate.toFixed(1)),
      expenseRatio: parseFloat(expenseRatio.toFixed(2)),
      balance,
      incomeThisMonth,
      expenseThisMonth,
      thisMonthBalance,
      categories: uniqueCategories,
      totalIncome,
      totalExpense,
    },
    insights: [
      {
        metric: 'Savings Rate',
        value: `${savingsRate.toFixed(1)}%`,
        score: savingsScore,
        status: getSavingsStatus(savingsRate),
        advice: getSavingsAdvice(savingsRate),
      },
      {
        metric: 'Expense Ratio',
        value: `${expenseRatio.toFixed(1)}x`,
        score: expenseScore,
        status: getExpenseStatus(expenseRatio),
        advice: getExpenseAdvice(expenseRatio),
      },
      {
        metric: 'Monthly Balance',
        value: `₹${thisMonthBalance.toFixed(0)}`,
        score: balanceGrowthScore,
        status: getBalanceStatus(thisMonthBalance, lastMonthBalance),
        advice: getBalanceAdvice(thisMonthBalance, lastMonthBalance),
      },
      {
        metric: 'Category Diversity',
        value: `${uniqueCategories} categories`,
        score: diversityScore,
        status: getDiversityStatus(uniqueCategories),
        advice: getDiversityAdvice(uniqueCategories),
      },
    ]
  }
}

// Helper functions for status and advice
const getSavingsStatus = (rate) => {
  if (rate > 30) return 'Excellent'
  if (rate > 20) return 'Good'
  if (rate > 10) return 'Fair'
  if (rate > 0) return 'Poor'
  return 'Critical'
}

const getSavingsAdvice = (rate) => {
  if (rate > 30) return 'Great savings rate! Keep it up.'
  if (rate > 20) return 'Good savings. Aim for 30%+ for better security.'
  if (rate > 10) return 'Increase savings to 20%+ for financial security.'
  if (rate > 0) return 'Try to save at least 10-20% of income.'
  return 'Spending exceeds income. Review expenses urgently.'
}

const getExpenseStatus = (ratio) => {
  if (ratio < 0.3) return 'Excellent'
  if (ratio < 0.5) return 'Good'
  if (ratio < 0.7) return 'Fair'
  if (ratio < 1) return 'Poor'
  return 'Critical'
}

const getExpenseAdvice = (ratio) => {
  if (ratio < 0.3) return 'Very low spending ratio. Excellent control.'
  if (ratio < 0.5) return 'Good spending discipline. Keep monitoring.'
  if (ratio < 0.7) return 'Moderate spending. Try to reduce to 50%.'
  if (ratio < 1) return 'High spending. Reduce to less than income.'
  return 'Deficit spending detected. Cut expenses or increase income.'
}

const getBalanceStatus = (thisMonth, lastMonth) => {
  if (thisMonth > lastMonth && lastMonth !== 0) return 'Growing'
  if (thisMonth > 0) return 'Positive'
  if (thisMonth === 0) return 'Neutral'
  return 'Declining'
}

const getBalanceAdvice = (thisMonth, lastMonth) => {
  if (thisMonth > lastMonth && lastMonth !== 0) return 'Balance growing month-over-month. Good trend!'
  if (thisMonth > 0) return 'Positive balance this month. Maintain momentum.'
  if (thisMonth === 0) return 'Break-even month. Focus on building reserves.'
  return 'Negative balance. Review spending to prevent deficit.'
}

const getDiversityStatus = (categories) => {
  if (categories >= 6) return 'Excellent diversity'
  if (categories >= 4) return 'Good diversity'
  if (categories >= 2) return 'Moderate diversity'
  if (categories >= 1) return 'Limited diversity'
  return 'No categories'
}

const getDiversityAdvice = (categories) => {
  if (categories >= 6) return 'Well-planned diverse spending across categories.'
  if (categories >= 4) return 'Good variety in spending categories.'
  if (categories >= 2) return 'Consider expanding to more categories.'
  if (categories >= 1) return 'Diversify spending to multiple categories.'
  return 'Start categorizing transactions for better insights.'
}

/**
 * Get financial health status badge
 */
export const getHealthStatusBadge = (score) => {
  if (score > 75) return { text: 'Excellent', bg: '#10b98120', color: '#10b981' }
  if (score > 60) return { text: 'Good', bg: '#14b8a620', color: '#14b8a6' }
  if (score > 40) return { text: 'Fair', bg: '#f59e0b20', color: '#f59e0b' }
  return { text: 'Needs Improvement', bg: '#f8717120', color: '#f87171' }
}
