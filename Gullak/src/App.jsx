import { useEffect, useState, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights from './pages/Insights'
import { motion } from "framer-motion"
import gullak from "./stickers/gullak.png"

export default function App() {
  const mode = useSelector(s => s.theme.mode)
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const firstLoad = useRef(true) // 🔥 KEY FIX

  // 🌗 Theme
  useEffect(() => {
    if (mode === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [mode])

  // 🔥 Loader ONLY on route change (not first load)
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false
      return
    }

    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      {/* 🔥 SINGLE LOADER */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-[#05060f]/90 flex items-center justify-center">
          
          <div className="relative flex flex-col items-center">

            {/* 🐷 Gullak */}
            <motion.img
              src={gullak}
              className="w-16 md:w-20"
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            {/* 💰 Coin */}
            <motion.div
              className="w-4 h-4 bg-yellow-400 rounded-full absolute -top-6"
              animate={{
                y: [0, 35, 15],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeIn"
              }}
            />

            <p className="text-white/60 text-sm mt-3">
              Adding to Gullak...
            </p>
          </div>
        </div>
      )}

      {/* 🔔 Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: mode === 'dark' ? '#0e0e1f' : '#ffffff',
            color: mode === 'dark' ? '#e2e8f0' : '#1e293b',
            border: mode === 'dark'
              ? '1px solid rgba(20,184,166,0.25)'
              : '1px solid rgba(20,184,166,0.3)',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          },
          success: { iconTheme: { primary: '#14b8a6', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#fff' } },
        }}
      />

      {/* 📄 Routes */}
      <Routes location={location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="insights" element={<Insights />} />
        </Route>
      </Routes>
    </>
  )
}