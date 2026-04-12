/**
 * ════════════════════════════════════════════════════════════════
 * INSIGHTS PAGE - Smart Observations & Financial Analysis
 * ════════════════════════════════════════════════════════════════
 * 
 * Displays financial insights, trends, and smart observations
 * derived from transaction data using Redux selectors
 * 
 * Usage: <InsightsNew />
 */

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'

import { formatCurrency } from '../../utils/formatters'
import { fetchTransactions } from '../transactions/transactionsSlice'
import {
  selectSmartObservations,
  selectThisMonthIncome,
  selectThisMonthExpense,
  selectLastMonthIncome,
  selectLastMonthExpense,
  selectSpendingByCategory,
  selectDashboardSummary,
  selectInitialBalance,
  selectTotalBalance,
} from '../transactions/transactionsSelectors'

export default function InsightsNew() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((s) => s.transactions)
  const isAuthenticated = useSelector((s) => !!s.auth.user)

  // Selectors
  const observations = useSelector(selectSmartObservations)
  const thisMonthIncome = useSelector(selectThisMonthIncome)
  const thisMonthExpense = useSelector(selectThisMonthExpense)
  const lastMonthIncome = useSelector(selectLastMonthIncome)
  const lastMonthExpense = useSelector(selectLastMonthExpense)
  const spendingByCategory = useSelector(selectSpendingByCategory)
  const summary = useSelector(selectDashboardSummary)
  const initialBalance = useSelector(selectInitialBalance)
  const totalBalance = useSelector(selectTotalBalance)

  // Load transactions on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    dispatch(fetchTransactions({ page: 1, limit: 100 }))
  }, [dispatch, isAuthenticated, navigate])

  if (loading && !observations) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  const thisMonthNet = thisMonthIncome - thisMonthExpense
  const lastMonthNet = lastMonthIncome - lastMonthExpense
  const incomeGrowth =
    lastMonthIncome > 0
      ? (((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100).toFixed(1)
      : thisMonthIncome > 0
      ? 100
      : 0

  const expenseGrowth =
    lastMonthExpense > 0
      ? (((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100).toFixed(1)
      : 0

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Financial Insights 📊</h1>
        <p className="text-gray-400">Analysis and smart observations about your finances</p>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Smart Observations */}
      <SmartObservationsSection observations={observations} />

      {/* Key Metrics */}
      <KeyMetricsSection
        thisMonthIncome={thisMonthIncome}
        thisMonthExpense={thisMonthExpense}
        thisMonthNet={thisMonthNet}
        incomeGrowth={incomeGrowth}
        expenseGrowth={expenseGrowth}
        totalBalance={totalBalance}
        initialBalance={initialBalance}
      />

      {/* Month Comparison */}
      <MonthComparisonSection
        thisMonth={{ income: thisMonthIncome, expense: thisMonthExpense, net: thisMonthNet }}
        lastMonth={{ income: lastMonthIncome, expense: lastMonthExpense, net: lastMonthNet }}
      />

      {/* Spending Analysis */}
      <SpendingAnalysisSection
        spendingByCategory={spendingByCategory}
        total={thisMonthExpense}
        summary={summary}
      />

      {/* Financial Health */}
      <FinancialHealthSection summary={summary} />

      {/* Recommendations */}
      <RecommendationsSection
        savingsRate={summary.savings.ratePercent}
        topCategory={spendingByCategory?.[0]}
        expenseRatio={summary.savings.expenseRatio}
      />
    </div>
  )
}

/**
 * Smart Observations Section
 */
function SmartObservationsSection({ observations }) {
  const getObservationIcon = (type) => {
    const icons = {
      warning: AlertCircle,
      positive: TrendingUp,
      caution: AlertCircle,
      neutral: Lightbulb,
    }
    return icons[type] || Lightbulb
  }

  const getObservationColor = (type) => {
    const colors = {
      warning: 'border-red-500/30 bg-red-900/20 text-red-300',
      positive: 'border-green-500/30 bg-green-900/20 text-green-300',
      caution: 'border-yellow-500/30 bg-yellow-900/20 text-yellow-300',
      neutral: 'border-blue-500/30 bg-blue-900/20 text-blue-300',
    }
    return colors[type] || colors.neutral
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Lightbulb size={28} className="text-yellow-400" />
        Smart Observations
      </h2>

      {observations && observations.length > 0 ? (
        <div className="space-y-4">
          {observations.map((obs, idx) => {
            const Icon = getObservationIcon(obs.type)
            const color = getObservationColor(obs.type)

            return (
              <div key={idx} className={`border rounded-xl p-5 flex gap-4 ${color}`}>
                <Icon size={24} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-base">{obs.message}</p>
                  <p className="text-xs mt-2 opacity-75">
                    Type: <span className="capitalize font-medium">{obs.type}</span> •
                    Severity: <span className="capitalize font-medium">{obs.severity}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12">
          No observations yet. Keep tracking your transactions!
        </p>
      )}
    </div>
  )
}

/**
 * Key Metrics Section
 */
function KeyMetricsSection({
  thisMonthIncome,
  thisMonthExpense,
  thisMonthNet,
  incomeGrowth,
  expenseGrowth,
  totalBalance,
  initialBalance,
}) {
  return (
    <div className="grid md:grid-cols-5 gap-4">
      {/* Current Balance */}
      <MetricCard
        title="Current Balance"
        value={formatCurrency(totalBalance)}
        icon={Award}
        iconColor="text-purple-400"
        details={`Initial: ${formatCurrency(initialBalance)}`}
        trend={totalBalance >= initialBalance ? 'up' : 'down'}
      />

      {/* This Month Income */}
      <MetricCard
        title="This Month Income"
        value={formatCurrency(thisMonthIncome)}
        icon={ArrowDownLeft}
        iconColor="text-green-400"
        details={`${incomeGrowth > 0 ? '+' : ''}${incomeGrowth}% vs last month`}
        trend={incomeGrowth >= 0 ? 'up' : 'down'}
      />

      {/* This Month Expense */}
      <MetricCard
        title="This Month Expense"
        value={formatCurrency(thisMonthExpense)}
        icon={ArrowUpRight}
        iconColor="text-red-400"
        details={`${expenseGrowth > 0 ? '+' : ''}${expenseGrowth}% vs last month`}
        trend={expenseGrowth <= 0 ? 'up' : 'down'}
      />

      {/* Net Savings */}
      <MetricCard
        title="Net Saved This Month"
        value={formatCurrency(thisMonthNet)}
        icon={Target}
        iconColor={thisMonthNet >= 0 ? 'text-teal-400' : 'text-red-400'}
        details={thisMonthNet >= 0 ? 'Positive balance!' : 'Spend less this month'}
        trend={thisMonthNet >= 0 ? 'up' : 'down'}
      />

      {/* Balance vs Initial */}
      <MetricCard
        title="Change Since Start"
        value={formatCurrency(totalBalance - initialBalance)}
        icon={TrendingUp}
        iconColor={totalBalance >= initialBalance ? 'text-green-400' : 'text-red-400'}
        details={
          totalBalance >= initialBalance
            ? 'You\'re going up! 📈'
            : 'Time to save more 📉'
        }
        trend={totalBalance >= initialBalance ? 'up' : 'down'}
      />
    </div>
  )
}

/**
 * Metric Card Component
 */
function MetricCard({ title, value, icon: Icon, iconColor, details, trend }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-gray-300 font-semibold text-xs uppercase">{title}</h3>
        <Icon size={18} className={iconColor} />
      </div>

      <p className="text-2xl font-bold text-white mb-2">{value}</p>

      <p className="text-xs text-gray-400 flex items-center gap-1">
        {trend === 'up' ? (
          <TrendingUp size={14} className="text-green-400" />
        ) : (
          <TrendingDown size={14} className="text-red-400" />
        )}
        {details}
      </p>
    </div>
  )
}

/**
 * Month Comparison
 */
function MonthComparisonSection({ thisMonth, lastMonth }) {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
  const lastMonthName = lastDate.toLocaleString('default', { month: 'long' })

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <Calendar size={28} className="text-blue-400" />
        Month Comparison
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* This Month */}
        <ComparisonCard
          month={currentMonth}
          income={thisMonth.income}
          expense={thisMonth.expense}
          net={thisMonth.net}
          isCurrent={true}
        />

        {/* Last Month */}
        <ComparisonCard
          month={lastMonthName}
          income={lastMonth.income}
          expense={lastMonth.expense}
          net={lastMonth.net}
          isCurrent={false}
        />
      </div>

      {/* Comparison Summary */}
      <div className="mt-8 pt-8 border-t border-slate-700 grid md:grid-cols-3 gap-4">
        <ComparisonDiff
          label="Income Change"
          value={thisMonth.income - lastMonth.income}
          type="income"
        />
        <ComparisonDiff
          label="Expense Change"
          value={thisMonth.expense - lastMonth.expense}
          type="expense"
        />
        <ComparisonDiff
          label="Savings Change"
          value={thisMonth.net - lastMonth.net}
          type="savings"
        />
      </div>
    </div>
  )
}

/**
 * Comparison Card Component
 */
function ComparisonCard({ month, income, expense, net, isCurrent }) {
  return (
    <div className={`p-6 rounded-xl border ${isCurrent ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-700/20 border-slate-700'}`}>
      <h3 className={`text-lg font-bold mb-6 ${isCurrent ? 'text-teal-400' : 'text-gray-400'}`}>
        {month} {isCurrent && '(Current)'}
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Income</span>
          <span className="font-semibold text-green-400">+{formatCurrency(income)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Expenses</span>
          <span className="font-semibold text-red-400">-{formatCurrency(expense)}</span>
        </div>
        <div className="h-px bg-slate-600 my-2"></div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-semibold">Net</span>
          <span className={`font-bold ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(net)}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Comparison Difference Component
 */
function ComparisonDiff({ label, value, type }) {
  const isPositive = value >= 0
  const colorClass =
    type === 'savings'
      ? isPositive
        ? 'text-green-400'
        : 'text-red-400'
      : type === 'expense'
      ? isPositive
        ? 'text-red-400'
        : 'text-green-400'
      : isPositive
      ? 'text-green-400'
      : 'text-red-400'

  return (
    <div className="text-center p-4 bg-slate-700/30 rounded-lg">
      <p className="text-gray-400 text-xs mb-2">{label}</p>
      <div className={`text-2xl font-bold ${colorClass}`}>
        {isPositive ? '+' : ''}{formatCurrency(Math.abs(value))}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {isPositive ? '↑ Increased' : '↓ Decreased'}
      </div>
    </div>
  )
}

/**
 * Spending Analysis
 */
function SpendingAnalysisSection({ spendingByCategory, total, summary }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <PieChart size={28} className="text-orange-400" />
        Spending Breakdown
      </h2>

      {spendingByCategory && spendingByCategory.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {spendingByCategory.map((category) => (
              <div key={category.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 capitalize font-medium">
                    {category.category}
                  </span>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatCurrency(category.total)}</p>
                    <p className="text-xs text-gray-400">{category.percentage}%</p>
                  </div>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {category.transactionCount} transactions
                </p>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="pt-6 border-t border-slate-700 space-y-2">
            <p className="text-gray-400 text-sm">
              Your top spending category is{' '}
              <span className="text-orange-400 font-semibold capitalize">
                {spendingByCategory[0]?.category}
              </span>{' '}
              at <span className="text-white font-bold">{spendingByCategory[0]?.percentage}%</span> of
              total expenses.
            </p>
            <p className="text-gray-400 text-sm">
              Total spending: <span className="text-red-400 font-bold">{formatCurrency(total)}</span>
            </p>
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-center py-12">No spending data yet</p>
      )}
    </div>
  )
}

/**
 * Financial Health
 */
function FinancialHealthSection({ summary }) {
  const score = ((summary.savings.ratePercent / 20) * 100).toFixed(0)

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
        <Target size={28} className="text-green-400" />
        Financial Health
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <HealthMetric
          title="Savings Rate"
          value={`${summary.savings.ratePercent}%`}
          target="Aim for 20%+"
          status={summary.savings.ratePercent >= 20 ? 'good' : summary.savings.ratePercent >= 10 ? 'fair' : 'poor'}
        />

        <HealthMetric
          title="Expense Ratio"
          value={`${summary.savings.expenseRatio}%`}
          target="Keep below 70%"
          status={summary.savings.expenseRatio <= 50 ? 'good' : summary.savings.expenseRatio <= 70 ? 'fair' : 'poor'}
        />

        <HealthMetric
          title="Transaction Activity"
          value={`${summary.transactionCount}`}
          target="transactions logged"
          status="neutral"
        />
      </div>
    </div>
  )
}

/**
 * Health Metric Component
 */
function HealthMetric({ title, value, target, status }) {
  const statusColors = {
    good: 'border-green-500/30 bg-green-900/20 text-green-300',
    fair: 'border-yellow-500/30 bg-yellow-900/20 text-yellow-300',
    poor: 'border-red-500/30 bg-red-900/20 text-red-300',
    neutral: 'border-blue-500/30 bg-blue-900/20 text-blue-300',
  }

  return (
    <div className={`border rounded-lg p-6 ${statusColors[status]}`}>
      <p className="text-sm uppercase tracking-wider font-semibold mb-2">{title}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-xs">{target}</p>
    </div>
  )
}

/**
 * Recommendations
 */
function RecommendationsSection({ savingsRate, topCategory, expenseRatio }) {
  const recommendations = []

  if (savingsRate < 10) {
    recommendations.push({
      priority: 'high',
      message: 'Try to increase your savings rate. Aim for at least 10-20% of your income.',
    })
  }

  if (expenseRatio > 70) {
    recommendations.push({
      priority: 'high',
      message: 'Your expenses are quite high. Look for areas to cut back.',
    })
  }

  if (topCategory && topCategory.percentage > 40) {
    recommendations.push({
      priority: 'medium',
      message: `Your ${topCategory.category} spending is high at ${topCategory.percentage}%. Consider reducing it.`,
    })
  }

  if (savingsRate >= 20) {
    recommendations.push({
      priority: 'low',
      message: 'Great job! You\'re maintaining a healthy savings rate. Keep it up! 🎉',
    })
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Lightbulb size={28} className="text-yellow-400" />
        Recommendations
      </h2>

      {recommendations.length > 0 ? (
        <div className="space-y-3">
          {recommendations.map((rec, idx) => {
            const colors = {
              high: 'border-red-500/30 bg-red-900/20 text-red-300',
              medium: 'border-yellow-500/30 bg-yellow-900/20 text-yellow-300',
              low: 'border-green-500/30 bg-green-900/20 text-green-300',
            }

            return (
              <div key={idx} className={`border p-4 rounded-lg ${colors[rec.priority]}`}>
                <p className="text-sm">{rec.message}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">Keep tracking to get personalized recommendations</p>
      )}
    </div>
  )
}
