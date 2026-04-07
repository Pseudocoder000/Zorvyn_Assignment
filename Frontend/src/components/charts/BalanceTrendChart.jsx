import { ResponsiveLine } from '@nivo/line'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

export default function BalanceTrendChart({ transactions }) {
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'

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

  const textColor  = isLight ? '#64748b'               : 'rgba(255,255,255,0.25)'
  const gridColor  = isLight ? 'rgba(20,184,166,0.12)' : 'rgba(255,255,255,0.04)'
  const tooltipBg  = isLight ? '#ffffff'               : '#0e0e1f'
  const tooltipClr = isLight ? '#0f172a'               : '#e2e8f0'

  return (
    <div style={{ height: 220 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 20, bottom: 45, left: 55 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        curve="monotoneX"
        axisBottom={{ tickSize: 0, tickPadding: 10 }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          format: v => `$${(v / 1000).toFixed(0)}k`
        }}
        gridYValues={4}
        theme={{
          grid: { line: { stroke: gridColor, strokeWidth: 1 } },
          axis: { ticks: { text: { fill: textColor, fontSize: 11 } } },
        }}
        colors={['#14b8a6']}
        lineWidth={2.5}
        enablePoints={true}
        pointSize={7}
        pointColor="#14b8a6"
        pointBorderWidth={2}
        pointBorderColor="#f59e0b"
        enableArea={true}
        areaOpacity={isLight ? 0.18 : 0.1}
        defs={[{
          id: 'tealGrad',
          type: 'linearGradient',
          colors: [
            { offset: 0,   color: '#14b8a6', opacity: isLight ? 0.5 : 0.35 },
            { offset: 100, color: '#f59e0b', opacity: 0 },
          ],
        }]}
        fill={[{ match: '*', id: 'tealGrad' }]}
        enableGridX={false}
        useMesh={true}
        tooltip={({ point }) => (
          <div style={{
            background: tooltipBg,
            border: '1px solid rgba(20,184,166,0.35)',
            borderRadius: '12px',
            padding: '8px 14px',
            boxShadow: isLight
              ? '0 4px 20px rgba(20,184,166,0.15)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            fontSize: '13px',
            fontWeight: 600,
            color: tooltipClr,
          }}>
            {point.data.xFormatted}:{' '}
            <span style={{ color: '#14b8a6' }}>${point.data.y?.toLocaleString()}</span>
          </div>
        )}
      />
    </div>
  )
}