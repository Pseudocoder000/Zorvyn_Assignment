/**
 * ════════════════════════════════════════════════════════════════
 * SELECTOR USAGE GUIDE
 * ════════════════════════════════════════════════════════════════
 * 
 * Complete documentation for using Redux selectors to access
 * financial metrics, balance calculations, and smart observations
 * 
 * File: transactionsSelectors.js
 * Location: Frontend/src/features/transactions/transactionsSelectors.js
 */

// ════════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ════════════════════════════════════════════════════════════════
/*
  1. BASIC SELECTORS (Balance & Totals)
  2. MONTHLY SELECTORS (Time-based calculations)
  3. CATEGORY SELECTORS (Spending breakdown)
  4. GROWTH & RATIO SELECTORS (Analysis metrics)
  5. INSIGHT SELECTORS (Smart observations)
  6. COMPOSITE SELECTORS (All-in-one)
  7. COMPONENT INTEGRATION EXAMPLES
  8. BEST PRACTICES
*/

// ════════════════════════════════════════════════════════════════
// 1. BASIC SELECTORS
// ════════════════════════════════════════════════════════════════

/**
 * SELECTOR: selectInitialBalance
 * @returns {number} User's initial balance
 * 
 * Usage:
 * const initialBalance = useSelector(selectInitialBalance)
 * 
 * Example Result: 50000
 */

/**
 * SELECTOR: selectTotalIncome
 * @returns {number} Sum of all income transactions
 * 
 * Usage:
 * const totalIncome = useSelector(selectTotalIncome)
 * 
 * Formula: Sum of all transactions where type === 'income'
 * Example Result: 250000
 */

/**
 * SELECTOR: selectTotalExpense
 * @returns {number} Sum of all expenses
 * 
 * Usage:
 * const totalExpense = useSelector(selectTotalExpense)
 * 
 * Formula: Sum of all transactions where type === 'expense'
 * Example Result: 120000
 */

/**
 * SELECTOR: selectTotalBalance
 * @returns {number} Current balance
 * 
 * Usage:
 * const balance = useSelector(selectTotalBalance)
 * 
 * Formula: initialBalance + totalIncome - totalExpense
 * Example: 50000 + 250000 - 120000 = 180000
 */

// ════════════════════════════════════════════════════════════════
// 2. MONTHLY SELECTORS
// ════════════════════════════════════════════════════════════════

/**
 * SELECTOR: selectThisMonthIncome
 * @returns {number} Income for current month
 * 
 * Usage:
 * const thisMonthIncome = useSelector(selectThisMonthIncome)
 * 
 * Only counts transactions from current month with type='income'
 */

/**
 * SELECTOR: selectThisMonthExpense
 * @returns {number} Expenses for current month
 * 
 * Usage:
 * const thisMonthExpense = useSelector(selectThisMonthExpense)
 * 
 * Only counts transactions from current month with type='expense'
 */

/**
 * SELECTOR: selectThisMonthBalance
 * @returns {number} Net balance for current month
 * 
 * Formula: thisMonthIncome - thisMonthExpense
 * Example: 50000 - 20000 = 30000 (positive month!)
 */

/**
 * SELECTOR: selectLastMonthIncome
 * @returns {number} Income from previous month
 * 
 * Usage: For month-over-month comparison
 */

/**
 * SELECTOR: selectLastMonthExpense
 * @returns {number} Expenses from previous month
 */

/**
 * SELECTOR: selectLastMonthBalance
 * @returns {number} Net from last month
 */

// ════════════════════════════════════════════════════════════════
// 3. CATEGORY SELECTORS
// ════════════════════════════════════════════════════════════════

/**
 * SELECTOR: selectSpendingByCategory
 * @returns {Array} Sorted array of spending by category
 * 
 * Usage:
 * const breakdown = useSelector(selectSpendingByCategory)
 * 
 * Returns:
 * [
 *   {
 *     category: 'food',
 *     total: 15000,
 *     percentage: 35,
 *     transactionCount: 12
 *   },
 *   {
 *     category: 'transport',
 *     total: 8000,
 *     percentage: 18,
 *     transactionCount: 5
 *   },
 *   ...
 * ]
 * 
 * Sorted by highest spending first
 */

