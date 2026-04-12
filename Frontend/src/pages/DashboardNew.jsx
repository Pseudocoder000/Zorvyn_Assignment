/**
 * ════════════════════════════════════════════════════════════════
 * DASHBOARD COMPONENT - Complete Implementation with Real Data
 * ════════════════════════════════════════════════════════════════
 * 
 * Shows all financial metrics, trends, and insights derived from
 * transactions and user profile using Redux selectors.
 * 
 * Usage: <Dashboard />
 * 
 * Features:
 * - Real-time balance calculation
 * - Monthly comparison
 * - Spending breakdown
 * - Smart observations
 * - Recent transactions
 */

import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Zap,
  Target,
  PieChart,
  Calendar,
  Eye,
  Lightbulb,
} from 'lucide-react'

import { formatCurrency } from '../../utils/formatters'
import { fetchTransactions } from '../transactions/transactionsSlice'

// Import all selectors
import {
  selectDashboardSummary,
  selectSmartObservations,
  selectKeyObservation,
  selectThisMonthBalance,
  selectInitialBalance,
  selectSpendingByCategory,
} from '../transactions/transactionsSelectors'

export default function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const { loading, error } = useSelector((s) => s.transactions)

  // Get complete summary with one selector
  const summary = useSelector(selectDashboardSummary)

  // Get key observation
  const keyObservation = useSelector(selectKeyObservation)

  // Load transactions on mount
  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 100 })).catch(() => {
      toast.error('Failed to load transactions')
    })
  }, [dispatch])

  if (loading && !summary.totalBalance) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-400">Here's your financial overview</p>
      </div>

      {/* Main Balance Card */}
      <BalanceCard summary={summary} user={user} />

      {/* Key Insight Alert */}
      {keyObservation && <KeyInsightCard insight={keyObservation} />}

      {/* Quick Stats */}
      <QuickStatsGrid summary={summary} />

      {/* Bank Account Section */}
      {user?.bankName && <BankAccountCard user={user} />}

      {/* Monthly Comparison */}
      <MonthlyComparisonCard summary={summary} />

      {/* Spending Breakdown */}
      <SpendingBreakdownCard spendingByCategory={summary.spendingByCategory} />

      {/* Insights & Observations */}
      <SmartObservationsCard observations={summary.observations} />

      {/* Recent Transactions */}
      <RecentTransactionsCard transactions={summary.recentTransactions} />

      {/* Financial Health Metrics */}
      <FinancialHealthCard summary={summary} />
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Balance Card
 * ════════════════════════════════════════════════════════════════
 * Primary balance display with breakdown
 */
