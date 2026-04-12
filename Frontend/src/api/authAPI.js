import axiosInstance from './axiosInstance'

/**
 * Authentication API Service
 * Handles all auth-related API calls: login, signup, token management
 */

export const authAPI = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - { success, token, user }
   */
  login: (email, password) =>
    axiosInstance.post('/auth/login', { email, password }),

  /**
   * Sign up new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - { success, token, user }
   */
  signup: (name, email, password) =>
    axiosInstance.post('/auth/signup', { name, email, password }),

  /**
   * Fetch current user profile
   * @returns {Promise} - { success, user }
   */
  getMe: () =>
    axiosInstance.get('/auth/me'),

  /**
   * Update user profile (name, phone, email, bank details)
   * @param {Object} profileData - { name, phoneNumber, profileImage, bankName, accountNumber, ifscCode }
   * @returns {Promise} - { success, user, message }
   */
  updateProfile: (profileData) =>
    axiosInstance.put('/auth/profile', profileData),
}

export default authAPI
