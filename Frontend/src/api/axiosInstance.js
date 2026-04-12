import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Axios instance with automatic token injection
 * Intercepts requests to add Authorization header
 * Handles token expiration and refresh
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Gullak_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('Gullak_token')
      localStorage.removeItem('Gullak_user')
      localStorage.removeItem('Gullak_role')
      // Optionally redirect to login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