function BalanceCard({ summary, user }) {
  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-white shadow-2xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-teal-100 mb-2 text-lg">Total Balance</p>
          <h2 className="text-6xl font-bold">{formatCurrency(summary.totalBalance)}</h2>
          <p className="text-teal-100 mt-2 text-sm">
            {summary.totalBalance >= 0 ? '✨ You\'re in good shape!' : '⚠️ Negative balance'}
          </p>
        </div>
        <Wallet size={50} className="opacity-20" />
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-teal-500/30">
        <div>
          <p className="text-teal-100 text-xs mb-1 uppercase tracking-wider">Initial Balance</p>
          <p className="text-2xl font-bold">{formatCurrency(summary.initialBalance)}</p>
        </div>
        <div>
          <p className="text-green-100 text-xs mb-1 uppercase tracking-wider">Income</p>
          <p className="text-2xl font-bold text-green-300">+{formatCurrency(summary.totalIncome)}</p>
        </div>
        <div>
          <p className="text-red-100 text-xs mb-1 uppercase tracking-wider">Expenses</p>
          <p className="text-2xl font-bold text-red-300">-{formatCurrency(summary.totalExpense)}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Key Insight Card
 * ════════════════════════════════════════════════════════════════
 * Highlights the most important observation
 */
function KeyInsightCard({ insight }) {
  const getIconAndColor = (type) => {
    const config = {
      warning: { icon: AlertCircle, color: 'border-red-500/30 bg-red-900/20', textColor: 'text-red-400' },
      positive: { icon: Zap, color: 'border-green-500/30 bg-green-900/20', textColor: 'text-green-400' },
      caution: { icon: AlertCircle, color: 'border-yellow-500/30 bg-yellow-900/20', textColor: 'text-yellow-400' },
      neutral: { icon: Eye, color: 'border-blue-500/30 bg-blue-900/20', textColor: 'text-blue-400' },
    }
    return config[type] || config.neutral
  }

  const config = getIconAndColor(insight.type)
  const Icon = config.icon

  return (
    <div className={`border p-6 rounded-xl ${config.color} flex items-start gap-4`}>
      <Icon size={24} className={`flex-shrink-0 mt-1 ${config.textColor}`} />
      <div>
        <p className={`font-semibold ${config.textColor}`}>{insight.message}</p>
        <p className="text-gray-400 text-sm mt-1">
          Severity: <span className="capitalize font-medium">{insight.severity}</span>
        </p>
      </div>
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Quick Stats Grid
 * ════════════════════════════════════════════════════════════════
 * 4-column stats for key metrics
 */
function QuickStatsGrid({ summary }) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* This Month Income */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 font-semibold text-sm">This Month Income</h3>
          <TrendingUp size={20} className="text-green-400" />
        </div>
        <p className="text-3xl font-bold text-green-400">
          {formatCurrency(summary.thisMonth.income)}
        </p>
        {summary.growth.incomePercent !== 0 && (
          <p className={`text-sm mt-2 ${summary.growth.incomePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {summary.growth.incomePercent > 0 ? '↑' : '↓'} {Math.abs(summary.growth.incomePercent)}% vs last month
          </p>
        )}
      </div>

      {/* This Month Expense */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 font-semibold text-sm">This Month Expense</h3>
          <TrendingDown size={20} className="text-red-400" />
        </div>
        <p className="text-3xl font-bold text-red-400">
          {formatCurrency(summary.thisMonth.expense)}
        </p>
        {summary.growth.expensePercent !== 0 && (
          <p className={`text-sm mt-2 ${summary.growth.expensePercent > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {summary.growth.expensePercent > 0 ? '↑' : '↓'} {Math.abs(summary.growth.expensePercent)}% vs last month
          </p>
        )}
      </div>

      {/* Savings Rate */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 font-semibold text-sm">Savings Rate</h3>
          <Target size={20} className="text-purple-400" />
        </div>
        <p className="text-3xl font-bold text-purple-400">{summary.savings.ratePercent}%</p>
        <p className="text-sm text-gray-400 mt-2">
          Saved: {formatCurrency(summary.savings.netAmount)}
        </p>
      </div>

      {/* Net This Month */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 font-semibold text-sm">Net This Month</h3>
          <Wallet size={20} className="text-teal-400" />
        </div>
        <p
          className={`text-3xl font-bold ${
            summary.thisMonth.balance >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {formatCurrency(summary.thisMonth.balance)}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {summary.thisMonth.transactionCount} transactions
        </p>
      </div>
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Bank Account Card
 * ════════════════════════════════════════════════════════════════
 */
function BankAccountCard({ user }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Wallet size={24} className="text-teal-400" />
        Bank Account Details
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <p className="text-gray-400 text-sm mb-1">Bank Name</p>
          <p className="text-lg font-semibold text-white">{user.bankName}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">Account Number</p>
          <p className="text-lg font-semibold text-white">
            ****{user.accountNumber?.slice(-4) || '****'}
          </p>
        </div>
        {user.ifscCode && (
          <div>
            <p className="text-gray-400 text-sm mb-1">IFSC Code</p>
            <p className="text-lg font-semibold text-white">{user.ifscCode}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Monthly Comparison
 * ════════════════════════════════════════════════════════════════
 */
function MonthlyComparisonCard({ summary }) {
  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
  const lastMonth = lastDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Calendar size={24} className="text-blue-400" />
        Monthly Comparison
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* This Month */}
        <div className="space-y-3">
          <p className="text-gray-400 font-semibold text-sm mb-4">{currentMonth}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Income</span>
            <span className="text-green-400 font-semibold">
              +{formatCurrency(summary.thisMonth.income)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Expenses</span>
            <span className="text-red-400 font-semibold">
              -{formatCurrency(summary.thisMonth.expense)}
            </span>
          </div>
          <div className="h-px bg-slate-700 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-semibold">Net Savings</span>
            <span
              className={`font-bold ${
                summary.thisMonth.balance >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(summary.thisMonth.balance)}
            </span>
          </div>
        </div>

        {/* Last Month */}
        <div className="space-y-3">
          <p className="text-gray-400 font-semibold text-sm mb-4">{lastMonth}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Income</span>
            <span className="text-green-400 font-semibold">
              +{formatCurrency(summary.lastMonth.income)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Expenses</span>
            <span className="text-red-400 font-semibold">
              -{formatCurrency(summary.lastMonth.expense)}
            </span>
          </div>
          <div className="h-px bg-slate-700 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-semibold">Net Savings</span>
            <span
              className={`font-bold ${
                summary.lastMonth.balance >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(summary.lastMonth.balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Spending Breakdown
 * ════════════════════════════════════════════════════════════════
 */
function SpendingBreakdownCard({ spendingByCategory }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <PieChart size={24} className="text-orange-400" />
        Spending Breakdown
      </h3>

      {spendingByCategory && spendingByCategory.length > 0 ? (
        <div className="space-y-3">
          {spendingByCategory.slice(0, 6).map((category) => (
            <div key={category.category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300 capitalize font-medium">
                  {category.category}
                </span>
                <span className="text-white font-semibold">{category.percentage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                {formatCurrency(category.total)} • {category.transactionCount} transactions
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No spending data yet</p>
      )}
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Smart Observations
 * ════════════════════════════════════════════════════════════════
 */
function SmartObservationsCard({ observations }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Lightbulb size={24} className="text-yellow-400" />
        Smart Observations
      </h3>

      {observations && observations.length > 0 ? (
        <div className="space-y-3">
          {observations.slice(0, 5).map((obs, idx) => {
            const colors = {
              warning: 'border-red-500/30 bg-red-900/10 text-red-300',
              positive: 'border-green-500/30 bg-green-900/10 text-green-300',
              caution: 'border-yellow-500/30 bg-yellow-900/10 text-yellow-300',
              neutral: 'border-blue-500/30 bg-blue-900/10 text-blue-300',
            }

            return (
              <div key={idx} className={`border p-3 rounded-lg ${colors[obs.type] || colors.neutral}`}>
                <p className="text-sm">{obs.message}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No observations yet. Keep tracking!</p>
      )}
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Recent Transactions
 * ════════════════════════════════════════════════════════════════
 */
function RecentTransactionsCard({ transactions }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>

      {transactions && transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div
              key={txn._id}
              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div>
                <p className="font-semibold text-white">{txn.name}</p>
                <p className="text-xs text-gray-400">
                  {txn.category} • {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`font-bold ${txn.type === 'income' ? 'text-green-400' : 'text-red-400'}`}
              >
                {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No transactions yet</p>
      )}
    </div>
  )
}

/**
 * ════════════════════════════════════════════════════════════════
 * COMPONENT: Financial Health Metrics
 * ════════════════════════════════════════════════════════════════
 */
function FinancialHealthCard({ summary }) {
  const getHealthScore = () => {
    let score = 0

    if (summary.savingsRate >= 20) score += 20
    else if (summary.savings.ratePercent >= 10) score += 10

    if (summary.totalBalance > 0) score += 20

    if (summary.savings.expenseRatio <= 50) score += 20
    else if (summary.savings.expenseRatio <= 70) score += 10

    if (summary.growth.incomePercent >= 0) score += 15

    if (summary.growth.expensePercent <= 10) score += 15

    return score
  }

  const healthScore = getHealthScore()

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Financial Health Score</h3>

      <div className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#334155"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#06b6d4"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(healthScore / 100) * 282} 282`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-teal-400">{healthScore}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-400">Overall Financial Health</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Expense Ratio</p>
            <p className="text-xl font-bold text-white">{summary.savings.expenseRatio}%</p>
          </div>
          <div className="text-center p-3 bg-slate-700/50 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">Transactions</p>
            <p className="text-xl font-bold text-white">{summary.transactionCount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
