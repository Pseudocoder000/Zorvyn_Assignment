import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Lightbulb, TrendingUp } from 'lucide-react'

const links = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights',     label: 'Insights',     icon: Lightbulb },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-surface-card border-r border-gray-200 dark:border-surface-border px-4 py-6 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
          <TrendingUp size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Finova</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-3 py-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
        <p className="text-xs font-semibold text-brand-400 mb-1">Finova v1.0</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Finance Dashboard</p>
      </div>
    </aside>
  )
}