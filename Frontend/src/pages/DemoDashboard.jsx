import { useMemo } from 'react'
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import BalanceTrendChart from '../components/charts/BalanceTrendChart'
import SpendingPieChart from '../components/charts/SpendingPieChart'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import BudgetTracker from '../components/dashboard/BudgetTracker'
import { formatCurrency } from '../utils/formatters'
import DemoLayout, { DEMO_TRANSACTIONS } from '../components/layout/DemoLayout'

export default function DemoDashboard() {

  // Calculate stats from demo data
  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = DEMO_TRANSACTIONS.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const lastMonth = DEMO_TRANSACTIONS.filter(t => {
      const d = new Date(t.date)
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear()
    })
    const income = thisMonth.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const expense = thisMonth.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const lIncome = lastMonth.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
    const lExpense = lastMonth.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    const balance = DEMO_TRANSACTIONS.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
                  - DEMO_TRANSACTIONS.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
    return {
      income, expense, balance, count: thisMonth.length,
      incomeChange: lIncome ? Math.round(((income - lIncome) / lIncome) * 100) : 0,
      expenseChange: lExpense ? Math.round(((expense - lExpense) / lExpense) * 100) : 0,
    }
  }, [])

  return (
    <DemoLayout>
      {/* Header */}
      <div className="space-y-1 mb-8">
        <h1 className="text-3xl font-extrabold gt">Dashboard</h1>
        <p className="text-sm text-white/40 mt-0.5">Your financial overview with sample data</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Balance" 
          value={formatCurrency(stats.balance)} 
          icon={Wallet} 
          accent="teal" 
        />
        <StatCard 
          title="Income This Month" 
          value={formatCurrency(stats.income)} 
          icon={TrendingUp} 
          accent="green" 
          change={stats.incomeChange}
          changeLabel="vs last month" 
        />
        <StatCard 
          title="Expenses This Month" 
          value={formatCurrency(stats.expense)} 
          icon={TrendingDown} 
          accent="coral" 
          change={stats.expenseChange}
          changeLabel="vs last month" 
        />
        <StatCard 
          title="Transactions" 
          value={stats.count} 
          icon={Activity} 
          accent="amber"
          changeLabel="This month" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3 gc p-5">
          <h2 className="text-sm font-semibold text-white mb-0.5">Balance Trend</h2>
          <p className="text-xs text-white/30 mb-4">Last 6 months</p>
          <BalanceTrendChart transactions={DEMO_TRANSACTIONS} />
        </div>
        <div className="lg:col-span-2 gc p-5">
          <h2 className="text-sm font-semibold text-white mb-0.5">Spending Breakdown</h2>
          <p className="text-xs text-white/30 mb-4">By category</p>
          <SpendingPieChart transactions={DEMO_TRANSACTIONS} />
        </div>
      </div>

      {/* Budget + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 gc p-5">
          <h2 className="text-sm font-semibold text-white mb-0.5">Recent Transactions</h2>
          <p className="text-xs text-white/30 mb-4">Latest activity</p>
          <RecentTransactions transactions={DEMO_TRANSACTIONS.slice(0, 8)} />
        </div>
        <div className="lg:col-span-2 gc p-5">
          <h2 className="text-sm font-semibold text-white mb-0.5">Budget Tracker</h2>
          <p className="text-xs text-white/30 mb-4">This month's spending</p>
          <BudgetTracker transactions={DEMO_TRANSACTIONS} />
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to Take Control of Your Finances?</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            This is just a taste of what Gullak can do with your real financial data. Sign up today and start your journey to financial freedom!
          </p>
        </div>
      </div>
    </DemoLayout>
  )
}
