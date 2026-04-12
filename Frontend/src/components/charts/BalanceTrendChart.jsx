import { ResponsiveLine } from '@nivo/line'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

export default function BalanceTrendChart({ transactions, initialBalance = 0 }) {
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'

  const data = useMemo(() => {
    // Get last 6 months range
    const now = new Date()
    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      last6Months.push(`${year}-${month}`)
    }

    // Calculate monthly income and expenses
    const monthlyData = {}
    last6Months.forEach(key => {
      monthlyData[key] = { income: 0, expense: 0 }
    })

    transactions.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (monthlyData[key]) {
        if (t.type === 'income') {
          monthlyData[key].income += t.amount || 0
        } else if (t.type === 'expense') {
          monthlyData[key].expense += t.amount || 0
        }
      }
    })

    // Calculate running balance for each month (end-of-month balance)
    let runningBalance = initialBalance
    const points = last6Months.map(key => {
      const { income, expense } = monthlyData[key]
      const monthlyChange = income - expense
      runningBalance += monthlyChange
      const [y, m] = key.split('-')
      return {
        x: new Date(+y, +m - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        y: Math.max(0, runningBalance),
        monthlyIncome: income,
        monthlyExpense: expense,
        monthlyChange: monthlyChange
      }
    })

    return [{ id: 'Balance', data: points }]
  }, [transactions, initialBalance])

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
            padding: '12px 16px',
            boxShadow: isLight
              ? '0 4px 20px rgba(20,184,166,0.15)'
              : '0 4px 20px rgba(0,0,0,0.4)',
            fontSize: '13px',
            fontWeight: 600,
            color: tooltipClr,
          }}>
            <div style={{ marginBottom: '8px', fontWeight: 700 }}>{point.data.xFormatted}</div>
            <div style={{ fontSize: '12px', color: tooltipClr, opacity: 0.8, marginBottom: '6px' }}>
              <div>Income: <span style={{ color: '#10b981' }}>+${(point.data.monthlyIncome || 0).toLocaleString()}</span></div>
              <div>Expense: <span style={{ color: '#ef4444' }}>-${(point.data.monthlyExpense || 0).toLocaleString()}</span></div>
              <div>Change: <span style={{ color: point.data.monthlyChange >= 0 ? '#10b981' : '#ef4444' }}>{point.data.monthlyChange >= 0 ? '+' : ''}${(point.data.monthlyChange || 0).toLocaleString()}</span></div>
            </div>
            <div style={{ borderTop: '1px solid rgba(20,184,166,0.2)', paddingTop: '8px', color: '#14b8a6' }}>
              Balance: ${point.data.y?.toLocaleString()}
            </div>
          </div>
        )}
      />
    </div>
  )
}