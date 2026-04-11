import express from 'express'
import {
  getDashboardSummary,
  getSpendingByCategory,
  getMonthlyTrend,
  getBudgetStatus,
} from '../controllers/dashboardController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes are protected
router.use(protect)

router.get('/summary', getDashboardSummary)
router.get('/spending-by-category', getSpendingByCategory)
router.get('/monthly-trend', getMonthlyTrend)
router.get('/budget-status', getBudgetStatus)

export default router
