import express from 'express'
import multer from 'multer'
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} from '../controllers/transactionController.js'
import { uploadCSV, getCSVSample, getUploadGuide } from '../controllers/csvController.js'
import { protect } from '../middleware/auth.js'

// Configure multer for file upload (in memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    const isCsv = file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')
    const isTxt = file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')
    
    if (isCsv || isPdf || isTxt) {
      cb(null, true)
    } else {
      cb(new Error('Only CSV, PDF, and TXT files are allowed'), false)
    }
  }
})

const router = express.Router()

// All routes are protected
router.use(protect)

// CSV routes (must be before /:id to avoid route conflicts)
router.post('/upload-csv', upload.single('file'), uploadCSV)
router.get('/csv/sample', getCSVSample)
router.get('/upload-guide', getUploadGuide)

// Main routes
router.get('/', getTransactions)
router.post('/', createTransaction)
router.get('/stats/summary', getTransactionStats)
router.get('/:id', getTransaction)
router.put('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

export default router
