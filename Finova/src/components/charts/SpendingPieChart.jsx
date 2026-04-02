import { ResponsivePie } from '@nivo/pie'
// import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { CATEGORY_COLORS } from '../../data/mockTransactions'

export default function SpendingPieChart({ transactions }) {
  // const mode = useSelector(s => s.theme.mode)
  // const isDark = mode === 'dark'

  const data = useMemo(() => {
    const totals = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })
    return Object.entries(totals)
      .sort(([,a],[,b]) => b - a)
      .map(([id, value]) => ({ id, label: id, value, color: CATEGORY_COLORS[id] }))
  }, [transactions])

  return (
    <div className="flex flex-col gap-4">
      {/* Chart */}
      <div style={{ height: 220 }}>
        <ResponsivePie
          data={data}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          innerRadius={0.6}
          padAngle={2}
          cornerRadius={4}
          colors={d => d.data.color}
          borderWidth={0}
          enableArcLinkLabels={false}
          enableArcLabels={false}
          tooltip={({ datum }) => (
            <div className="bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border rounded-xl px-3 py-2 shadow-xl text-sm font-semibold text-gray-900 dark:text-white">
              <span style={{ color: datum.color }}>● </span>
              {datum.label}: <span style={{ color: datum.color }}>${datum.value.toLocaleString()}</span>
            </div>
          )}
        />
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map(item => {
          const total = data.reduce((a, d) => a + d.value, 0)
          const pct = Math.round((item.value / total) * 100)
          return (
            <div key={item.id} className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">{item.id}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 shrink-0">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}