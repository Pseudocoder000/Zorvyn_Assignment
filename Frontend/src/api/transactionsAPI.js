import axiosInstance from './axiosInstance'

/**
 * Transactions API Service
 * Handles all transaction-related API calls
 */

export const transactionsAPI = {
  /**
   * Get all transactions with pagination and filters
   * @param {Object} params - { page, limit, type, category, startDate, endDate }
   * @returns {Promise} - { success, transactions, pagination }
   */
  getTransactions: (params = {}) =>
    axiosInstance.get('/transactions', { params }),

  /**
   * Get single transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise} - { success, transaction }
   */
  getTransaction: (id) =>
    axiosInstance.get(`/transactions/${id}`),

  /**
   * Create new transaction
   * @param {Object} transactionData - { type, category, amount, name, description, date }
   * @returns {Promise} - { success, transaction }
   */
  createTransaction: (transactionData) =>
    axiosInstance.post('/transactions', transactionData),

  /**
   * Update existing transaction
   * @param {string} id - Transaction ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise} - { success, transaction }
   */
  updateTransaction: (id, updateData) =>
    axiosInstance.put(`/transactions/${id}`, updateData),

  /**
   * Delete transaction
   * @param {string} id - Transaction ID
   * @returns {Promise} - { success, message }
   */
  deleteTransaction: (id) =>
    axiosInstance.delete(`/transactions/${id}`),

  /**
   * Get transaction statistics
   * @returns {Promise} - { success, stats }
   */
  getStats: () =>
    axiosInstance.get('/transactions/stats/summary'),
}

export default transactionsAPI
