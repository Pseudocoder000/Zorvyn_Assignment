import { ResponsivePie } from '@nivo/pie'
import { useMemo } from 'react'
import { CATEGORY_COLORS } from '../../data/mockTransactions'
import { formatCurrency } from '../../utils/formatters'

export default function SpendingPieChart({ transactions }) {
  const data = useMemo(() => {
    const totals = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })
    return Object.entries(totals)
      .sort(([,a],[,b]) => b - a)
      .map(([id, value]) => ({ id, label: id, value, color: CATEGORY_COLORS[id] }))
  }, [transactions])

  const total = data.reduce((a, d) => a + d.value, 0)

  return (
    <div className="flex flex-col gap-4">
      <div style={{ height: 200 }}>
        <ResponsivePie
          data={data}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          innerRadius={0.65}
          padAngle={2.5}
          cornerRadius={5}
          colors={d => d.data.color}
          borderWidth={0}
          enableArcLinkLabels={false}
          enableArcLabels={false}
          tooltip={({ datum }) => (
            <div style={{
              background: '#0e0e1f',
              border: `1px solid ${datum.color}44`,
              borderRadius: '12px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#e2e8f0',
            }}>
              <span style={{ color: datum.color }}>● </span>
              {datum.label}: <span style={{ color: datum.color }}>{formatCurrency(datum.value)}</span>
            </div>
          )}
        />
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {data.slice(0, 8).map(item => (
          <div key={item.id} className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-xs text-white/50 truncate flex-1">{item.id}</span>
            <span className="text-xs font-semibold text-white/70 shrink-0">
              {Math.round((item.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}