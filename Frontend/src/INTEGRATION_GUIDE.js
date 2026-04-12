/**
 * ════════════════════════════════════════════════════════════════
 * GULLAK FULL-STACK INTEGRATION GUIDE
 * ════════════════════════════════════════════════════════════════
 * 
 * This file provides complete examples for implementing the
 * full-stack integration with real backend data.
 * 
 * Table of Contents:
 * 1. App.jsx - Initialize Redux and Session
 * 2. Login/Signup Pages - Authentication Flow
 * 3. Dashboard - Display Real Balance and Data
 * 4. Transactions - Fetch and Manage Real Transactions
 * 5. Profile - User Profile with Bank Details
 * 
 */

// ════════════════════════════════════════════════════════════════
// 1. APP.JSX - ROOT COMPONENT WITH REDUX & SESSION SETUP
// ════════════════════════════════════════════════════════════════

/**
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import Router from './Router'
import store from './app/store'
import useSessionInit from './hooks/useSessionInit'

function AppContent() {
  // Initialize session - restores user from localStorage and syncs with backend
  useSessionInit()

  return (
    <>
      <Router />
      <Toaster position="top-right" />
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
*/

// ════════════════════════════════════════════════════════════════
// 2. LOGIN PAGE - AUTHENTICATION WITH REDUX
// ════════════════════════════════════════════════════════════════

/**
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Login and auto-fetch user profile
      await login(formData.email, formData.password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  )
}
*/

// ════════════════════════════════════════════════════════════════
// 3. SIGNUP PAGE - CREATE ACCOUNT WITH AUTO-LOGIN
// ════════════════════════════════════════════════════════════════

/**
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      // Signup and auto-fetch user profile
      await signup(formData.name, formData.email, formData.password)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign up'}
      </button>
      {error && <p className="error">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  )
}
*/

// ════════════════════════════════════════════════════════════════
// 4. DASHBOARD - DISPLAY REAL BALANCE AND DATA
// ════════════════════════════════════════════════════════════════

