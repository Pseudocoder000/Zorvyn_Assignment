import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTransaction } from '../../features/transactions/transactionsSlice'
import { CATEGORIES, CATEGORY_COLORS } from '../../data/mockTransactions'
import { X, ChevronDown, Check } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Custom Category Dropdown ─────────────────────────────────
function CategoryDropdown({ value, onChange, isLight }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
          isLight
            ? 'bg-white border-teal-200 text-slate-700 hover:border-teal-400 shadow-sm'
            : 'bg-white/[0.04] border-white/[0.08] text-gray-200 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: CATEGORY_COLORS[value] }}
          />
          {value}
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} ${
            isLight ? 'text-teal-500' : 'text-gray-500'
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute bottom-full mb-2 left-0 right-0 z-50 rounded-2xl border overflow-hidden ${
            isLight
              ? 'bg-white border-teal-200 shadow-xl shadow-teal-100/60'
              : 'border-white/[0.08] shadow-2xl shadow-black/60'
          }`}
          style={isLight ? {} : { background: '#0d0d1a' }}
        >
          <div className="p-1.5 max-h-52 overflow-y-auto scrollbar-thin">
            {CATEGORIES.map(cat => {
              const isSelected = cat === value
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { onChange(cat); setOpen(false) }}
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
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: CATEGORY_COLORS[cat] }}
                    />
                    {cat}
                  </div>
                  {isSelected && (
                    <Check size={13} className={isLight ? 'text-white' : 'text-teal-400'} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Modal ────────────────────────────────────────────────────
export default function AddTransactionModal({ onClose }) {
  const dispatch = useDispatch()
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'

  const [form, setForm] = useState({
    name: '',
    amount: '',
    type: 'expense',
    category: 'Shopping',
    date: new Date().toISOString().split('T')[0]
  })
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Name is required')
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setError('Enter a valid amount')
    dispatch(addTransaction({ ...form, amount: +form.amount }))
    toast.success(`"${form.name}" added successfully!`)
    onClose()
  }

  const inputClass = isLight
    ? 'w-full px-3 py-2.5 rounded-xl border border-teal-200 bg-white text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 shadow-sm transition-all'
    : 'w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all'

  const labelClass = `text-xs font-semibold mb-1.5 block ${isLight ? 'text-slate-500' : 'text-white/40'}`

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: -30,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className={`w-full max-w-md rounded-2xl border p-6 space-y-5 ${
          isLight
            ? 'bg-white border-teal-200 shadow-2xl shadow-teal-100/40'
            : 'border-white/[0.08]'
        }`}
        style={isLight ? {} : {
          background: 'rgba(13,13,26,0.97)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(20,184,166,0.15)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold gt">Add Transaction</h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all ${
              isLight
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                : 'text-gray-600 hover:text-gray-300 hover:bg-white/[0.06]'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Netflix"
              className={inputClass}
            />
          </div>

          {/* Amount */}
          <div>
            <label className={labelClass}>Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="e.g. 499"
              className={inputClass}
            />
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              style={{ colorScheme: isLight ? 'light' : 'dark' }}
              className={inputClass}
            />
          </div>

          {/* Type */}
          <div>
            <label className={labelClass}>Type</label>
            <div className="flex gap-2">
              {['income', 'expense'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-teal-500/15 text-teal-500 border-teal-500/40'
                        : 'bg-red-500/15 text-red-400 border-red-500/40'
                      : isLight
                        ? 'border-teal-200 text-slate-500 hover:border-teal-300'
                        : 'border-white/[0.08] text-gray-500 hover:text-gray-300 hover:border-white/20'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <CategoryDropdown
              value={form.category}
              onChange={cat => setForm(f => ({ ...f, category: cat }))}
              isLight={isLight}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              isLight
                ? 'border-teal-200 text-slate-500 hover:text-slate-700 hover:border-teal-400 bg-white'
                : 'border-white/[0.08] bg-white/[0.04] text-gray-400 hover:text-gray-200 hover:border-white/20'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl gb text-sm"
          >
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  )
}