import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTransaction } from '../../features/transactions/transactionsSlice'
import { CATEGORIES } from '../../data/mockTransactions'
import { X } from 'lucide-react'

export default function AddTransactionModal({ onClose }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: '', amount: '', type: 'expense', category: 'Shopping', date: new Date().toISOString().split('T')[0] })
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!form.name.trim()) return setError('Name is required')
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setError('Enter a valid amount')
    dispatch(addTransaction({ ...form, amount: +form.amount }))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border shadow-2xl p-6 space-y-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Transaction</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><X size={16} /></button>
        </div>

        {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-xl px-3 py-2">{error}</p>}

        <div className="space-y-4">
          {[
            { label: 'Name', key: 'name', type: 'text', placeholder: 'e.g. Netflix' },
            { label: 'Amount', key: 'amount', type: 'number', placeholder: 'e.g. 499' },
            { label: 'Date', key: 'date', type: 'date' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-surface-border bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/40" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Type</label>
            <div className="flex gap-2">
              {['income','expense'].map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${form.type === t ? t === 'income' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30' : 'border-gray-200 dark:border-surface-border text-gray-500 dark:text-gray-400'}`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-surface-border bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500/40">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-surface-border text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors shadow-lg shadow-brand-500/25">Add Transaction</button>
        </div>
      </div>
    </div>
  )
}