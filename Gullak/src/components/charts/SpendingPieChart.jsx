import { ResponsivePie } from '@nivo/pie'
import { useMemo, useState, useEffect } from 'react'
import { CATEGORY_COLORS } from '../../data/mockTransactions'
import { formatCurrency } from '../../utils/formatters'
import { motion } from "framer-motion"

export default function SpendingPieChart({ transactions }) {
  const [isHovered, setIsHovered] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [_, forceUpdate] = useState(0)

  // ✅ Fix: trigger re-render on resize (no reload needed)
  useEffect(() => {
    const handleResize = () => forceUpdate(prev => prev + 1)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const data = useMemo(() => {
    const totals = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + t.amount
      })

    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .map(([id, value]) => ({
        id,
        label: id,
        value,
        color: CATEGORY_COLORS[id]
      }))
  }, [transactions])

  const total = data.reduce((a, d) => a + d.value, 0)

  return (
    <div className="flex flex-col gap-2 relative overflow-visible w-full">

      {/* 🔥 SAME SIZE (but responsive) */}
      <motion.div
        className="w-full h-[180px] sm:h-[190px] md:h-[200px] lg:h-[220px]"
        animate={{
          rotate: isHovered ? 0 : 360
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setActiveId(null)
        }}
      >
        <ResponsivePie
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          innerRadius={0.65}
          padAngle={2.5}
          cornerRadius={5}
          colors={d => d.data.color}
          borderWidth={0}
          enableArcLinkLabels={false}
          enableArcLabels={false}

          onMouseMove={(datum) => {
            setActiveId(datum.id)
          }}

          tooltip={({ datum }) => (
            <div
              style={{
                position: "fixed",
                background: '#0e0e1f',
                border: `1px solid ${datum.color}44`,
                borderRadius: '10px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#e2e8f0',
                pointerEvents: 'none',
                zIndex: 9999,
                transform: 'translate(-50%, -120%)'
              }}
            >
              <span style={{ color: datum.color }}>● </span>
              {datum.label}:{' '}
              <span style={{ color: datum.color }}>
                {formatCurrency(datum.value)}
              </span>
            </div>
          )}

          theme={{
            tooltip: {
              container: {
                pointerEvents: "none"
              }
            }
          }}
        />
      </motion.div>

      {/* 🔥 Smart Legend */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
        {data.slice(0, 8).map(item => {
          const isActiveItem = item.id === activeId

          return (
            <div
              key={item.id}
              className={`flex items-center gap-2 min-w-0 transition-all duration-300 ${
                isActiveItem ? "scale-105" : ""
              }`}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: item.color,
                  boxShadow: isActiveItem ? `0 0 10px ${item.color}` : "none"
                }}
              />

              <span
                className={`text-xs truncate flex-1 transition-all duration-300 ${
                  isActiveItem ? "text-white font-semibold" : "text-white/50"
                }`}
              >
                {item.id}
              </span>

              <span
                className={`text-xs shrink-0 transition-all duration-300 ${
                  isActiveItem ? "text-white font-bold" : "text-white/70"
                }`}
              >
                {isActiveItem
                  ? formatCurrency(item.value)
                  : `${Math.round((item.value / total) * 100)}%`}
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}