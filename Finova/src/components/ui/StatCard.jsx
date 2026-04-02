import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, change, changeLabel, icon, color = 'brand' }) {
  const Icon = icon 
  const isPositive = change >= 0
  const colorMap = {
    brand:  { bg: 'bg-brand-500/10',  icon: 'text-brand-400',  border: 'border-brand-500/20' },
    green:  { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
    red:    { bg: 'bg-red-500/10',     icon: 'text-red-400',     border: 'border-red-500/20' },
    purple: { bg: 'bg-purple-500/10',  icon: 'text-purple-400',  border: 'border-purple-500/20' },
  }
  const c = colorMap[color]
  return (
    <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-surface-border p-5 flex flex-col gap-4 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center`}>
          <Icon size={18} className={c.icon} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
        {changeLabel && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{changeLabel}</p>}
      </div>
    </div>
  )
}