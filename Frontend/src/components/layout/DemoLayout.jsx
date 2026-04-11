import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Lightbulb, ShieldCheck, Eye, LogOut } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import gullak from "../../stickers/gullak.png"

const links = [
  { to: '/demo', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/demo/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/demo/insights', label: 'Insights', icon: Lightbulb },
]

// 🎬 Enhanced mock data with heavier amounts
export const DEMO_TRANSACTIONS = [
  { _id: '1', name: 'Monthly Salary', type: 'income', amount: 150000, category: 'Salary', date: new Date(), description: 'Monthly salary deposit' },
  { _id: '2', name: 'Rent Payment', type: 'expense', amount: 45000, category: 'Housing', date: new Date(Date.now() - 1*24*60*60*1000), description: 'Apartment rent' },
  { _id: '3', name: 'Amazon Purchase', type: 'expense', amount: 12500, category: 'Shopping', date: new Date(Date.now() - 2*24*60*60*1000), description: 'Electronics & groceries' },
  { _id: '4', name: 'Freelance Income', type: 'income', amount: 75000, category: 'Freelance', date: new Date(Date.now() - 3*24*60*60*1000), description: 'Web design project' },
  { _id: '5', name: 'Electricity Bill', type: 'expense', amount: 3500, category: 'Bills', date: new Date(Date.now() - 4*24*60*60*1000), description: 'Monthly electricity' },
  { _id: '6', name: 'Restaurant Dinner', type: 'expense', amount: 8500, category: 'Food', date: new Date(Date.now() - 5*24*60*60*1000), description: 'Fancy dinner' },
  { _id: '7', name: 'Stock Dividend', type: 'income', amount: 25000, category: 'Investments', date: new Date(Date.now() - 6*24*60*60*1000), description: 'Dividend payout' },
  { _id: '8', name: 'Movie & Entertainment', type: 'expense', amount: 2500, category: 'Entertainment', date: new Date(Date.now() - 7*24*60*60*1000), description: 'Cinema & streaming' },
  { _id: '9', name: 'Grocery Shopping', type: 'expense', amount: 6500, category: 'Food', date: new Date(Date.now() - 8*24*60*60*1000), description: 'Weekly groceries & supplies' },
  { _id: '10', name: 'Internet Bill', type: 'expense', amount: 1500, category: 'Bills', date: new Date(Date.now() - 9*24*60*60*1000), description: 'Monthly internet' },
  { _id: '11', name: 'Gym Membership', type: 'expense', amount: 3000, category: 'Health', date: new Date(Date.now() - 10*24*60*60*1000), description: 'Monthly gym fees' },
  { _id: '12', name: 'Bonus Payment', type: 'income', amount: 50000, category: 'Bonus', date: new Date(Date.now() - 11*24*60*60*1000), description: 'Performance bonus' },
  { _id: '13', name: 'Car Fuel', type: 'expense', amount: 2800, category: 'Transport', date: new Date(Date.now() - 12*24*60*60*1000), description: 'Petrol' },
  { _id: '14', name: 'Clothing Store', type: 'expense', amount: 5500, category: 'Shopping', date: new Date(Date.now() - 13*24*60*60*1000), description: 'New clothes' },
  { _id: '15', name: 'Medical Checkup', type: 'expense', amount: 4500, category: 'Health', date: new Date(Date.now() - 14*24*60*60*1000), description: 'Annual health checkup' },
]

export default function DemoLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showMobileNav, setShowMobileNav] = useState(false)

  // Calculate demo stats
  const totalIncome = DEMO_TRANSACTIONS.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = DEMO_TRANSACTIONS.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const balance = totalIncome - totalExpense
  const health = Math.min(100, Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)))
  const healthColor = health > 60 ? '#14b8a6' : health > 30 ? '#f59e0b' : '#f87171'

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 py-6 px-4 gap-5 transition-colors duration-300 border-r border-white/[0.05]"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-16 h-9 rounded-2xl flex items-center justify-center shrink-0">
            <img src={gullak} alt="logo" />
          </div>
          <span className="text-2xl font-extrabold gt">Gullak</span>
        </div>

        {/* Demo Badge */}
        <div className="px-3 py-1.5 bg-primary/20 text-primary text-xs font-semibold rounded-lg text-center">
          DEMO MODE
        </div>

        {/* User Info Card */}
        <div
          className="p-4 flex flex-col gap-3 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-teal-400/20 to-blue-400/20 border border-white/[0.06]">
              <span className="text-xs font-bold text-teal-300">DM</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate text-white">Demo User</p>
              <p className="text-xs truncate text-white/40">demo@gullak.app</p>
            </div>
          </div>

          {/* Financial Health */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/40">Financial Health</span>
              <span className="text-xs font-bold" style={{ color: healthColor }}>
                {health}/100
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${health}%`,
                  background: `linear-gradient(90deg, ${healthColor}, ${healthColor}bb)`,
                  boxShadow: `0 0 10px ${healthColor}66`,
                }}
              />
            </div>
          </div>

          {/* Balance */}
          <div
            className="pt-2 mt-1"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs mb-0.5 text-white/40">Net Balance</p>
            <p className="text-lg font-bold gt">{formatCurrency(balance)}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setShowMobileNav(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  ...(isActive ? {
                    background: 'linear-gradient(135deg, rgba(20,184,166,0.2) 0%, rgba(245,158,11,0.08) 100%)',
                    border: '1px solid rgba(20,184,166,0.2)',
                    boxShadow: '0 0 16px rgba(20,184,166,0.1)',
                    color: 'white',
                  } : {
                    border: '1px solid transparent',
                    color: 'rgba(255,255,255,0.3)',
                  })
                }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: isActive ? 'rgba(20,184,166,0.2)' : 'transparent',
                  }}
                >
                  <Icon size={16} />
                </div>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Button (Demo) */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/5 transition text-sm font-medium w-full"
        >
          <LogOut size={16} />
          Back to Landing
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.05] bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white">Demo Dashboard</h2>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Sample Data</span>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition text-sm font-medium"
          >
            Try Real Data
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
