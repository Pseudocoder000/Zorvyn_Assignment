import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react'

const links = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights',     label: 'Insights',     icon: Lightbulb },
]

export default function BottomNav() {
  const location = useLocation()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.05] px-4 py-2 flex items-center justify-around"
      style={{ background: 'rgba(8,8,18,0.95)', backdropFilter: 'blur(20px)' }}>
      {links.map((link) => {
        const Icon = link.icon
        const isActive = location.pathname === link.to
        return (
          <Link key={link.to} to={link.to}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
              isActive ? 'text-teal-400' : 'text-white/25'
            }`}>
            <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-teal-500/15' : ''}`}>
              <Icon size={19} />
            </div>
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}