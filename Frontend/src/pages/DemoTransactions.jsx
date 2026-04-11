import { useMemo, useState } from 'react'
import { ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react'
import DemoLayout, { DEMO_TRANSACTIONS } from '../components/layout/DemoLayout'
import { formatCurrency } from '../utils/formatters'

export default function DemoTransactions() {
  const [filter, setFilter] = useState('all')

  const { filteredTransactions, stats } = useMemo(() => {
    let filtered = DEMO_TRANSACTIONS
    
    if (filter === 'income') {
      filtered = DEMO_TRANSACTIONS.filter(t => t.type === 'income')
    } else if (filter === 'expense') {
      filtered = DEMO_TRANSACTIONS.filter(t => t.type === 'expense')
    }

    // Sort by date descending
    filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))

    const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0)
    const avgAmount = filtered.length > 0 ? totalAmount / filtered.length : 0

    return {
      filteredTransactions: filtered,
      stats: {
        count: filtered.length,
        total: totalAmount,
        average: avgAmount
      }
    }
  }, [filter])

  const getCategoryColor = (category) => {
    const colors = {
      salary: 'from-green-500/20 to-green-500/5',
      freelance: 'from-blue-500/20 to-blue-500/5',
      bonus: 'from-amber-500/20 to-amber-500/5',
      dividend: 'from-purple-500/20 to-purple-500/5',
      rent: 'from-red-500/20 to-red-500/5',
      housing: 'from-red-500/20 to-red-500/5',
      shopping: 'from-pink-500/20 to-pink-500/5',
      food: 'from-orange-500/20 to-orange-500/5',
      bills: 'from-cyan-500/20 to-cyan-500/5',
      entertainment: 'from-indigo-500/20 to-indigo-500/5',
      health: 'from-teal-500/20 to-teal-500/5',
      transport: 'from-lime-500/20 to-lime-500/5',
    }
    return colors[category.toLowerCase()] || 'from-white/20 to-white/5'
  }

  return (
    <DemoLayout>
      {/* Header */}
      <div className="space-y-1 mb-8">
        <h1 className="text-3xl font-extrabold gt">Transactions</h1>
        <p className="text-sm text-white/40 mt-0.5">All your transactions in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="gc p-6 rounded-xl">
          <p className="text-xs text-white/50 mb-2">Total Transactions</p>
          <h3 className="text-2xl font-bold">{stats.count}</h3>
        </div>
        <div className="gc p-6 rounded-xl">
          <p className="text-xs text-white/50 mb-2">Total Amount</p>
          <h3 className="text-2xl font-bold text-primary">{formatCurrency(stats.total)}</h3>
        </div>
        <div className="gc p-6 rounded-xl">
          <p className="text-xs text-white/50 mb-2">Average Transaction</p>
          <h3 className="text-2xl font-bold">{formatCurrency(stats.average)}</h3>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <Filter size={16} className="inline mr-2" />
          All
        </button>
        <button
          onClick={() => setFilter('income')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            filter === 'income'
              ? 'bg-green-500 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <ArrowDownLeft size={16} className="inline mr-2" />
          Income
        </button>
        <button
          onClick={() => setFilter('expense')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            filter === 'expense'
              ? 'bg-red-500 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <ArrowUpRight size={16} className="inline mr-2" />
          Expense
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction, idx) => (
            <div
              key={idx}
              className={`gc p-4 rounded-xl backdrop-blur-md border border-white/[0.05] hover:border-primary/30 transition flex items-center justify-between group bg-gradient-to-r ${getCategoryColor(transaction.category)}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  transaction.type === 'income'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowDownLeft size={20} />
                  ) : (
                    <ArrowUpRight size={20} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{transaction.category}</h3>
                  <p className="text-xs text-white/50">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-white'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="gc p-12 rounded-xl text-center">
            <p className="text-white/50">No transactions found</p>
          </div>
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="mt-12" />
    </DemoLayout>
  )
}
