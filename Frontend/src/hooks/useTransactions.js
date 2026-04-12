import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactions,
  createTransaction as createTx,
  updateTransaction as updateTx,
  deleteTransaction as deleteTx,
  fetchDashboardSummary,
  fetchSpendingByCategory,
  fetchMonthlyTrend,
  fetchBudgetStatus,
  setFilter,
  resetFilter,
  clearError,
} from '../features/transactions/transactionsSlice_NEW'

/**
 * Custom hook for transactions and dashboard operations
 * Usage:
 *   const {
 *     transactions,
 *     dashboard,
 *     loading,
 *     error,
 *     fetchTransactions,
 *     createTransaction,
 *     updateTransaction,
 *     deleteTransaction,
 *     fetchDashboardData,
 *   } = useTransactions()
 */
export const useTransactions = () => {
  const dispatch = useDispatch()
  const {
    items: transactions,
    dashboard,
    loading,
    dashboardLoading,
    error,
    filter,
    pagination,
  } = useSelector((s) => s.transactions)

  // ─── Transaction Operations ───────
  const handleFetchTransactions = useCallback(
    (params = {}) => {
      return dispatch(fetchTransactions(params))
    },
    [dispatch]
  )

  const handleCreateTransaction = useCallback(
    async (transactionData) => {
      const result = await dispatch(createTx(transactionData)).unwrap()
      // Refetch dashboard summary to update balance
      dispatch(fetchDashboardSummary())
      return result
    },
    [dispatch]
  )

  const handleUpdateTransaction = useCallback(
    async (id, data) => {
      const result = await dispatch(updateTx({ id, data })).unwrap()
      // Refetch dashboard summary to update balance
      dispatch(fetchDashboardSummary())
      return result
    },
    [dispatch]
  )

  const handleDeleteTransaction = useCallback(
    async (id) => {
      const result = await dispatch(deleteTx(id)).unwrap()
      // Refetch dashboard summary to update balance
      dispatch(fetchDashboardSummary())
      return result
    },
    [dispatch]
  )

  // ─── Dashboard Operations ─────────
  const handleFetchDashboardSummary = useCallback(() => {
    return dispatch(fetchDashboardSummary())
  }, [dispatch])

  const handleFetchSpendingByCategory = useCallback((month) => {
    return dispatch(fetchSpendingByCategory(month))
  }, [dispatch])

  const handleFetchMonthlyTrend = useCallback((months = 6) => {
    return dispatch(fetchMonthlyTrend(months))
  }, [dispatch])

  const handleFetchBudgetStatus = useCallback(() => {
    return dispatch(fetchBudgetStatus())
  }, [dispatch])

  /**
   * Fetch all dashboard data at once (parallel)
   * Useful for initializing dashboard page
   */
  const fetchAllDashboardData = useCallback(
    async (months = 6) => {
      try {
        await Promise.all([
          dispatch(fetchDashboardSummary()),
          dispatch(fetchSpendingByCategory()),
          dispatch(fetchMonthlyTrend(months)),
          dispatch(fetchBudgetStatus()),
        ])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      }
    },
    [dispatch]
  )

  // ─── Filter Operations ────────────
  const handleSetFilter = useCallback(
    (filterData) => {
      dispatch(setFilter(filterData))
    },
    [dispatch]
  )

  const handleResetFilter = useCallback(() => {
    dispatch(resetFilter())
  }, [dispatch])

  const handleClearError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    // State
    transactions,
    dashboard,
    loading,
    dashboardLoading,
    error,
    filter,
    pagination,

    // Transaction operations
    fetchTransactions: handleFetchTransactions,
    createTransaction: handleCreateTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,

    // Dashboard operations
    fetchDashboardSummary: handleFetchDashboardSummary,
    fetchSpendingByCategory: handleFetchSpendingByCategory,
    fetchMonthlyTrend: handleFetchMonthlyTrend,
    fetchBudgetStatus: handleFetchBudgetStatus,
    fetchAllDashboardData,

    // Filter operations
    setFilter: handleSetFilter,
    resetFilter: handleResetFilter,
    clearError: handleClearError,
  }
}

export default useTransactions
