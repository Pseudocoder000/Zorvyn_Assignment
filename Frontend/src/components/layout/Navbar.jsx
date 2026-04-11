//section comments are available to detect , thats to ease the code - readiblity

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
import { logout } from '../../features/auth/authSlice'
import { Bell, Sun, Moon, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import gullak from "../../stickers/gullak.png"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const mode = useSelector(s => s.theme.mode)
  const { user } = useSelector(s => s.auth)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const notifications = useSelector(s => s.notifications.items)
  const unreadCount = notifications.filter(n => !n.read).length
  
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening'

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U'
  }

  const handleLogout = () => {
    dispatch(logout())
    setShowProfileMenu(false)
    navigate('/login')
  }

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
          {user?.name || 'User'}
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

        {/* USER PROFILE BUTTON WITH DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/[0.06] hover:border-teal-400/50 transition-all flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-teal-400/20 to-blue-400/20 hover:from-teal-400/30 hover:to-blue-400/30 hover:shadow-lg hover:shadow-teal-400/20"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-teal-300">
                {getInitials(user?.name)}
              </span>
            )}
          </button>

          {/* DROPDOWN MENU */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl shadow-lg overflow-hidden z-50"
                onClick={(e) => e.stopPropagation()}
              >
                {/* USER INFO */}
                <div className="px-4 py-3 border-b border-white/[0.05]">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-white/40">{user?.email}</p>
                </div>

                {/* MENU ITEMS */}
                <div className="py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('🔍 Navigating to profile...')
                      navigate('/profile')
                      setShowProfileMenu(false)
                    }}
                    className="w-full px-4 py-2 flex items-center gap-3 text-sm text-white/70 hover:text-white hover:bg-teal-500/20 transition-all active:scale-95"
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLogout()
                    }}
                    className="w-full px-4 py-2 flex items-center gap-3 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.15] transition-all active:scale-95"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CLOSE MENU ON OUTSIDE CLICK */}
          {showProfileMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowProfileMenu(false)}
            />
          )}
        </div>

      </div>

    </header>
  )
}