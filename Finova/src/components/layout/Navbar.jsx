import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'
import { setRole } from '../../features/auth/authSlice'
import { Sun, Moon, ShieldCheck, Eye, ChevronDown, TrendingUp } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const ROLES = [
  { value: 'admin',  label: 'Admin',  Icon: ShieldCheck },
  { value: 'viewer', label: 'Viewer', Icon: Eye },
]

export default function Navbar() {
  const dispatch = useDispatch()
  const mode = useSelector(s => s.theme.mode)
  const role = useSelector(s => s.auth.role)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const activeRole = ROLES.find(r => r.value === role)
  const ActiveIcon = activeRole.Icon

  return (
    <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-surface-card border-b border-gray-200 dark:border-surface-border shrink-0 z-40">

      {/* Logo — always visible */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-brand-500 flex items-center justify-center">
          <TrendingUp size={14} className="text-white" />
        </div>
        <span className="text-base md:text-lg font-bold text-brand-500">Finova</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">

        {/* Role Dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <div className="w-5 h-5 rounded-md bg-brand-500 flex items-center justify-center">
              <ActiveIcon size={11} className="text-white" />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200">
              {activeRole.label}
            </span>
            <ChevronDown
              size={12}
              className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-1">
                {ROLES.map(({ value, label }) => {
                  const isActive = role === value
                  return (
                    <button
                      key={value}
                      onClick={() => { dispatch(setRole(value)); setOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive
                          ? 'bg-brand-500 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                        <RoleIcon size={12} className={isActive ? 'text-white' : 'text-gray-400'} />
                      </div>
                      {label}
                      {isActive && (
                        <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md">
                          Active
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  )
}