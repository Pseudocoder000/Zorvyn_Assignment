import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Lightbulb, TrendingUp, ShieldCheck, Eye } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setRole } from '../../features/auth/authSlice'
import { formatCurrency } from '../../utils/formatters'
import gullak from "../../stickers/gullak.png" 
import profileImg from "../../assets/profile.jpg";

const links = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights',     label: 'Insights',     icon: Lightbulb },
]

export default function Sidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { role, user } = useSelector(s => s.auth)
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'
  const transactions = useSelector(s => s.transactions.items)

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const balance      = totalIncome - totalExpense
  const health       = Math.min(100, Math.max(0, Math.round(((totalIncome - totalExpense) / Math.max(totalIncome, 1)) * 100)))
  const healthColor  = health > 60 ? '#14b8a6' : health > 30 ? '#f59e0b' : '#f87171'

  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 py-6 px-4 gap-5 transition-colors duration-300"
      style={{
        background: isLight
          ? 'linear-gradient(180deg, #ffffff 0%, #f8fffe 50%, #f0fdf9 100%)'
          : 'transparent',
        borderRight: isLight
          ? '1px solid rgba(20,184,166,0.12)'
          : '1px solid rgba(255,255,255,0.05)',
        boxShadow: isLight ? '4px 0 24px rgba(20,184,166,0.06)' : 'none',
      }}
    >
      {}
      <div className="flex items-center gap-3 px-2">
        {/* <div className="w-9 h-9 rounded-2xl gb flex items-center justify-center shrink-0"> */}
        <div className="w-16 h-9 rounded-2xl flex items-center justify-center shrink-0">
          {/* <TrendingUp size={16} className="text-white" /> */}
          <img src={gullak} alt="logo" />
        </div>
        <span className="text-2xl font-extrabold gt">Gullak</span>
      </div>

      {}
      <div
        className="p-4 flex flex-col gap-3 rounded-2xl transition-all duration-300"
        style={isLight ? {
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf9 100%)',
          border: '1px solid rgba(20,184,166,0.15)',
          boxShadow: '0 4px 20px rgba(20,184,166,0.08), 0 1px 0 rgba(255,255,255,0.8) inset',
        } : {
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {}
        <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
  <img
    src={profileImg}
    alt="profile"
    className="w-full h-full object-cover"
  />
</div>
          <div className="min-w-0">
            <p className={`text-sm font-bold truncate ${isLight ? 'text-slate-700' : 'text-white'}`}>
              {user.name}
            </p>
            <p className={`text-xs truncate ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
              {user.email}
            </p>
          </div>
        </div>

        {/* financial health*/}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
              Financial Health
            </span>
            <span className="text-xs font-bold" style={{ color: healthColor }}>
              {health}/100
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden"
            style={{ background: isLight ? 'rgba(20,184,166,0.1)' : 'rgba(255,255,255,0.06)' }}>
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
        <div className="pt-2 mt-1"
          style={{ borderTop: isLight ? '1px solid rgba(20,184,166,0.1)' : '1px solid rgba(255,255,255,0.06)' }}>
          <p className={`text-xs mb-0.5 ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Net Balance</p>
          <p className="text-lg font-bold gt">{formatCurrency(balance)}</p>
        </div>
      </div>

      {/* Role Switcher */}
      <div
        className="flex gap-1.5 p-1 rounded-xl transition-all duration-300"
        style={isLight ? {
          background: 'linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(245,158,11,0.04) 100%)',
          border: '1px solid rgba(20,184,166,0.12)',
        } : {
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {[
          { v: 'admin',  l: 'Admin',  I: ShieldCheck },
          { v: 'viewer', l: 'Viewer', I: Eye },
        ].map(({ v, l, I }) => {
          const isActive = role === v
          return (
            <button key={v} onClick={() => dispatch(setRole(v))}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
              style={isActive ? {
                background: 'linear-gradient(135deg, #14b8a6, #f59e0b)',
                color: 'white',
                boxShadow: '0 2px 12px rgba(20,184,166,0.35)',
                transform: 'scale(1.02)',
              } : {
                color: isLight ? 'rgba(15,23,42,0.35)' : 'rgba(255,255,255,0.3)',
              }}
            >
              <I size={11} /> {l}
            </button>
          )
        })}
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                ...(isActive ? {
                  background: isLight
                    ? 'linear-gradient(135deg, rgba(20,184,166,0.12) 0%, rgba(245,158,11,0.06) 100%)'
                    : 'linear-gradient(135deg, rgba(20,184,166,0.2) 0%, rgba(245,158,11,0.08) 100%)',
                  border: isLight
                    ? '1px solid rgba(20,184,166,0.2)'
                    : '1px solid rgba(20,184,166,0.2)',
                  boxShadow: isLight
                    ? '0 4px 16px rgba(20,184,166,0.1)'
                    : '0 0 16px rgba(20,184,166,0.1)',
                  color: isLight ? '#0d9488' : 'white',
                } : {
                  border: '1px solid transparent',
                  color: isLight ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.3)',
                })
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = isLight ? '#0d9488' : 'rgba(255,255,255,0.8)'
                  e.currentTarget.style.background = isLight
                    ? 'linear-gradient(135deg, rgba(20,184,166,0.07) 0%, rgba(245,158,11,0.03) 100%)'
                    : 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.transform = 'translateX(3px)'
                  e.currentTarget.style.border = isLight
                    ? '1px solid rgba(20,184,166,0.1)'
                    : '1px solid transparent'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = isLight ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.3)'
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.border = '1px solid transparent'
                }
              }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  transition: 'all 0.2s ease',
                  background: isActive
                    ? isLight ? 'rgba(20,184,166,0.12)' : 'rgba(20,184,166,0.2)'
                    : isLight ? 'rgba(20,184,166,0.06)' : 'rgba(255,255,255,0.03)',
                  boxShadow: isActive ? '0 0 12px rgba(20,184,166,0.25)' : 'none',
                }}>
                <Icon size={15} style={{
                  color: isActive ? '#14b8a6' : isLight ? 'rgba(15,23,42,0.35)' : 'rgba(255,255,255,0.3)',
                }} />
              </div>

              <span>{link.label}</span>

              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: '#14b8a6', boxShadow: '0 0 8px #2dd4bf' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-2.5 rounded-xl transition-all duration-300"
        style={isLight ? {
          background: 'linear-gradient(135deg, rgba(20,184,166,0.06) 0%, rgba(245,158,11,0.04) 100%)',
          border: '1px solid rgba(20,184,166,0.1)',
        } : {
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
        <p className="text-[10px] gt font-semibold mb-0.5">Gullak v1.0</p>
        <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/25'}`}>Finance Dashboard</p>
      </div>
    </aside>
  )
}