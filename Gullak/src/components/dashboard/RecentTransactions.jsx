import { formatCurrency, formatDate } from '../../utils/formatters'
import { CATEGORY_COLORS } from '../../data/mockTransactions'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../features/notifications/notificationSlice'
import toast from 'react-hot-toast'

export default function RecentTransactions({ transactions }) {
  const dispatch = useDispatch()
  const prevLength = useRef(transactions.length)

  useEffect(() => {
    if (transactions.length > prevLength.current) {
      const latest = transactions[transactions.length - 1]

      dispatch(
        addNotification(
          `₹${latest.amount} ${latest.type === 'income' ? 'received' : 'spent'} for ${latest.category}`
        )
      )

      toast.success("Transaction added 💸")
    }

    prevLength.current = transactions.length
  }, [transactions, dispatch])

  if (!transactions.length)
    return <div className="py-12 text-center text-white/25 text-sm">No transactions yet.</div>

  const groups = transactions.reduce((acc, t) => {
    if (!acc[t.date]) acc[t.date] = []
    acc[t.date].push(t)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([date, txns]) => (
        <div key={date}>
          <p className="text-xs text-white/30 mb-2">{formatDate(date)}</p>

          {txns.map(t => (
            <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-xl">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: CATEGORY_COLORS[t.category] + '22',
                  color: CATEGORY_COLORS[t.category]
                }}
              >
                {t.name[0]}
              </div>

              <div className="flex-1">
                <p className="text-sm text-white">{t.name}</p>
                <p className="text-xs text-white/40">{t.category}</p>
              </div>

              <span className={t.type === 'income' ? 'text-teal-400' : 'text-red-400'}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}