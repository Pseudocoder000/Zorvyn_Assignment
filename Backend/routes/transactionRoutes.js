import express from 'express'
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} from '../controllers/transactionController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// All routes are protected
router.use(protect)

// Main routes
router.get('/', getTransactions)
router.post('/', createTransaction)
router.get('/stats/summary', getTransactionStats)
router.get('/:id', getTransaction)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

export default router