/**
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useTransactions from '../hooks/useTransactions'
import useBalance from '../hooks/useBalance'
import { formatCurrency } from '../utils/formatters'
import { SkeletonCard } from '../components/ui/SkeletonCard'

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user)
  const {
    fetchAllDashboardData,
    fetchTransactions,
    dashboard,
    loading: dashboardLoading,
    error,
  } = useTransactions()

  // Get calculated balance (includes initialBalance)
  const {
    totalBalance,
    totalIncome,
    totalExpense,
    thisMonthIncome,
    thisMonthExpense,
    recentTransactions,
  } = useBalance()

  // Load all dashboard data on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchAllDashboardData(6)
      await fetchTransactions({ limit: 10 })
    }
    loadData()
  }, [])

  if (dashboardLoading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      {error && <div className="error-banner">{error}</div>}

      {/* Balance Card */}
      <div className="balance-card">
        <h2>Total Balance</h2>
        <p className="amount">{formatCurrency(totalBalance)}</p>
        <small>
          Initial Balance: {formatCurrency(user?.initialBalance || 0)}
          <br />
          From Transactions: {formatCurrency(totalIncome - totalExpense)}
        </small>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Income</h3>
          <p className="income">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expense</h3>
          <p className="expense">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="stat-card">
          <h3>This Month Income</h3>
          <p>{formatCurrency(thisMonthIncome)}</p>
        </div>
        <div className="stat-card">
          <h3>This Month Expense</h3>
          <p>{formatCurrency(thisMonthExpense)}</p>
        </div>
      </div>

      {/* Bank Info (from user profile) */}
      {user?.bankName && (
        <div className="bank-info">
          <h3>Bank Details</h3>
          <p>
            <strong>Bank:</strong> {user.bankName}
          </p>
          <p>
            <strong>Account:</strong> ****{user.accountNumber?.slice(-4)}
          </p>
          {user.ifscCode && (
            <p>
              <strong>IFSC:</strong> {user.ifscCode}
            </p>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        {recentTransactions?.length > 0 ? (
          <ul>
            {recentTransactions.map((txn) => (
              <li key={txn._id}>
                <span>{txn.name}</span>
                <span
                  className={txn.type === 'income' ? 'income' : 'expense'}
                >
                  {txn.type === 'income' ? '+' : '-'}
                  {formatCurrency(txn.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions yet</p>
        )}
      </div>
    </div>
  )
}
*/

// ════════════════════════════════════════════════════════════════
// 5. TRANSACTIONS PAGE - LIST AND MANAGE TRANSACTIONS
// ════════════════════════════════════════════════════════════════

/**
import { useEffect, useState } from 'react'
import useTransactions from '../hooks/useTransactions'
import { formatCurrency, formatDate } from '../utils/formatters'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import { Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TransactionsPage() {
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    deleteTransaction,
    createTransaction,
  } = useTransactions()

  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)

  // Load transactions on mount and when page changes
  useEffect(() => {
    fetchTransactions({ page, limit: 20 })
  }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    try {
      await deleteTransaction(id)
      toast.success('Transaction deleted')
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  const handleCreate = async (txnData) => {
    try {
      await createTransaction(txnData)
      toast.success('Transaction created')
      setShowModal(false)
      // Refresh list
      fetchTransactions({ page: 1, limit: 20 })
    } catch (err) {
      toast.error(err.message || 'Failed to create')
    }
  }

  if (loading) return <div>Loading transactions...</div>

  return (
    <div className="transactions-page">
      {error && <div className="error-banner">{error}</div>}

      <div className="header">
        <h1>Transactions</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      {/* Modal for adding transaction */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* Transactions Table */}
      {transactions.length > 0 ? (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id}>
                <td>{txn.name}</td>
                <td>{txn.category}</td>
                <td>
                  <span
                    className={`badge badge-${txn.type}`}
                  >
                    {txn.type}
                  </span>
                </td>
                <td className={txn.type === 'income' ? 'income' : 'expense'}>
                  {txn.type === 'income' ? '+' : '-'}
                  {formatCurrency(txn.amount)}
                </td>
                <td>{formatDate(txn.date)}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(txn._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>No transactions yet. Start by adding your first transaction!</p>
        </div>
      )}
    </div>
  )
}
*/

// ════════════════════════════════════════════════════════════════
// 6. PROFILE PAGE - UPDATE USER & BANK DETAILS
// ════════════════════════════════════════════════════════════════

/**
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    initialBalance: 0,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        bankName: user.bankName || '',
        accountNumber: user.accountNumber || '',
        ifscCode: user.ifscCode || '',
        initialBalance: user.initialBalance || 0,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'initialBalance' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      {/* Personal Info */}
      <fieldset>
        <legend>Personal Information</legend>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
        />
      </fieldset>

      {/* Initial Balance */}
      <fieldset>
        <legend>Account</legend>
        <input
          type="number"
          name="initialBalance"
          value={formData.initialBalance}
          onChange={handleChange}
          placeholder="Initial Balance"
          step="0.01"
        />
        <small>
          This is your starting balance. Transactions are added/subtracted from this.
        </small>
      </fieldset>

      {/* Bank Details */}
      <fieldset>
        <legend>Bank Details (Optional)</legend>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Bank Name"
        />
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Account Number"
        />
        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          placeholder="IFSC Code"
        />
        <small>
          Bank details are private and used only for your reference.
        </small>
      </fieldset>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
*/

// ════════════════════════════════════════════════════════════════
// IMPORTANT SETUP STEPS
// ════════════════════════════════════════════════════════════════

/**
STEP 1: Update your Redux store to use the new slices
File: src/app/store.js

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice_NEW'
import transactionsReducer from '../features/transactions/transactionsSlice_NEW'
import themeReducer from '../features/theme/themeSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    theme: themeReducer,
  },
})

STEP 2: Install axios if not already installed
npm install axios

STEP 3: Update your environment variables
VITE_API_BASE_URL=http://localhost:5000/api

STEP 4: Update your main Router to use Dashboard
File: src/Router.jsx (or location of your routes)
- Import Dashboard and other pages
- Set up protected routes that check Redux auth state

STEP 5: Replace old authSlice with new one in store.js
- Delete references to old features/auth/authSlice.js
- Use feature/auth/authSlice_NEW.js instead

STEP 6: Replace old transactionsSlice with new one
- Delete references to old features/transactions/transactionsSlice.js
- Use features/transactions/transactionsSlice_NEW.js instead
*/

// ════════════════════════════════════════════════════════════════
// KEY FEATURES
// ════════════════════════════════════════════════════════════════

/**
✅ AUTHENTICATION
- Login/Signup with automatic user fetch
- Session restoration on app load
- Token auto-injection in all requests
- Error handling for 401 responses

✅ BALANCE CALCULATION
- Initial balance from user profile
- Transaction-based calculations
- Combined balance = initialBalance + (income - expense)
- useBalance() hook provides all metrics

✅ TRANSACTIONS
- Full CRUD operations
- Pagination support
- Real-time dashboard update after changes
- Filter support (type, category, date)

✅ DASHBOARD
- Real balance display
- Income and expense tracking
- Monthly trend analysis
- Spending by category
- Budget tracking
- Recent transactions list

✅ BANK DETAILS INTEGRATION
- Stored in user profile
- Display on dashboard
- Masked account number for security
- IFSC code support

✅ ERROR HANDLING
- Redux error states
- Toast notifications
- Graceful fallbacks
- Token expiration handling

✅ LOADING STATES
- Multiple load indicators
- Skeleton loaders
- Disabled buttons during operations
- User feedback during async operations

✅ PRODUCTION READY
- Modular API services
- Reusable hooks
- Proper error handling
- Environment variable support
- TypeScript-ready structure (optional)
*/
