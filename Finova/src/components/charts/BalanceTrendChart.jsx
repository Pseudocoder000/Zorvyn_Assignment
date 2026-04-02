import { ResponsiveLine } from '@nivo/line'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

export default function BalanceTrendChart({ transactions }) {
  const mode = useSelector(s => s.theme.mode)
  const isDark = mode === 'dark'

  const data = useMemo(() => {
  const months = {}
  transactions.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!months[key]) months[key] = 0
      months[key] += t.type === 'income' ? t.amount : -t.amount
    })
    const sorted = Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6)

    const { points } = sorted.reduce(
      (acc, [key, val]) => {
        const newTotal = acc.total + val
        const [y, m] = key.split('-')
        return {
          total: newTotal,
          points: [...acc.points, {
            x: new Date(+y, +m - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            y: Math.max(0, newTotal)
          }]
        }
      },
      { total: 0, points: [] }
    )

    return [{ id: 'Balance', data: points }]
  }, [transactions])

  const textColor = isDark ? '#94a3b8' : '#64748b'
  const gridColor = isDark ? '#1e293b' : '#f1f5f9'

  return (
    <div style={{ height: 240 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
        curve="monotoneX"
        axisBottom={{ tickSize: 0, tickPadding: 12, tickRotation: 0, tickTextColor: textColor }}
        axisLeft={{ tickSize: 0, tickPadding: 12, format: v => `$${(v/1000).toFixed(0)}k`, tickTextColor: textColor }}
        gridYValues={4}
        theme={{
          grid: { line: { stroke: gridColor, strokeWidth: 1 } },
          axis: { ticks: { text: { fill: textColor, fontSize: 11 } } },
        }}
        colors={['#6366f1']}
        lineWidth={2.5}
        enablePoints={true}
        pointSize={6}
        pointColor="#6366f1"
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableArea={true}
        areaOpacity={0.12}
        enableGridX={false}
        useMesh={true}
        tooltip={({ point }) => (
          <div className="bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border rounded-xl px-3 py-2 shadow-xl text-sm font-semibold text-gray-900 dark:text-white">
            {point.data.xFormatted}: <span className="text-brand-500">${point.data.yFormatted?.toLocaleString()}</span>
          </div>
        )}
      />
    </div>
  )
}