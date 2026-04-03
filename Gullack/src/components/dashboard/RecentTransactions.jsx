import { formatCurrency, formatDate } from '../../utils/formatters'
import { CATEGORY_COLORS } from '../../data/mockTransactions'
import Badge from '../ui/Badge'

export default function RecentTransactions({ transactions }) {
  if (!transactions.length) return (
    <div className="py-12 text-center text-white/25 text-sm">No transactions yet.</div>
  )

  // Group by date
  const groups = transactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = []
    acc[t.date].push(t)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([date, txns]) => (
        <div key={date}>
          <p className="text-xs text-white/30 font-medium mb-2 px-1">{formatDate(date)}</p>
          <div className="space-y-1">
            {txns.map(t => (
              <div key={t.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-all group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: CATEGORY_COLORS[t.category] + '22', color: CATEGORY_COLORS[t.category] }}>
                  {t.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate">{t.name}</p>
                  <p className="text-xs text-white/30">{t.category}</p>
                </div>
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-teal-400' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}