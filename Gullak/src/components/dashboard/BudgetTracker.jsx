import { useMemo } from 'react'
import { CATEGORY_COLORS, BUDGET_LIMITS } from '../../data/mockTransactions'
import { formatCurrency } from '../../utils/formatters'
import { AlertTriangle } from 'lucide-react'

export default function BudgetTracker({ transactions }) {
  const now = new Date()

  const spending = useMemo(() => {
    return transactions
      .filter(t => {
        const d = new Date(t.date)
        return (
          t.type === 'expense' &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        )
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
  }, [transactions])

  const categories = Object.entries(BUDGET_LIMITS).slice(0, 6)

  return (
    <div className="space-y-3">
      {categories.map(([cat, limit]) => {
        const spent = spending[cat] || 0
        const pct = Math.min(100, Math.round((spent / limit) * 100))
        const color = CATEGORY_COLORS[cat]
        const isOver = pct >= 100
        const isWarn = pct >= 80

        return (
          <div key={cat}>

            {/* HEADER (RESPONSIVE FIX) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">

              {/* LEFT */}
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: color }}
                />

                <span className="text-xs font-medium text-white/70 truncate max-w-[120px] sm:max-w-none">
                  {cat}
                </span>

                {(isOver || isWarn) && (
                  <AlertTriangle
                    size={11}
                    className={isOver ? 'text-red-400' : 'text-amber-400'}
                  />
                )}
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`text-xs font-semibold ${
                    isOver ? 'text-red-400' : 'text-white/60'
                  } truncate`}
                >
                  {formatCurrency(spent)}
                </span>

                <span className="text-xs text-white/25 whitespace-nowrap">
                  / {formatCurrency(limit)}
                </span>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: isOver
                    ? 'linear-gradient(90deg, #f87171, #ef4444)'
                    : isWarn
                    ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                    : `linear-gradient(90deg, ${color}, ${color}cc)`,
                  boxShadow: isOver
                    ? '0 0 8px rgba(248,113,113,0.5)'
                    : isWarn
                    ? '0 0 8px rgba(251,191,36,0.4)'
                    : `0 0 8px ${color}44`,
                }}
              />
            </div>

          </div>
        )
      })}
    </div>
  )
}