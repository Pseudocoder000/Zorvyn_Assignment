import mongoose from 'mongoose'

const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bankName: {
      type: String,
      required: [true, 'Please provide bank name'],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, 'Please provide account number'],
      trim: true,
      minlength: [8, 'Account number must be at least 8 characters'],
      maxlength: [20, 'Account number cannot exceed 20 characters'],
    },
    ifscCode: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    initialBalance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Index for faster queries
bankAccountSchema.index({ userId: 1 })
bankAccountSchema.index({ userId: 1, isActive: 1 })

export default mongoose.model('BankAccount', bankAccountSchema)
