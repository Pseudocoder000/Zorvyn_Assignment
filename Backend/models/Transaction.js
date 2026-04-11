import mongoose from 'mongoose'
import { CATEGORIES } from '../data/constants.js'

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Please specify transaction type'],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Please select a category'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount must be positive'],
    },
    name: {
      type: String,
      required: [true, 'Please provide transaction name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 })
transactionSchema.index({ userId: 1, category: 1 })

export default mongoose.model('Transaction', transactionSchema)
