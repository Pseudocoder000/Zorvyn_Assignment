const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const buildUrl = (path) => {
  if (!API_BASE) return path
  return `${API_BASE.replace(/\/+$/, '')}${path}`
}

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('Gullak_token')
}

// Main fetch function with auth header
const fetchJson = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add token if available
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, { ...options, headers })
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.message || body?.error || response.statusText || 'Request failed')
  }

  return body
}

// ==================== AUTH ENDPOINTS ====================

export const loginRequest = async (email, password) => {
  return fetchJson(buildUrl('/auth/login'), {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export const signupRequest = async (name, email, password) => {
  return fetchJson(buildUrl('/auth/signup'), {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export const getCurrentUser = async () => {
  return fetchJson(buildUrl('/auth/me'), {
    method: 'GET',
  })
}

export const updateProfile = async (profileData) => {
  return fetchJson(buildUrl('/auth/profile'), {
    method: 'PUT',
    body: JSON.stringify(profileData),
  })
}

// ==================== TRANSACTION ENDPOINTS ====================

export const getTransactions = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    ...filters,
  })
  return fetchJson(buildUrl(`/transactions?${params}`), {
    method: 'GET',
  })
}

export const getTransaction = async (id) => {
  return fetchJson(buildUrl(`/transactions/${id}`), {
    method: 'GET',
  })
}

export const createTransaction = async (transactionData) => {
  return fetchJson(buildUrl('/transactions'), {
    method: 'POST',
    body: JSON.stringify(transactionData),
  })
}

export const updateTransaction = async (id, transactionData) => {
  return fetchJson(buildUrl(`/transactions/${id}`), {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  })
}

export const deleteTransaction = async (id) => {
  return fetchJson(buildUrl(`/transactions/${id}`), {
    method: 'DELETE',
  })
}

export const getTransactionStats = async () => {
  return fetchJson(buildUrl('/transactions/stats/summary'), {
    method: 'GET',
  })
}

// ==================== DASHBOARD ENDPOINTS ====================

export const getDashboardSummary = async () => {
  return fetchJson(buildUrl('/dashboard/summary'), {
    method: 'GET',
  })
}

export const getSpendingByCategory = async (month) => {
  let url = buildUrl('/dashboard/spending-by-category')
  if (month) {
    url += `?month=${month}`
  }
  return fetchJson(url, {
    method: 'GET',
  })
}

export const getMonthlyTrend = async (months = 6) => {
  return fetchJson(buildUrl(`/dashboard/monthly-trend?months=${months}`), {
    method: 'GET',
  })
}

export const getBudgetStatus = async () => {
  return fetchJson(buildUrl('/dashboard/budget-status'), {
    method: 'GET',
  })
}

// ==================== CSV UPLOAD ENDPOINTS ====================

/**
 * Upload CSV file for bulk transaction import
 * @param {File} file - CSV file from input
 * @returns {Promise} Response with uploaded transactions
 */
export const uploadCSV = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const token = getToken()
  const headers = {}
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildUrl('/transactions/upload-csv'), {
    method: 'POST',
    headers,
    body: formData,
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.message || response.statusText || 'CSV upload failed')
  }

  return body
}

/**
 * Get CSV sample file
 * @returns {Promise} Sample CSV data
 */
export const getCSVSample = async () => {
  const token = getToken()
  const headers = {}
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildUrl('/transactions/csv/sample'), {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to get CSV sample')
  }

  return response.text()
}
