//section comments are available to detect , thats to ease the code - readiblity

import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
import { Bell, Sun, Moon } from 'lucide-react'
import { motion } from "framer-motion"
import gullak from "../../stickers/gullak.png"
import profileImg from "../../assets/profile.jpg"
import { Link } from "react-router-dom"

export default function Navbar() {
  const dispatch = useDispatch()
  const mode = useSelector(s => s.theme.mode)
  const { user } = useSelector(s => s.auth)

  const notifications = useSelector(s => s.notifications.items)
  const unreadCount = notifications.filter(n => !n.read).length
  
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening'

  return (
    <header className="relative w-full h-16 flex items-center justify-between px-3 md:px-6 border-b border-white/[0.05]">

      {/* LEFT (LOGO ALWAYS VISIBLE) */}
      <div className="flex md:hidden items-center gap-2 z-10">
        <img src={gullak} className="w-7 h-7" />
        <span className="text-sm font-bold">Gullak</span>
      </div>

      {/* CENTER GREETING */}
      <div className="hidden md:flex flex-col ml-4 z-10">
        <p className="text-xs text-white/40">{greeting},</p>
        <p className="text-sm font-semibold text-white">
          {user?.name}
        </p>
      </div>

      {/* FLOATING GULLAK */}
      <div className="hidden md:block absolute left-[20%] right-[10%] h-full pointer-events-none">
        <motion.img
          src={gullak}
          alt="pig"
          className="w-6 sm:w-8 md:w-12 opacity-80"
          animate={{
            x: ["-40%", "40%", "-40%"],
            y: [0, -5, 0],
            rotate: [-10, 10, -10]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3 z-20">

        {/* NOTIFICATION */}
        <Link to="/notifications" className="relative">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-teal-400 transition">
            <Bell size={16} />
          </div>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* THEME TOGGLE (FIXED) */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-amber-400 transition"
        >
          {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* USER AVATAR */}
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
          <img
            src={profileImg}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

      </div>

    </header>
  )
}