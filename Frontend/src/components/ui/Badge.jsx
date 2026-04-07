export default function Badge({ label, variant = 'default' }) {
  const map = {
    income:  { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf',  border: 'rgba(20,184,166,0.25)'  },
    expense: { bg: 'rgba(248,113,113,0.12)', color: '#f87171',  border: 'rgba(248,113,113,0.25)' },
    default: { bg: 'rgba(255,255,255,0.05)', color: '#94a3b8',  border: 'rgba(255,255,255,0.08)' },
  }
  const s = map[variant] || map.default
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {label}
    </span>
  )
}