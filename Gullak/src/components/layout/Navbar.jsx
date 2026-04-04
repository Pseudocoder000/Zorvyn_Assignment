import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
import { Bell, Sun, Moon } from 'lucide-react'
import { motion } from "framer-motion"
import gullak from "../../stickers/gullak.png" 

export default function Navbar() {
  const dispatch = useDispatch()
  const mode = useSelector(s => s.theme.mode)
  const { user } = useSelector(s => s.auth)

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening'

  return (
    <header className="relative w-full h-16 flex items-center px-4 md:px-6 border-b border-white/[0.05]">

      {/* LEFT */}
      <div className="flex items-center gap-2 z-10">
        <img src={gullak} className="w-6 h-6 md:w-7 md:h-7" />
        <span className="text-lg md:text-xl font-bold">Gullak</span>
      </div>

      {/* GREETING */}
      <div className="ml-4 hidden md:block z-10">
        <p className="text-xs text-white/40">{greeting},</p>
        <p className="text-sm font-semibold text-white">{user.name} 👋</p>
      </div>

      {/* 🐷 FLOATING AREA (KEY FIX) */}
      <div className="absolute left-[20%] right-[10%] h-full pointer-events-none">

        <motion.img
          src={gullak}
          alt="pig"
          className="absolute top-4 w-7 md:w-8 opacity-90"
          animate={{
            x: ["0%", "100%", "0%"],   // stays inside THIS lane
            y: [0, -6, 0],
            rotate: [-10, 10, -10, -10]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-2 md:gap-3 z-10">

        <button className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-teal-400 transition">
          <Bell size={16} />
        </button>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-white/40 hover:text-amber-400 transition"
        >
          {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-yellow-400 flex items-center justify-center text-xs font-bold text-white">
          {user.avatar}
        </div>
      </div>

    </header>
  )
}