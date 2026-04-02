import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { CATEGORY_COLORS } from '../data/mockTransactions'
import { formatCurrency } from '../utils/formatters'
import { TrendingUp, Award, AlertCircle, BarChart2 } from 'lucide-react'

export default function Insights() {
  const transactions = useSelector(s => s.transactions.items)
  const mode = useSelector(s => s.theme.mode)
  const isDark = mode === 'dark'
  const textColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? '#1e293b' : '#f1f5f9'

  const { topCategory, monthlyData, savingsRate, totalIncome, totalExpense } = useMemo(() => {
    const catTotals = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount
    })
    const topCategory = Object.entries(catTotals).sort(([,a],[,b]) => b-a)[0]

    const months = {}
    transactions.forEach(t => {
      const d = new Date(t.date)
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      if (!months[key]) months[key] = { month: key, Income: 0, Expense: 0 }
      if (t.type === 'income') months[key].Income += t.amount
      else months[key].Expense += t.amount
    })
    const monthlyData = Object.values(months).slice(-6)

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((a,t) => a+t.amount, 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a,t) => a+t.amount, 0)
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

    return { topCategory, monthlyData, savingsRate, totalIncome, totalExpense }
  }, [transactions])

  const insights = [
    { icon: Award, color: 'brand', title: 'Top Spending Category', value: topCategory?.[0] || '—', sub: topCategory ? formatCurrency(topCategory[1]) + ' total' : '', iconColor: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
    { icon: TrendingUp, color: 'green', title: 'Savings Rate', value: `${savingsRate}%`, sub: 'of total income saved', iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: BarChart2, color: 'purple', title: 'Total Income', value: formatCurrency(totalIncome), sub: 'all time', iconColor: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { icon: AlertCircle, color: 'red', title: 'Total Expenses', value: formatCurrency(totalExpense), sub: 'all time', iconColor: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Understand your financial patterns</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border p-5 flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} border flex items-center justify-center`}>
                <Icon size={18} className={item.iconColor} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{item.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Monthly Income vs Expenses</h2>
        <p className="text-xs text-gray-400 mb-4">Last 6 months comparison</p>
        <div style={{ height: 280 }}>
          <ResponsiveBar
            data={monthlyData}
            keys={['Income', 'Expense']}
            indexBy="month"
            margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
            padding={0.35}
            groupMode="grouped"
            colors={['#10b981', '#f43f5e']}
            borderRadius={4}
            axisBottom={{ tickSize: 0, tickPadding: 12, tickTextColor: textColor }}
            axisLeft={{ tickSize: 0, tickPadding: 12, format: v => `$${(v/1000).toFixed(0)}k` }}
            theme={{
              grid: { line: { stroke: gridColor, strokeWidth: 1 } },
              axis: { ticks: { text: { fill: textColor, fontSize: 11 } } },
              legends: { text: { fill: textColor } },
            }}
            enableGridX={false}
            enableLabel={false}
            legends={[{
              dataFrom: 'keys', anchor: 'bottom', direction: 'row',
              translateY: 46, itemWidth: 80, itemHeight: 16,
              itemTextColor: textColor, symbolSize: 10, symbolShape: 'circle',
            }]}
            tooltip={({ id, value, color }) => (
              <div className="bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border rounded-xl px-3 py-2 shadow-xl text-sm font-semibold text-gray-900 dark:text-white">
                <span style={{ color }}>● </span>{id}: ${value.toLocaleString()}
              </div>
            )}
          />
        </div>
      </div>

      {/* Smart Observations */}
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Smart Observations</h2>
        <div className="space-y-3">
          {[
            savingsRate > 20 ? `✅ Great job! You're saving ${savingsRate}% of your income — above the recommended 20%.` : `⚠️ Your savings rate is ${savingsRate}%. Try to target at least 20% savings.`,
            topCategory ? `📊 Your highest spending category is ${topCategory[0]} at ${formatCurrency(topCategory[1])}.` : null,
            totalExpense > totalIncome ? `🔴 Your total expenses exceed your income. Review your spending habits.` : `🟢 You're living within your means — total expenses are below total income.`,
          ].filter(Boolean).map((obs, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-surface-border text-sm text-gray-700 dark:text-gray-300">
              {obs}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}