/**
 * SELECTOR: selectThisMonthSpendingByCategory
 * @returns {Array} Spending breakdown for current month only
 * 
 * Same structure as selectSpendingByCategory but filtered to current month
 */

/**
 * SELECTOR: selectTopSpendingCategory
 * @returns {Object} The category with most spending
 * 
 * Usage:
 * const topcat = useSelector(selectTopSpendingCategory)
 * // { category: 'food', total: 15000, percentage: 35, ... }
 */

// ════════════════════════════════════════════════════════════════
// 4. GROWTH & RATIO SELECTORS
// ════════════════════════════════════════════════════════════════

/**
 * SELECTOR: selectIncomeGrowthPercent
 * @returns {number} Income growth from last month to this month (%)
 * 
 * Formula: ((thisMonth - lastMonth) / lastMonth) * 100
 * 
 * Returns:
 * - Positive numbers = income increased
 * - Negative numbers = income decreased
 * - Example: 25 means 25% more income than last month
 */

/**
 * SELECTOR: selectExpenseGrowthPercent
 * @returns {number} Expense growth percentage
 * 
 * Warning: Positive = spending MORE (bad)
 *          Negative = spending LESS (good)
 */

/**
 * SELECTOR: selectSavingsRate
 * @returns {number} Percentage of income saved
 * 
 * Formula: (savings / totalIncome) * 100
 * 
 * Example: If income is 100k and savings is 20k, rate is 20%
 * Target: Aim for 20%+ savings rate
 */

/**
 * SELECTOR: selectExpenseRatio
 * @returns {number} Percentage of income spent
 * 
 * Formula: (totalExpense / totalIncome) * 100
 * 
 * Example: If spending 50k out of 100k income, ratio is 50%
 * Target: Keep below 70%
 */

/**
 * SELECTOR: selectNetSavings
 * @returns {number} Absolute amount saved
 * 
 * Formula: totalIncome - totalExpense
 */

/**
 * SELECTOR: selectThisMonthSavingsRate
 * @returns {number} This month's savings rate (%)
 */

// ════════════════════════════════════════════════════════════════
// 5. INSIGHT SELECTORS
// ════════════════════════════════════════════════════════════════

/**
 * SELECTOR: selectSmartObservations
 * @returns {Array} Array of insight objects about financial health
 * 
 * Usage:
 * const insights = useSelector(selectSmartObservations)
 * 
 * Returns:
 * [
 *   {
 *     type: 'positive' | 'warning' | 'caution' | 'neutral',
 *     severity: 'low' | 'medium' | 'high',
 *     message: "Your savings rate is healthy at 25%!"
 *   },
 *   ...
 * ]
 * 
 * Types:
 * - positive: Good financial behavior
 * - warning: Concerning trend
 * - caution: Something to pay attention to
 * - neutral: Factual observation
 * 
 * Includes up to 8+ different observation types:
 * 1. Balance status (positive/warning)
 * 2. Savings rate assessment
 * 3. Income trends
 * 4. Expense trends
 * 5. Spending ratio analysis
 * 6. Top spending category warnings
 * 7. Activity level assessment
 * 8. Income vs expense balance
 */

/**
 * SELECTOR: selectKeyObservation
 * @returns {Object|null} The most important observation
 * 
 * Usage:
 * const keyInsight = useSelector(selectKeyObservation)
 * 
 * Prioritizes observations by severity and type
 */

// ════════════════════════════════════════════════════════════════
// 6. COMPOSITE SELECTORS
// ════════════════════════════════════════════════════════════════

