import { useSelector } from 'react-redux'
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import BalanceTrendChart from '../components/charts/BalanceTrendChart'
import SpendingPieChart from '../components/charts/SpendingPieChart'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import { formatCurrency } from '../utils/formatters'
import { useMemo } from 'react'

export default function Dashboard() {
  const transactions = useSelector(s => s.transactions.items)

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

    const income = thisMonth.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const expense = thisMonth.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const lastIncome = lastMonth.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const lastExpense = lastMonth.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const balance = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
                  - transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)

    const incomeChange = lastIncome ? Math.round(((income - lastIncome) / lastIncome) * 100) : 0
    const expenseChange = lastExpense ? Math.round(((expense - lastExpense) / lastExpense) * 100) : 0

    return { income, expense, balance, count: thisMonth.length, incomeChange, expenseChange }
  }, [transactions])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your financial overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance"      value={formatCurrency(stats.balance)} icon={Wallet}       color="brand"  />
        <StatCard title="Income This Month"  value={formatCurrency(stats.income)}  icon={TrendingUp}   color="green"  change={stats.incomeChange}  changeLabel="vs last month" />
        <StatCard title="Expenses This Month" value={formatCurrency(stats.expense)} icon={TrendingDown} color="red"   change={stats.expenseChange} changeLabel="vs last month" />
        <StatCard title="Transactions"       value={stats.count}                   icon={Activity}     color="purple" changeLabel="This month" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Balance Trend</h2>
          <p className="text-xs text-gray-400 mb-4">Last 6 months</p>
          <BalanceTrendChart transactions={transactions} />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Spending Breakdown</h2>
          <p className="text-xs text-gray-400 mb-4">By category</p>
          <SpendingPieChart transactions={transactions} />
        </div>
      </div>

      {/* Recent */}
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
        <RecentTransactions transactions={transactions.slice(0, 6)} />
      </div>
    </div>
  )
}