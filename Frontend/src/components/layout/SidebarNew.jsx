/**
 * ════════════════════════════════════════════════════════════════
 * SIDEBAR COMPONENT - Real-time Balance Display
 * ════════════════════════════════════════════════════════════════
 * 
 * Navigation sidebar with real-time balance and transaction totals
 * using Redux selectors for reactive data
 */

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Send,
  Plus,
  LogOut,
  ChevronDown,
  Home,
  TrendingUp,
  Settings,
  Bell,
  Wallet,
  Eye,
  EyeOff,
} from 'lucide-react'

import { formatCurrency } from '../../utils/formatters'
import {
  selectTotalBalance,
  selectTotalIncome,
  selectTotalExpense,
} from '../transactions/transactionsSelectors'

export default function Sidebar({ isOpen, onClose, onLogout }) {
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.user)
  const [showBalance, setShowBalance] = useState(true)
  const [activeNav, setActiveNav] = useState('dashboard')

  // Get real-time selectors
  const totalBalance = useSelector(selectTotalBalance)
  const totalIncome = useSelector(selectTotalIncome)
  const totalExpense = useSelector(selectTotalExpense)

  const handleNavigation = (path, key) => {
    setActiveNav(key)
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-900 to-slate-950 
          border-r border-slate-800 transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative
          lg:inset-auto lg:w-72 z-50 flex flex-col overflow-y-auto
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Wallet size={24} className="text-white font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Gullak</h1>
              <p className="text-xs text-gray-400">Financial Tracker</p>
            </div>
          </div>

          {/* Close button for mobile */}
          {isOpen && (
            <button
              onClick={onClose}
              className="lg:hidden absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronDown
                size={20}
                className="rotate-90 text-gray-400 hover:text-white"
              />
            </button>
          )}
        </div>

        {/* Balance Display */}
        <div className="p-6 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-semibold text-sm">Total Balance</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
              title="Toggle balance visibility"
            >
              {showBalance ? (
                <Eye size={18} className="text-gray-400" />
              ) : (
                <EyeOff size={18} className="text-gray-400" />
              )}
            </button>
          </div>

          <div
            className={`text-3xl font-bold transition-all ${
              showBalance ? 'text-teal-400 blur-none' : 'blur-sm text-gray-600'
            }`}
          >
            {showBalance ? formatCurrency(totalBalance) : '••••••'}
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Income</p>
              <p className="text-lg font-bold text-green-400">
                {showBalance ? formatCurrency(totalIncome) : '••••••'}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Expense</p>
              <p className="text-lg font-bold text-red-400">
                {showBalance ? formatCurrency(totalExpense) : '••••••'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-b border-slate-800 space-y-2">
          <button
            onClick={() => handleNavigation('/dashboard', 'dashboard')}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => handleNavigation('/transactions', 'transactions')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-gray-200 font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
            Menu
          </p>

          {[
            {
              icon: Home,
              label: 'Home',
              path: '/dashboard',
              key: 'dashboard',
            },
            {
              icon: Send,
              label: 'Transactions',
              path: '/transactions',
              key: 'transactions',
            },
            {
              icon: TrendingUp,
              label: 'Insights',
              path: '/insights',
              key: 'insights',
            },
            {
              icon: Bell,
              label: 'Notifications',
              path: '/notifications',
              key: 'notifications',
            },
          ].map(({ icon: Icon, label, path, key }) => (
            <button
              key={key}
              onClick={() => handleNavigation(path, key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                activeNav === key
                  ? 'bg-teal-600/20 text-teal-400 border-l-2 border-teal-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-6 border-t border-slate-800 space-y-3">
          <button
            onClick={() => handleNavigation('/profile', 'profile')}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors group"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-teal-600/30 flex items-center justify-center text-teal-400 font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-white group-hover:text-teal-400 transition-colors">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </button>

          <div className="flex gap-2 pt-2 border-t border-slate-700">
            <button
              onClick={() => handleNavigation('/profile', 'profile')}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