/**
 * SELECTOR: selectDashboardSummary
 * @returns {Object} Complete dashboard data in one selector
 * 
 * Usage:
 * const summary = useSelector(selectDashboardSummary)
 * 
 * Returns:
 * {
 *   // Main balance metrics
 *   initialBalance: 50000,
 *   totalIncome: 250000,
 *   totalExpense: 120000,
 *   totalBalance: 180000,
 *   
 *   // This month breakdown
 *   thisMonth: {
 *     income: 50000,
 *     expense: 20000,
 *     balance: 30000,  // thisMonth.income - thisMonth.expense
 *     transactionCount: 25
 *   },
 *   
 *   // Last month breakdown
 *   lastMonth: {
 *     income: 45000,
 *     expense: 18000,
 *     balance: 27000,
 *     transactionCount: 22
 *   },
 *   
 *   // Growth metrics
 *   growth: {
 *     incomePercent: 11.1,    // thisMonth vs lastMonth
 *     expensePercent: 11.1,
 *     balancePercent: 11.1
 *   },
 *   
 *   // Savings analysis
 *   savings: {
 *     netAmount: 130000,      // totalIncome - totalExpense
 *     ratePercent: 52,        // savings / income * 100
 *     expenseRatio: 48        // expense / income * 100
 *   },
 *   
 *   // Category breakdown
 *   spendingByCategory: [...],
 *   
 *   // Smart observations
 *   observations: [...],
 *   
 *   // Recent transactions
 *   recentTransactions: [
 *     { _id, type, amount, name, category, date, ... },
 *     ...
 *   ],
 *   
 *   // Meta
 *   transactionCount: 100,
 *   lastUpdated: timestamp
 * }
 * 
 * BEST PRACTICE:
 * Use this selector for dashboard pages to avoid multiple selector calls.
 * More efficient AND automatically updates when any dependency changes.
 */

// ════════════════════════════════════════════════════════════════
// 7. COMPONENT INTEGRATION EXAMPLES
// ════════════════════════════════════════════════════════════════

// EXAMPLE 1: Simple Balance Display (Sidebar)
// ────────────────────────────────────────────
/*
function Sidebar() {
  const balance = useSelector(selectTotalBalance)
  const income = useSelector(selectTotalIncome)
  const expense = useSelector(selectTotalExpense)
  
  return (
    <div>
      <h2>Balance: {formatCurrency(balance)}</h2>
      <p>Income: {formatCurrency(income)}</p>
      <p>Expense: {formatCurrency(expense)}</p>
    </div>
  )
}
*/

// EXAMPLE 2: Dashboard with All Metrics (Most Common)
// ────────────────────────────────────────────────────
/*
function Dashboard() {
  const summary = useSelector(selectDashboardSummary)
  const observations = useSelector(selectSmartObservations)
  
  return (
    <div>
      <BalanceCard value={summary.totalBalance} />
      
      <QuickStats
        income={summary.thisMonth.income}
        expense={summary.thisMonth.expense}
        savings={summary.savings.ratePercent}
      />
      
      <ObservationsCard items={observations} />
      
      <CategoryChart data={summary.spendingByCategory} />
      
      <RecentTransactions items={summary.recentTransactions} />
    </div>
  )
}
*/

// EXAMPLE 3: Monthly Comparison
// ────────────────────────────
/*
function MonthlyComparison() {
  const thisMonthIncome = useSelector(selectThisMonthIncome)
  const lastMonthIncome = useSelector(selectLastMonthIncome)
  const incomeGrowth = useSelector(selectIncomeGrowthPercent)
  
  return (
    <div>
      <p>This Month: {formatCurrency(thisMonthIncome)}</p>
      <p>Last Month: {formatCurrency(lastMonthIncome)}</p>
      <p>Growth: {incomeGrowth}%</p>
    </div>
  )
}
*/

// EXAMPLE 4: Category Breakdown
// ──────────────────────────────
/*
function SpendingBreakdown() {
  const categories = useSelector(selectSpendingByCategory)
  
  return (
    <div>
      {categories.map(cat => (
        <CategoryBar
          key={cat.category}
          label={cat.category}
          amount={cat.total}
          percentage={cat.percentage}
          count={cat.transactionCount}
        />
      ))}
    </div>
  )
}
*/

