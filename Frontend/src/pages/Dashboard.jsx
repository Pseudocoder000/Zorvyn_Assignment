import { useSelector, useDispatch } from 'react-redux'
import { useMemo, useState, useEffect } from 'react'
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import BalanceTrendChart from '../components/charts/BalanceTrendChart'
import SpendingPieChart from '../components/charts/SpendingPieChart'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import BudgetTracker from '../components/dashboard/BudgetTracker'
import { formatCurrency } from '../utils/formatters'
import { SkeletonStatCard, SkeletonChart } from '../components/ui/SkeletonCard'

// 🔔 ADD THIS IMPORT
export default function Dashboard() {
  const transactions = useSelector(s => s.transactions.items)
  const dispatch = useDispatch() // 
  const [loading, setLoading] = useState(true)

  useEffect(() => {
   const timer = setTimeout(() => setLoading(false), 1200)
return () => clearTimeout(timer)
  }, [])

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const lastMonth = transactions.filter(t => {
      const d = new Date(t.date)
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear()
    })
    const income  = thisMonth.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const expense = thisMonth.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const lIncome  = lastMonth.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const lExpense = lastMonth.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const balance = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
                  - transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    return {
      income, expense, balance, count: thisMonth.length,
      incomeChange:  lIncome  ? Math.round(((income  - lIncome)  / lIncome)  * 100) : 0,
      expenseChange: lExpense ? Math.round(((expense - lExpense) / lExpense) * 100) : 0,
    }
  }, [transactions])

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="w-36 h-7 animate-pulse bg-white/[0.04] rounded-xl" />
        <div className="w-52 h-4 animate-pulse bg-white/[0.03] rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 gc p-5"><SkeletonChart /></div>
        <div className="lg:col-span-2 gc p-5"><SkeletonChart /></div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold gt">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Your financial overview at a glance</p>
      </div>

     

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance"       value={formatCurrency(stats.balance)} icon={Wallet}       accent="teal"  />
        <StatCard title="Income This Month"   value={formatCurrency(stats.income)}  icon={TrendingUp}   accent="green" change={stats.incomeChange}  changeLabel="vs last month" />
        <StatCard title="Expenses This Month" value={formatCurrency(stats.expense)} icon={TrendingDown} accent="coral" change={stats.expenseChange} changeLabel="vs last month" />
        <StatCard title="Transactions"        value={stats.count}                   icon={Activity}     accent="amber" changeLabel="This month" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 gc p-5">
          <h2 className="text-sm font-semibold text-white mb-0.5">Balance Trend</h2>
          <p className="text-xs text-white/30 mb-4">Last 6 months</p>
          <BalanceTrendChart transactions={transactions} />
        </div>
        <div className="lg:col-span-2 gc p-5">
          <h2 className="text-sm font-semibold text-white mb-0.5">Spending Breakdown</h2>
          <p className="text-xs text-white/30 mb-4">By category</p>
          <SpendingPieChart transactions={transactions} />
        </div>
      </div>

      {/* Budget + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 gc p-5">
          <h2 className="text-sm font-semibold text-white mb-0.5">Recent Transactions</h2>
          <p className="text-xs text-white/30 mb-4">Latest activity</p>
          <RecentTransactions transactions={transactions.slice(0, 8)} />
        </div>
        <div className="lg:col-span-2 gc p-5">
          <h2 className="text-sm font-semibold text-white mb-0.5">Budget Tracker</h2>
          <p className="text-xs text-white/30 mb-4">This month's spending</p>
          <BudgetTracker transactions={transactions} />
        </div>
      </div>
    </div>
  )
}