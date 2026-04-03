import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { CATEGORY_COLORS } from '../data/mockTransactions'
import { formatCurrency } from '../utils/formatters'
import { TrendingUp, Award, AlertCircle, BarChart2, CheckCircle, XCircle } from 'lucide-react'

export default function Insights() {
  const transactions = useSelector(s => s.transactions.items)

  const { topCategory, monthlyData, savingsRate, totalIncome, totalExpense } = useMemo(() => {
    const catTotals = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount
    })
    const topCategory = Object.entries(catTotals).sort(([,a],[,b]) => b - a)[0]

    const months = {}
    transactions.forEach(t => {
      const d = new Date(t.date)
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      if (!months[key]) months[key] = { month: key, Income: 0, Expense: 0 }
      if (t.type === 'income') months[key].Income += t.amount
      else months[key].Expense += t.amount
    })
    const monthlyData = Object.values(months).slice(-6)

    const totalIncome  = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const savingsRate  = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

    return { topCategory, monthlyData, savingsRate, totalIncome, totalExpense }
  }, [transactions])

  const cards = [
    { icon: Award,     title: 'Top Spending',  value: topCategory?.[0] || '—',    sub: topCategory ? formatCurrency(topCategory[1]) : '', color: '#f87171' },
    { icon: TrendingUp, title: 'Savings Rate',  value: `${savingsRate}%`,          sub: 'of total income',                                color: '#14b8a6' },
    { icon: BarChart2,  title: 'Total Income',  value: formatCurrency(totalIncome),  sub: 'all time',                                     color: '#34d399' },
    { icon: AlertCircle,title: 'Total Expenses',value: formatCurrency(totalExpense), sub: 'all time',                                     color: '#fbbf24' },
  ]

  const observations = [
    {
      ok: savingsRate > 20,
      text: savingsRate > 20
        ? `You're saving ${savingsRate}% of income — above the recommended 20%. Keep it up!`
        : `Savings rate is ${savingsRate}%. Try to reach at least 20% to build financial security.`
    },
    {
      ok: !!topCategory,
      text: topCategory ? `Highest spending: ${topCategory[0]} at ${formatCurrency(topCategory[1])}.` : 'No expense data yet.'
    },
    {
      ok: totalExpense <= totalIncome,
      text: totalExpense <= totalIncome
        ? 'Living within your means — expenses are below income.'
        : 'Expenses exceed income. Review your spending habits urgently.'
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold gt">Insights</h1>
        <p className="text-sm text-white/40 mt-0.5">Understand your financial patterns</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="gc-hover p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.color + '18', boxShadow: `0 0 16px ${card.color}30` }}>
                <Icon size={18} style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{card.title}</p>
                <p className="text-xs text-white/25 mt-0.5">{card.sub}</p>
              </div>
              <div className="h-0.5 rounded-full opacity-30"
                style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
            </div>
          )
        })}
      </div>

      {/* Bar Chart */}
      <div className="gc p-5">
        <h2 className="text-sm font-semibold text-white mb-0.5">Monthly Income vs Expenses</h2>
        <p className="text-xs text-white/30 mb-4">Last 6 months</p>
        <div style={{ height: 260 }}>
          <ResponsiveBar
            data={monthlyData}
            keys={['Income', 'Expense']}
            indexBy="month"
            margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
            padding={0.35}
            groupMode="grouped"
            colors={['#14b8a6', '#f87171']}
            borderRadius={6}
            axisBottom={{ tickSize: 0, tickPadding: 12 }}
            axisLeft={{ tickSize: 0, tickPadding: 10, format: v => `$${(v/1000).toFixed(0)}k` }}
            theme={{
              grid: { line: { stroke: 'rgba(255,255,255,0.04)', strokeWidth: 1 } },
              axis: { ticks: { text: { fill: 'rgba(255,255,255,0.25)', fontSize: 11 } } },
              legends: { text: { fill: 'rgba(255,255,255,0.4)', fontSize: 12 } },
            }}
            enableGridX={false}
            enableLabel={false}
            legends={[{
              dataFrom: 'keys', anchor: 'bottom', direction: 'row',
              translateY: 46, itemWidth: 80, itemHeight: 16,
              itemTextColor: 'rgba(255,255,255,0.4)', symbolSize: 10, symbolShape: 'circle',
            }]}
            tooltip={({ id, value, color }) => (
              <div style={{
                background: '#0e0e1f', border: `1px solid ${color}44`,
                borderRadius: '12px', padding: '8px 14px',
                fontSize: '13px', fontWeight: 600, color: '#e2e8f0',
              }}>
                <span style={{ color }}>● </span>{id}: ${value.toLocaleString()}
              </div>
            )}
          />
        </div>
      </div>

      {/* Observations */}
      <div className="gc p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Smart Observations</h2>
        <div className="space-y-3">
          {observations.map((obs, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              {obs.ok
                ? <CheckCircle size={16} className="text-teal-400 shrink-0 mt-0.5" />
                : <XCircle    size={16} className="text-red-400 shrink-0 mt-0.5" />
              }
              <p className="text-sm text-white/60">{obs.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}