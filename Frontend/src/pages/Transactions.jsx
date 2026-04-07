import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import { deleteTransaction, setFilter, resetFilter, selectFiltered } from '../features/transactions/transactionsSlice'
import { CATEGORIES, CATEGORY_COLORS } from '../data/mockTransactions'
import { formatCurrency, formatDate, exportToCSV } from '../utils/formatters'
import Badge from '../components/ui/Badge'
import { Search, Trash2, Plus, Download, RotateCcw, ChevronDown, Check } from 'lucide-react'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import toast from 'react-hot-toast'
import { SkeletonTransactionRow } from '../components/ui/SkeletonCard'

// ── Custom Dropdown ──────────────────────────────────────────
function Dropdown({ value, options, onChange, isLight }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = options.find(o => o.value === value)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all whitespace-nowrap ${
          isLight
            ? 'border-teal-200 bg-white text-slate-700 hover:border-teal-400 shadow-sm'
            : 'border-white/[0.08] bg-white/[0.04] text-gray-300 hover:border-white/20'
        }`}
      >
        {current?.label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isLight ? 'text-teal-500' : 'text-gray-500'}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 left-0 z-50 rounded-2xl border overflow-hidden min-w-[160px] ${
            isLight
              ? 'bg-white border-teal-200 shadow-xl shadow-teal-100/60'
              : 'border-white/[0.08] shadow-2xl shadow-black/40'
          }`}
          style={isLight ? {} : { background: '#0e0e1f' }}
        >
          <div className="p-1.5">
            {options.map(opt => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                    isLight
                      ? isSelected
                        ? 'bg-teal-500 text-white'
                        : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                      : isSelected
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                  style={!isLight && isSelected ? {
                    background: 'linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(245,158,11,0.1) 100%)',
                    border: '1px solid rgba(20,184,166,0.25)',
                  } : {}}
                >
                  {opt.label}
                  {isSelected && <Check size={13} className={isLight ? 'text-white' : 'text-teal-400'} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function Transactions() {
  const dispatch = useDispatch()
  const filtered = useSelector(selectFiltered)
  const filter = useSelector(s => s.transactions.filter)
  const role = useSelector(s => s.auth.role)
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'
  const isAdmin = role === 'admin'
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const dropdowns = [
    {
      key: 'type',
      options: [
        { value: 'all',     label: 'All Types' },
        { value: 'income',  label: 'Income' },
        { value: 'expense', label: 'Expense' },
      ]
    },
    {
      key: 'category',
      options: [
        { value: 'all', label: 'All Categories' },
        ...CATEGORIES.map(c => ({ value: c, label: c }))
      ]
    },
    {
      key: 'sort',
      options: [
        { value: 'date',   label: 'Sort by Date' },
        { value: 'amount', label: 'Sort by Amount' },
      ]
    },
    {
      key: 'order',
      options: [
        { value: 'desc', label: 'Descending' },
        { value: 'asc',  label: 'Ascending' },
      ]
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold gt">Transactions</h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
            {filtered.length} transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filtered)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              isLight
                ? 'border-teal-200 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-700 shadow-sm'
                : 'border-white/[0.08] bg-white/[0.04] text-gray-300 hover:border-white/20 hover:text-white'
            }`}
          >
            <Download size={15} /> Export CSV
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gb text-sm"
            >
              <Plus size={15} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-teal-500' : 'text-gray-600'}`}
          />
          <input
            value={filter.search}
            onChange={e => dispatch(setFilter({ search: e.target.value }))}
            placeholder="Search transactions..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              isLight
                ? 'border-teal-200 bg-white text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 shadow-sm'
                : 'border-white/[0.08] bg-white/[0.04] text-gray-200 placeholder-gray-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30'
            }`}
          />
        </div>

        {/* Custom Dropdowns */}
        {dropdowns.map(({ key, options }) => (
          <Dropdown
            key={key}
            value={filter[key]}
            options={options}
            onChange={val => dispatch(setFilter({ [key]: val }))}
            isLight={isLight}
          />
        ))}

        {/* Reset */}
        <button
          onClick={() => dispatch(resetFilter())}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
            isLight
              ? 'border-teal-200 bg-white text-slate-500 hover:text-teal-700 hover:border-teal-400 shadow-sm'
              : 'border-white/[0.08] bg-white/[0.04] text-gray-500 hover:text-gray-300 hover:border-white/20'
          }`}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Transaction List */}
      <div className="gc overflow-hidden">
        {loading ? (
          <div className={`divide-y ${isLight ? 'divide-teal-100' : 'divide-white/[0.04]'}`}>
            {Array.from({ length: 7 }).map((_, i) => <SkeletonTransactionRow key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className={`text-sm ${isLight ? 'text-slate-400' : 'text-gray-600'}`}>
              No transactions match your filters.
            </p>
          </div>
        ) : (
          <div className={`divide-y ${isLight ? 'divide-teal-100' : 'divide-white/[0.04]'}`}>
            {filtered.map(t => (
              <div
                key={t.id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors group ${
                  isLight ? 'hover:bg-teal-50/60' : 'hover:bg-white/[0.03]'
                }`}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    backgroundColor: CATEGORY_COLORS[t.category] + '28',
                    color: CATEGORY_COLORS[t.category]
                  }}
                >
                  {t.name[0]}
                </div>

                {/* Name + Date */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
                    {t.name}
                  </p>
                  <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-400' : 'text-gray-600'}`}>
                    {formatDate(t.date)}
                  </p>
                </div>

                {/* Badges */}
                <div className="hidden sm:flex items-center gap-2 shrink-0">
                  <Badge label={t.type} variant={t.type} />
                  <Badge label={t.category} />
                </div>

                {/* Amount */}
                <span className={`text-sm font-bold w-24 text-right shrink-0 ${
                  t.type === 'income' ? 'text-teal-500' : 'text-red-400'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>

                {/* Delete */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      dispatch(deleteTransaction(t.id))
                      toast.error(`"${t.name}" removed`, { icon: '🗑️' })
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
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