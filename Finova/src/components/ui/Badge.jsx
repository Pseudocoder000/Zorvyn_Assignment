export default function Badge({ label, variant = 'default' }) {
  const map = {
    income:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    expense: 'bg-red-500/10 text-red-400 border-red-500/20',
    default: 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${map[variant] || map.default}`}>
      {label}
    </span>
  )
}