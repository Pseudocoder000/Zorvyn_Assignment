import axiosInstance from './axiosInstance'

/**
 * Dashboard API Service
 * Handles all dashboard analytics and summary API calls
 */

export const dashboardAPI = {
  /**
   * Get dashboard summary (balance, income, expenses, recent transactions)
   * @returns {Promise} - { success, summary: { totalBalance, totalIncome, totalExpense, thisMonthIncome, thisMonthExpense, recentTransactions } }
   */
  getSummary: () =>
    axiosInstance.get('/dashboard/summary'),

  /**
   * Get spending by category
   * @param {string} month - Optional month filter (format: YYYY-MM)
   * @returns {Promise} - { success, categories }
   */
  getSpendingByCategory: (month) =>
    axiosInstance.get('/dashboard/spending-by-category', {
      params: month ? { month } : {},
    }),

  /**
   * Get monthly trend for balance/income/expenses
   * @param {number} months - Number of months to retrieve (default: 6)
   * @returns {Promise} - { success, trend }
   */
  getMonthlyTrend: (months = 6) =>
    axiosInstance.get('/dashboard/monthly-trend', {
      params: { months },
    }),

  /**
   * Get budget status against set budgets
   * @returns {Promise} - { success, budgets }
   */
  getBudgetStatus: () =>
    axiosInstance.get('/dashboard/budget-status'),
}

export default dashboardAPI
