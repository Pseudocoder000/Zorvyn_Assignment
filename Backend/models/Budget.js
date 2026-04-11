import mongoose from 'mongoose'
import { CATEGORIES, BUDGET_LIMITS } from '../data/constants.js'

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Please select a category'],
    },
    limit: {
      type: Number,
      required: [true, 'Please provide a budget limit'],
      min: [0, 'Budget limit must be positive'],
    },
    month: {
      type: String, // Format: "YYYY-MM"
      required: true,
    },
  },
  { timestamps: true }
)

// Create unique index for userId + category + month
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true })

export default mongoose.model('Budget', budgetSchema)
