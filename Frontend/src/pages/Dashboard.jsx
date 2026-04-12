import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { Wallet, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import StatCard from '../components/ui/StatCard'
import BalanceTrendChart from '../components/charts/BalanceTrendChart'
import SpendingPieChart from '../components/charts/SpendingPieChart'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import BudgetTracker from '../components/dashboard/BudgetTracker'
import { formatCurrency } from '../utils/formatters'
import { SkeletonStatCard, SkeletonChart } from '../components/ui/SkeletonCard'
import {
  fetchTransactions,
  fetchDashboardSummary,
  fetchSpendingByCategory,
  fetchMonthlyTrend,
} from '../features/transactions/transactionsSlice'

export default function Dashboard() {
  const dispatch = useDispatch()
  const transactions = useSelector(s => s.transactions.items)
  const dashboard = useSelector(s => s.transactions.dashboard)
  const { loading, error } = useSelector(s => s.transactions)
  const user = useSelector(s => s.auth.user)

  // 🔄 Fetch real data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch all dashboard data in parallel
        await Promise.all([
          dispatch(fetchTransactions({ page: 1, limit: 20 })),
          dispatch(fetchDashboardSummary()),
          dispatch(fetchSpendingByCategory()),
          dispatch(fetchMonthlyTrend(6)),
        ])
      } catch (err) {
        toast.error('Failed to load dashboard data')
      }
    }

    loadDashboardData()
  }, [dispatch])

  // 📊 Calculate stats from transactions with CORRECT balance formula
  const stats = useMemo(() => {
    console.log('📊 Calculating stats...', { 
      transactionCount: transactions.length, 
      initialBalance: user?.initialBalance,
      user: user?.name 
    })

    // Calculate from transactions (most reliable source)
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
    
    const income = thisMonth.filter(t => t.type === 'income').reduce((a, t) => a + (t.amount || 0), 0)
    const expense = thisMonth.filter(t => t.type === 'expense').reduce((a, t) => a + (t.amount || 0), 0)
    const lIncome = lastMonth.filter(t => t.type === 'income').reduce((a, t) => a + (t.amount || 0), 0)
    const lExpense = lastMonth.filter(t => t.type === 'expense').reduce((a, t) => a + (t.amount || 0), 0)
    
    // ✅ FIXED: Include initialBalance in balance calculation
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, t) => a + (t.amount || 0), 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + (t.amount || 0), 0)
    const initialBalance = user?.initialBalance || 0
    const balance = initialBalance + totalIncome - totalExpense
    
    console.log('💰 Balance Calculation:', { totalIncome, totalExpense, initialBalance, balance })
    
    return {
      income, expense, balance, count: thisMonth.length,
      incomeChange: lIncome ? Math.round(((income - lIncome) / lIncome) * 100) : 0,
      expenseChange: lExpense ? Math.round(((expense - lExpense) / lExpense) * 100) : 0,
    }
  }, [transactions, user?.initialBalance])

  // 📱 Loading state
  if (loading && transactions.length === 0 && !dashboard.summary) {
    return (
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
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold gt">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Your financial overview at a glance</p>
      </div>

      {/* 🚨 Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-300">{error}</p>
            <p className="text-xs text-red-200/70 mt-0.5">Please refresh the page to try again</p>
          </div>
        </div>
      )}

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
          <BalanceTrendChart transactions={transactions} initialBalance={user?.initialBalance || 0} />
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