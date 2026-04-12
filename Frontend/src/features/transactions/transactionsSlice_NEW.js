import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import transactionsAPI from '../../api/transactionsAPI'
import dashboardAPI from '../../api/dashboardAPI'

/**
 * ============================================
 * ASYNC THUNKS
 * ============================================
 */

/**
 * Fetch all transactions with optional pagination and filters
 */
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.getTransactions(params)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch transactions'
      )
    }
  }
)

/**
 * Create new transaction
 */
export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.createTransaction(transactionData)
      return response.data.transaction
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create transaction'
      )
    }
  }
)

/**
 * Update existing transaction
 */
export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await transactionsAPI.updateTransaction(id, data)
      return response.data.transaction
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update transaction'
      )
    }
  }
)

/**
 * Delete transaction
 */
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await transactionsAPI.deleteTransaction(id)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete transaction'
      )
    }
  }
)

/**
 * ============================================
 * DASHBOARD THUNKS
 * ============================================
 */

/**
 * Fetch dashboard summary
 * Returns: totalBalance, totalIncome, totalExpense, thisMonth stats, recentTransactions
 */
export const fetchDashboardSummary = createAsyncThunk(
  'transactions/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getSummary()
      return response.data.summary
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch dashboard summary'
      )
    }
  }
)

/**
 * Fetch spending by category
 */
export const fetchSpendingByCategory = createAsyncThunk(
  'transactions/fetchSpendingByCategory',
  async (month, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getSpendingByCategory(month)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch spending data'
      )
    }
  }
)

/**
 * Fetch monthly trend data
 */
export const fetchMonthlyTrend = createAsyncThunk(
  'transactions/fetchMonthlyTrend',
  async (months = 6, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getMonthlyTrend(months)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch trend data'
      )
    }
  }
)

/**
 * Fetch budget status
 */
export const fetchBudgetStatus = createAsyncThunk(
  'transactions/fetchBudgetStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getBudgetStatus()
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch budget status'
      )
    }
  }
)

/**
 * ============================================
 * SLICE
 * ============================================
 */

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    // Transaction lists
    items: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    },

    // Dashboard data
    dashboard: {
      summary: null,
      spending: null,
      trend: null,
      budgets: null,
    },

    // Filter state
    filter: {
      type: 'all', // 'all' | 'income' | 'expense'
      category: 'all',
      month: null,
    },

    // Loading & error states
    loading: false,
    dashboardLoading: false,
    error: null,
  },

  // Synchronous actions
  reducers: {
    /**
     * Set filter - Filter transactions by type, category, etc.
     */
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },

    /**
     * Reset filter to defaults
     */
    resetFilter: (state) => {
      state.filter = {
        type: 'all',
        category: 'all',
        month: null,
      }
    },

    /**
     * Clear transactions
     */
    clearTransactions: (state) => {
      state.items = []
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null
    },
  },

  // Async thunk handlers
  extraReducers: (builder) => {
    // ─── FETCH TRANSACTIONS ───────────
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.transactions || []
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ─── CREATE TRANSACTION ───────────
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

    // ─── UPDATE TRANSACTION ───────────
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((t) => t._id === action.payload._id)
        if (index > -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ─── DELETE TRANSACTION ───────────
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((t) => t._id !== action.payload)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ─── FETCH DASHBOARD SUMMARY ──────
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.dashboardLoading = true
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.dashboardLoading = false
        state.dashboard.summary = action.payload
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.dashboardLoading = false
        state.error = action.payload
      })

    // ─── FETCH SPENDING BY CATEGORY ────
    builder
      .addCase(fetchSpendingByCategory.pending, (state) => {
        state.dashboardLoading = true
      })
      .addCase(fetchSpendingByCategory.fulfilled, (state, action) => {
        state.dashboardLoading = false
        state.dashboard.spending = action.payload
      })
      .addCase(fetchSpendingByCategory.rejected, (state, action) => {
        state.dashboardLoading = false
        state.error = action.payload
      })

    // ─── FETCH MONTHLY TREND ──────────
    builder
      .addCase(fetchMonthlyTrend.pending, (state) => {
        state.dashboardLoading = true
      })
      .addCase(fetchMonthlyTrend.fulfilled, (state, action) => {
        state.dashboardLoading = false
        state.dashboard.trend = action.payload
      })
      .addCase(fetchMonthlyTrend.rejected, (state, action) => {
        state.dashboardLoading = false
        state.error = action.payload
      })

    // ─── FETCH BUDGET STATUS ──────────
    builder
      .addCase(fetchBudgetStatus.pending, (state) => {
        state.dashboardLoading = true
      })
      .addCase(fetchBudgetStatus.fulfilled, (state, action) => {
        state.dashboardLoading = false
        state.dashboard.budgets = action.payload
      })
      .addCase(fetchBudgetStatus.rejected, (state, action) => {
        state.dashboardLoading = false
        state.error = action.payload
      })
  },
})

export const { setFilter, resetFilter, clearTransactions, clearError } = transactionsSlice.actions
export default transactionsSlice.reducer
