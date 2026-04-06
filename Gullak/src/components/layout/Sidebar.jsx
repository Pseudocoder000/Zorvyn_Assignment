import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Lightbulb, ShieldCheck, Eye } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setRole } from '../../features/auth/authSlice'
import { formatCurrency } from '../../utils/formatters'
import gullak from "../../stickers/gullak.png" 
import profileImg from "../../assets/profile.jpg";

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const { role, user } = useSelector(s => s.auth)
  const mode = useSelector(s => s.theme.mode)
  const isLight = mode === 'light'
  const transactions = useSelector(s => s.transactions.items)

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const balance = totalIncome - totalExpense
  const health = Math.min(100, Math.max(0, Math.round(((totalIncome - totalExpense) / Math.max(totalIncome, 1)) * 100)))
  const healthColor = health > 60 ? '#14b8a6' : health > 30 ? '#f59e0b' : '#f87171'

  return (
    <>
      {/* BACKDROP (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full z-50
          w-64 shrink-0 py-6 px-4 gap-5 flex flex-col
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
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

        {/* LOGO */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-16 h-9 rounded-2xl flex items-center justify-center shrink-0">
            <img src={gullak} alt="logo" />
          </div>
          <span className="text-2xl font-extrabold gt">Gullak</span>
        </div>

        {/* PROFILE CARD */}
        <div
          className="p-4 flex flex-col gap-3 rounded-2xl"
          style={isLight ? {
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf9 100%)',
            border: '1px solid rgba(20,184,166,0.15)',
            boxShadow: '0 4px 20px rgba(20,184,166,0.08)',
          } : {
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <img src={profileImg} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold truncate ${isLight ? 'text-slate-700' : 'text-white'}`}>
                {user?.name}
              </p>
              <p className={`text-xs truncate ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* HEALTH */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs">Financial Health</span>
              <span className="text-xs font-bold" style={{ color: healthColor }}>
                {health}/100
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${health}%`, background: healthColor }}
              />
            </div>
          </div>

          {/* BALANCE */}
          <div className="pt-2">
            <p className="text-xs text-white/40">Net Balance</p>
            <p className="text-lg font-bold">{formatCurrency(balance)}</p>
          </div>
        </div>

        {/* ROLE SWITCH */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5">
          {[
            { v: 'admin', l: 'Admin', I: ShieldCheck },
            { v: 'viewer', l: 'Viewer', I: Eye },
          ].map(({ v, l, I }) => {
            const active = role === v
            return (
              <button
                key={v}
                onClick={() => dispatch(setRole(v))}
                className={`flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1 ${
                  active ? 'bg-teal-500 text-white' : 'text-white/40'
                }`}
              >
                <I size={12} /> {l}
              </button>
            )
          })}
        </div>

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                  active ? 'bg-teal-500/20 text-white' : 'text-white/40'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* FOOTER */}
        <div className="text-[10px] text-white/30 px-2">
          Gullak v1.0
        </div>

      </aside>
    </>
  )
}