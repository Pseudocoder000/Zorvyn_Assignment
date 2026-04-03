import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, change, changeLabel, icon, accent = 'teal' }) {
  const Icon = icon
  const accents = {
    teal:  { color: '#14b8a6', bg: 'rgba(20,184,166,0.12)',  glow: 'rgba(20,184,166,0.25)'  },
    coral: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', glow: 'rgba(248,113,113,0.25)' },
    amber: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  glow: 'rgba(251,191,36,0.25)'  },
    green: { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  glow: 'rgba(52,211,153,0.25)'  },
  }
  const a = accents[accent]
  const isPositive = change >= 0

  return (
    <div className="gc-hover p-5 flex flex-col gap-4 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: a.bg, boxShadow: `0 0 20px ${a.glow}` }}>
          <Icon size={19} style={{ color: a.color }} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${
            isPositive ? 'bg-teal-500/10 text-teal-400' : 'bg-coral-500/10 text-red-400'
          }`}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-sm text-white/40 mt-0.5">{title}</p>
        {changeLabel && <p className="text-xs text-white/25 mt-1">{changeLabel}</p>}
      </div>
      {/* Bottom accent line */}
      <div className="h-0.5 rounded-full opacity-40"
        style={{ background: `linear-gradient(90deg, ${a.color}, transparent)` }} />
    </div>
  )
}