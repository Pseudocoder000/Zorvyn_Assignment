import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

// Load env
dotenv.config()

// Connect DB
await connectDB()

// App init
const app = express()

// ================= MIDDLEWARE =================

// Body parser
app.use(express.json())

// Logger
app.use(morgan('dev'))

// 🔥 CORS FIX (IMPORTANT)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5175',
    'https://gullak-three.vercel.app'
  ],
  credentials: true,
}))

// ================= ROUTES =================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running 🚀' })
})

// Root route (optional but professional)
app.get('/', (req, res) => {
  res.send('🚀 Gullak API is Live')
})

// API routes
const apiPrefix = process.env.API_PREFIX || '/api'

app.use(`${apiPrefix}/auth`, authRoutes)
app.use(`${apiPrefix}/transactions`, transactionRoutes)
app.use(`${apiPrefix}/dashboard`, dashboardRoutes)

// ================= ERROR HANDLING =================

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Server error
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Server error',
  })
})

// ================= START SERVER =================

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Health: http://localhost:${PORT}/health`)
})

export default app