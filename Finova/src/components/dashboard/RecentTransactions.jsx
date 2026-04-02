import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { CATEGORY_COLORS } from '../../data/mockTransactions'

export default function RecentTransactions({ transactions }) {
  if (!transactions.length) return <p className="text-sm text-gray-400 text-center py-8">No transactions yet.</p>
  return (
    <div className="space-y-3">
      {transactions.map(t => (
        <div key={t.id} className="flex items-center gap-4 py-2 border-b border-gray-100 dark:border-surface-border last:border-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
               style={{ backgroundColor: CATEGORY_COLORS[t.category] + '22', color: CATEGORY_COLORS[t.category] }}>
            {t.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.name}</p>
            <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge label={t.category} />
            <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}