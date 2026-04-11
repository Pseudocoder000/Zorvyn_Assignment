import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

// Load environment variables
dotenv.config()

// Connect to database
await connectDB()

// Initialize express app
const app = express()

// Middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Routes
const apiPrefix = process.env.API_PREFIX || '/api'
app.use(`${apiPrefix}/auth`, authRoutes)
app.use(`${apiPrefix}/transactions`, transactionRoutes)
app.use(`${apiPrefix}/dashboard`, dashboardRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Server error',
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 API docs: http://localhost:${PORT}/health`)
})

export default app
