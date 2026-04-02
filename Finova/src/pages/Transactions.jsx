import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { deleteTransaction, setFilter, resetFilter, selectFiltered } from '../features/transactions/transactionsSlice'
import { CATEGORIES, CATEGORY_COLORS } from '../data/mockTransactions'
import { formatCurrency, formatDate, exportToCSV } from '../utils/formatters'
import Badge from '../components/ui/Badge'
import { Search, Trash2, Plus, Download, RotateCcw } from 'lucide-react'
import AddTransactionModal from '../components/transactions/AddTransactionModal'

export default function Transactions() {
  const dispatch = useDispatch()
  const filtered = useSelector(selectFiltered)
  const filter = useSelector(s => s.transactions.filter)
  const role = useSelector(s => s.auth.role)
  const isAdmin = role === 'admin'
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filtered.length} transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => exportToCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-surface-border text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <Download size={15} /> Export CSV
          </button>
          {isAdmin && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-lg shadow-brand-500/30">
              <Plus size={15} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filter.search}
            onChange={e => dispatch(setFilter({ search: e.target.value }))}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-surface-border bg-white dark:bg-surface-card text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
        {[
          { key: 'type', options: ['all','income','expense'], labels: { all:'All Types', income:'Income', expense:'Expense' } },
          { key: 'category', options: ['all', ...CATEGORIES], labels: { all:'All Categories' } },
          { key: 'sort', options: ['date','amount'], labels: { date:'Sort by Date', amount:'Sort by Amount' } },
          { key: 'order', options: ['desc','asc'], labels: { desc:'Descending', asc:'Ascending' } },
        ].map(({ key, options, labels }) => (
          <select key={key} value={filter[key]} onChange={e => dispatch(setFilter({ [key]: e.target.value }))}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-surface-border bg-white dark:bg-surface-card text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer">
            {options.map(o => <option key={o} value={o}>{labels[o] || o}</option>)}
          </select>
        ))}
        <button onClick={() => dispatch(resetFilter())}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-surface-border text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No transactions match your filters.</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-surface-border">
            {filtered.map(t => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                     style={{ backgroundColor: CATEGORY_COLORS[t.category] + '22', color: CATEGORY_COLORS[t.category] }}>
                  {t.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge label={t.type} variant={t.type} />
                  <Badge label={t.category} />
                </div>
                <span className={`text-sm font-semibold w-24 text-right shrink-0 ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
                {isAdmin && (
                  <button onClick={() => dispatch(deleteTransaction(t.id))}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}