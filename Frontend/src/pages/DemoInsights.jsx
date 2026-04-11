import { useMemo } from 'react'
import { TrendingUp, Zap, Target, AlertCircle } from 'lucide-react'
import DemoLayout, { DEMO_TRANSACTIONS } from '../components/layout/DemoLayout'
import { formatCurrency } from '../utils/formatters'

export default function DemoInsights() {
  const insights = useMemo(() => {
    const totalIncome = DEMO_TRANSACTIONS.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const totalExpense = DEMO_TRANSACTIONS.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const balance = totalIncome - totalExpense
    const savingsRate = ((balance / totalIncome) * 100).toFixed(1)

    // Category breakdown
    const categorySpending = {}
    DEMO_TRANSACTIONS.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category
      categorySpending[cat] = (categorySpending[cat] || 0) + t.amount
    })

    const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0]
    const avgDailySpend = (totalExpense / 30).toFixed(0)
    const avgTransaction = (totalExpense / DEMO_TRANSACTIONS.filter(t => t.type === 'expense').length).toFixed(0)

    // Income breakdown
    const incomeBySource = {}
    DEMO_TRANSACTIONS.filter(t => t.type === 'income').forEach(t => {
      const src = t.category
      incomeBySource[src] = (incomeBySource[src] || 0) + t.amount
    })

    return {
      totalIncome,
      totalExpense,
      balance,
      savingsRate,
      categorySpending,
      topCategory,
      avgDailySpend,
      avgTransaction,
      incomeBySource,
    }
  }, [])

  const getCategoryIcon = (category) => {
    const icons = {
      housing: '🏠',
      rent: '🏠',
      food: '🍔',
      shopping: '🛍️',
      transport: '🚗',
      entertainment: '🎬',
      health: '⚕️',
      bills: '💡',
      salary: '💼',
      freelance: '👨‍💻',
      bonus: '🎉',
      dividend: '📈',
    }
    return icons[category.toLowerCase()] || '📌'
  }

  return (
    <DemoLayout>
      {/* Header */}
      <div className="space-y-1 mb-8">
        <h1 className="text-3xl font-extrabold gt">Insights & Analytics</h1>
        <p className="text-sm text-white/40 mt-0.5">Deep dive into your financial patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="gc p-6 rounded-xl border-l-4 border-green-500">
          <p className="text-xs text-white/50 mb-2">Total Income</p>
          <h3 className="text-2xl font-bold text-green-400">{formatCurrency(insights.totalIncome)}</h3>
          <p className="text-xs text-white/40 mt-2">All sources</p>
        </div>
        <div className="gc p-6 rounded-xl border-l-4 border-red-500">
          <p className="text-xs text-white/50 mb-2">Total Expenses</p>
          <h3 className="text-2xl font-bold text-red-400">{formatCurrency(insights.totalExpense)}</h3>
          <p className="text-xs text-white/40 mt-2">All categories</p>
        </div>
        <div className="gc p-6 rounded-xl border-l-4 border-primary">
          <p className="text-xs text-white/50 mb-2">Net Balance</p>
          <h3 className="text-2xl font-bold text-primary">{formatCurrency(insights.balance)}</h3>
          <p className="text-xs text-white/40 mt-2">Total saved</p>
        </div>
        <div className="gc p-6 rounded-xl border-l-4 border-amber-500">
          <p className="text-xs text-white/50 mb-2">Savings Rate</p>
          <h3 className="text-2xl font-bold text-amber-400">{insights.savingsRate}%</h3>
          <p className="text-xs text-white/40 mt-2">Of income</p>
        </div>
      </div>

      {/* Main Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Spending by Category */}
        <div className="gc p-6 rounded-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-amber-400" />
            Top Spending Categories
          </h2>
          <div className="space-y-3">
            {Object.entries(insights.categorySpending)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([category, amount]) => {
                const percentage = ((amount / insights.totalExpense) * 100).toFixed(1)
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(category)}</span>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="text-sm font-bold">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/50 h-full rounded-full transition"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/40">{percentage}% of total expenses</p>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Income Sources */}
        <div className="gc p-6 rounded-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-400" />
            Income Sources
          </h2>
          <div className="space-y-3">
            {Object.entries(insights.incomeBySource)
              .sort((a, b) => b[1] - a[1])
              .map(([source, amount]) => {
                const percentage = ((amount / insights.totalIncome) * 100).toFixed(1)
                return (
                  <div key={source} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(source)}</span>
                        {source.charAt(0).toUpperCase() + source.slice(1)}
                      </span>
                      <span className="text-sm font-bold text-green-400">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-500/50 h-full rounded-full transition"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/40">{percentage}% of total income</p>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Financial Health Recommendations */}
      <div className="gc p-6 rounded-xl">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target size={20} className="text-primary" />
          Financial Insights
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <AlertCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-400 mb-1">Excellent Savings Rate</h3>
              <p className="text-sm text-white/70">
                You're saving {insights.savingsRate}% of your income. Keep it up! This is well above the recommended 20%.
              </p>
            </div>
          </div>

          {insights.topCategory && (
            <div className="flex gap-3 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-400 mb-1">Top Spending Category</h3>
                <p className="text-sm text-white/70">
                  {insights.topCategory[0]} accounts for {((insights.topCategory[1] / insights.totalExpense) * 100).toFixed(1)}% of your spending ({formatCurrency(insights.topCategory[1])}). Monitor this category to optimize your budget.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-400 mb-1">Daily Spending Average</h3>
              <p className="text-sm text-white/70">
                You spend an average of {formatCurrency(insights.avgDailySpend)} per day. Your average transaction is {formatCurrency(insights.avgTransaction)}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="mt-12" />
    </DemoLayout>
  )
}
