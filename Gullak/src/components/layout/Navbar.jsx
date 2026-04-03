import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
import { Bell, Sun, Moon } from 'lucide-react'
import { TrendingUp } from 'lucide-react'
import gullak from "../../stickers/gullak.png" 

export default function Navbar() {
  const dispatch = useDispatch()
  const mode = useSelector(s => s.theme.mode)
  const { user } = useSelector(s => s.auth)
  const transactions = useSelector(s => s.transactions.items)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const todayCount = transactions.filter(t => t.date === now.toISOString().split('T')[0]).length

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.05] shrink-0">
      {/* Mobile Logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center">
          <img src={gullak} alt="logo" />
        </div>
        <span className="text-base font-extrabold gt text-2xl">Gullak</span>
      </div>

      {/* Desktop Greeting */}
      <div className="hidden md:block">
        <p className="text-xs text-white/40">{greeting},</p>
        <p className="text-sm font-semibold text-white">{user.name} 👋</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative">
          <button className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-teal-400 hover:border-teal-500/30 transition-all">
            <Bell size={15} />
          </button>
          {todayCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gb flex items-center justify-center text-[9px] text-white font-bold">
              {todayCount}
            </span>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-amber-400 hover:border-amber-500/30 transition-all"
        >
          {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl gb flex items-center justify-center text-white text-xs font-bold cursor-pointer ml-1">
          {user.avatar}
        </div>
      </div>
    </header>
  )
}