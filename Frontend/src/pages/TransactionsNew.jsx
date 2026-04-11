import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions, deleteTransaction, setFilter, resetFilter, selectFiltered } from '../features/transactions/transactionsSlice'
import { CATEGORIES, CATEGORY_COLORS } from '../data/mockTransactions'
import { formatCurrency, formatDate } from '../utils/formatters'
import Badge from '../components/ui/Badge'
import { Search, Trash2, Plus, Download, RotateCcw, ChevronDown, Check, Edit2, Loader2 } from 'lucide-react'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import toast from 'react-hot-toast'

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

// ── Transaction Item Row ─────────────────────────────────────
function TransactionRow({ transaction, isLight, onEdit, onDelete, isDeleting }) {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 transition-colors group ${
        isLight ? 'hover:bg-teal-50/60' : 'hover:bg-white/[0.03]'
      }`}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
        style={{
          backgroundColor: CATEGORY_COLORS[transaction.category] + '28',
          color: CATEGORY_COLORS[transaction.category]
        }}
      >
        {transaction.name[0]}
      </div>

      {/* Name + Date */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>
          {transaction.name}
        </p>
        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-400' : 'text-gray-600'}`}>
          {formatDate(transaction.date)}
        </p>
      </div>

      {/* Badges */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <Badge label={transaction.type} variant={transaction.type} />
        <Badge label={transaction.category} />
      </div>

      {/* Amount */}
      <span className={`text-sm font-bold w-24 text-right shrink-0 ${
        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
      }`}>
        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
          title="Edit transaction"
        >
          <Edit2 size={15} />
        </button>
        <button
          onClick={() => onDelete(transaction._id)}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
          title="Delete transaction"
        >
          {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        </button>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function TransactionsNew() {
  const dispatch = useDispatch()
  const { items: transactions, loading, error, filter } = useSelector(s => s.transactions)
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'
  const [showModal, setShowModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Fetch transactions on mount
  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 100, filters: filter }))
  }, [dispatch, filter])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleAddClick = () => {
    setEditingTransaction(null)
    setShowModal(true)
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return
    
    setDeletingId(id)
    try {
      await dispatch(deleteTransaction(id)).unwrap()
      toast.success('Transaction deleted')
    } catch (err) {
      toast.error('Failed to delete transaction')
    } finally {
      setDeletingId(null)
    }
  }

  const dropdowns = [
    {
      key: 'type',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'income', label: 'Income' },
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
        { value: 'date', label: 'Sort by Date' },
        { value: 'amount', label: 'Sort by Amount' },
      ]
    },
    {
      key: 'order',
      options: [
        { value: 'desc', label: 'Descending' },
        { value: 'asc', label: 'Ascending' },
      ]
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold gt">Transactions</h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
            {loading ? 'Loading...' : `${transactions.length} transactions`}
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gb text-sm font-medium"
        >
          <Plus size={16} /> Add Transaction
        </button>
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
            value={filter.search || ''}
            onChange={e => dispatch(setFilter({ search: e.target.value }))}
            placeholder="Search transactions..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
              isLight
                ? 'border-teal-200 bg-white text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 shadow-sm'
                : 'border-white/[0.08] bg-white/[0.04] text-gray-200 placeholder-gray-600 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30'
            }`}
          />
        </div>

        {/* Dropdowns */}
        {dropdowns.map(({ key, options }) => (
          <Dropdown
            key={key}
            value={filter[key] || 'all'}
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

      {/* Transactions List */}
      <div className="gc overflow-hidden">
        {loading ? (
          <div className={`divide-y ${isLight ? 'divide-teal-100' : 'divide-white/[0.04]'}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center">
            <p className={`text-sm ${isLight ? 'text-slate-400' : 'text-gray-600'}`}>
              No transactions yet. Create your first one!
            </p>
            <button
              onClick={handleAddClick}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              Add Transaction
            </button>
          </div>
        ) : (
          <div className={`divide-y ${isLight ? 'divide-teal-100' : 'divide-white/[0.04]'}`}>
            {transactions.map(t => (
              <TransactionRow
                key={t._id}
                transaction={t}
                isLight={isLight}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === t._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddTransactionModal
          onClose={() => {
            setShowModal(false)
            setEditingTransaction(null)
          }}
          editingTransaction={editingTransaction}
        />
      )}
    </div>
  )
}
