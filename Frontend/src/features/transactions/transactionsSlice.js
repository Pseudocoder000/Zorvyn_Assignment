import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getTransactions,
  createTransaction as apiCreateTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  getDashboardSummary,
  getSpendingByCategory,
  getMonthlyTrend,
} from '../../utils/api'

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await getTransactions(page, limit, filters)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await apiCreateTransaction(transactionData)
      return response.transaction
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateTransaction(id, data)
      return response.transaction
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await apiDeleteTransaction(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchDashboardSummary = createAsyncThunk(
  'transactions/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardSummary()
      return response.summary
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchSpendingByCategory = createAsyncThunk(
  'transactions/fetchSpendingByCategory',
  async (month, { rejectWithValue }) => {
    try {
      const response = await getSpendingByCategory(month)
      return response.categories
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchMonthlyTrend = createAsyncThunk(
  'transactions/fetchMonthlyTrend',
  async (months = 6, { rejectWithValue }) => {
    try {
      const response = await getMonthlyTrend(months)
      return response.trends
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    filter: { search: '', type: 'all', category: 'all', sort: 'date', order: 'desc' },
    pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    dashboard: {
      summary: null,
      spendingByCategory: [],
      monthlyTrend: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    resetFilter: (state) => {
      state.filter = { search: '', type: 'all', category: 'all', sort: 'date', order: 'desc' }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.transactions
        state.pagination = action.payload.pagination
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Create Transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update Transaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(t => t._id === action.payload._id)
        if (index > -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Delete Transaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(t => t._id !== action.payload)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Dashboard Summary
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false
        state.dashboard.summary = action.payload
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Spending by Category
    builder
      .addCase(fetchSpendingByCategory.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSpendingByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.dashboard.spendingByCategory = action.payload
      })
      .addCase(fetchSpendingByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Monthly Trend
    builder
      .addCase(fetchMonthlyTrend.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMonthlyTrend.fulfilled, (state, action) => {
        state.loading = false
        state.dashboard.monthlyTrend = action.payload
      })
      .addCase(fetchMonthlyTrend.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setFilter, resetFilter, clearError } = transactionsSlice.actions
export default transactionsSlice.reducer

export const selectFiltered = state => {
  const { items, filter } = state.transactions
  let result = [...items]
  
  if (filter.search) {
    result = result.filter(t => t.name.toLowerCase().includes(filter.search.toLowerCase()))
  }
  if (filter.type !== 'all') {
    result = result.filter(t => t.type === filter.type)
  }
  if (filter.category !== 'all') {
    result = result.filter(t => t.category === filter.category)
  }
  
  result.sort((a, b) => {
    if (filter.sort === 'date') {
      return filter.order === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
    }
    if (filter.sort === 'amount') {
      return filter.order === 'desc' ? b.amount - a.amount : a.amount - b.amount
    }
    return 0
  })
  
  return result
}
export const { addTransaction } = transactionsSlice.actions