// EXAMPLE 5: Insights Page
// ────────────────────────
/*
function InsightsPage() {
  const observations = useSelector(selectSmartObservations)
  const savingsRate = useSelector(selectSavingsRate)
  const expenseRatio = useSelector(selectExpenseRatio)
  
  return (
    <div>
      <HealthScore rate={savingsRate} ratio={expenseRatio} />
      
      <ObservationsList items={observations} />
      
      <Recommendations
        savings={savingsRate}
        spending={expenseRatio}
      />
    </div>
  )
}
*/

// ════════════════════════════════════════════════════════════════
// 8. BEST PRACTICES
// ════════════════════════════════════════════════════════════════

/*

✅ DO:

1. Use selectDashboardSummary for complex pages
   // Gets all data in ONE selector call, automatically updates
   const summary = useSelector(selectDashboardSummary)

2. Use specific selectors for simple components
   // Each component gets only what it needs
   const balance = useSelector(selectTotalBalance)

3. Combine related selectors in one component
   // One selector call per component
   const income = useSelector(selectThisMonthIncome)
   const expense = useSelector(selectThisMonthExpense)

4. Use selectors in custom hooks
   // Reusable selector logic
   function useMonthlyMetrics() {
     const income = useSelector(selectThisMonthIncome)
     const expense = useSelector(selectThisMonthExpense)
     return { income, expense, net: income - expense }
   }

5. Memoize expensive component renders
   // Prevent unnecessary re-renders
   const Component = memo(({ summary }) => ...)

6. Always update transactions from backend
   // Selectors depend on fresh data
   useEffect(() => {
     dispatch(fetchTransactions())
   }, [])

❌ DON'T:

1. Don't recalculate in components
   // Use selectors instead
   ❌ const balance = initial + income - expense
   ✅ const balance = useSelector(selectTotalBalance)

2. Don't select too many times per component
   // Use composite selector instead
   ❌ const a = useSelector(selectA)
      const b = useSelector(selectB)
      const c = useSelector(selectC)
      const d = useSelector(selectD)
   ✅ const data = useSelector(selectAllData)

3. Don't create selectors for every tiny thing
   // Keep selectors focused on actual metrics
   ❌ selectMonthFromDate, selectCategoryColor, etc
   ✅ selectSpendingByCategory, selectThisMonthBalance

4. Don't assume selectors handle null checks
   // Always check if data exists
   ❌ items.map(...)
   ✅ (items || []).map(...)

5. Don't forget to load transactions
   // Selectors work on existing data only
   ✅ useEffect(() => {
     dispatch(fetchTransactions())
   }, [])

PERFORMANCE TIPS:

• Selectors are memoized, so they only recompute when input changes
• selectDashboardSummary is efficient - only recalculates when needed
• Use reselect library for very heavy calculations (already built in)
• Component memoization with memo() prevents cascading re-renders

*/

// ════════════════════════════════════════════════════════════════
// COMPLETE SELECTOR REFERENCE
// ════════════════════════════════════════════════════════════════

/*

BASIC METRICS:
  selectInitialBalance()
  selectTotalIncome()
  selectTotalExpense()
  selectTotalBalance()
  selectNetSavings()

MONTHLY METRICS:
  selectThisMonthIncome()
  selectThisMonthExpense()
  selectThisMonthBalance()
  selectLastMonthIncome()
  selectLastMonthExpense()
  selectLastMonthBalance()

CATEGORY ANALYSIS:
  selectSpendingByCategory()
  selectThisMonthSpendingByCategory()
  selectTopSpendingCategory()

GROWTH & RATIOS:
  selectIncomeGrowthPercent()
  selectExpenseGrowthPercent()
  selectSavingsRate()
  selectThisMonthSavingsRate()
  selectExpenseRatio()

INSIGHTS:
  selectSmartObservations()
  selectKeyObservation()

COMPOSITE:
  selectDashboardSummary()

Total: 25+ memoized selectors
All automatically reactive and cached

*/
