import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTransaction, updateTransaction } from '../features/transactions/transactionsSlice'
import { CATEGORIES, CATEGORY_COLORS } from '../data/mockTransactions'
import { X, ChevronDown, Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Type Selector ────────────────────────────────────────────
function TypeSelector({ value, onChange }) {
  const types = [
    { id: 'income', label: 'Income', color: 'green' },
    { id: 'expense', label: 'Expense', color: 'red' },
  ]

  return (
    <div className="flex gap-3">
      {types.map(type => (
        <button
          key={type.id}
          onClick={() => onChange(type.id)}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all text-sm ${
            value === type.id
              ? type.color === 'green'
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
              : 'bg-white/[0.05] text-gray-400 border border-white/[0.08] hover:border-white/20'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}

// ── Category Dropdown ────────────────────────────────────────
function CategoryDropdown({ value, onChange }) {
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
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-200 hover:border-white/20 transition-all text-sm font-medium"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ background: CATEGORY_COLORS[value] }}
          />
          {value}
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} text-gray-500`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 left-0 right-0 z-50 rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden"
          style={{ background: '#0e0e1f' }}
        >
          <div className="p-1.5 max-h-64 overflow-y-auto">
            {CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  onChange(category)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                  value === category
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                }`}
                style={
                  value === category
                    ? {
                        background: 'linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(245,158,11,0.1) 100%)',
                        border: '1px solid rgba(20,184,166,0.25)',
                      }
                    : {}
                }
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: CATEGORY_COLORS[category] }}
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {value === category && <Check size={13} className="ml-auto text-teal-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Modal ───────────────────────────────────────────────
export default function AddTransactionModal({ onClose, editingTransaction }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.transactions)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'food',
    amount: '',
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})

  // Populate form when editing
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        category: editingTransaction.category,
        amount: editingTransaction.amount.toString(),
        name: editingTransaction.name,
        description: editingTransaction.description || '',
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
      })
    }
  }, [editingTransaction])

  // Validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Transaction name is required'
    if (!formData.amount || isNaN(parseFloat(formData.amount))) newErrors.amount = 'Valid amount is required'
    if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.type) newErrors.type = 'Type is required'
    if (!formData.date) newErrors.date = 'Date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      }

      if (editingTransaction) {
        await dispatch(updateTransaction({ id: editingTransaction._id, data: payload })).unwrap()
        toast.success('Transaction updated!')
      } else {
        await dispatch(createTransaction(payload)).unwrap()
        toast.success('Transaction added!')
      }

      onClose()
    } catch (error) {
      toast.error(error || 'Failed to save transaction')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0e0e1f] border border-white/[0.08] rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
          <h2 className="text-xl font-bold">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Type</label>
            <TypeSelector
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <CategoryDropdown
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e })}
            />
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Transaction name..."
              className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold mb-2">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
            />
            {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
            />
            {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-sm font-semibold mb-2">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes..."
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white placeholder-gray-600 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] text-white font-medium hover:bg-white/[0.05] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gb font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {editingTransaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
