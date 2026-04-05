import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from '../features/transactions/transactionsSlice'
import authReducer from '../features/auth/authSlice'
import themeReducer from '../features/theme/themeSlice'
import notificationReducer from '../features/notifications/notificationSlice'

// 🔥 load notifications
const loadNotifications = () => {
  try {
    const data = localStorage.getItem('Gullak_notifications')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 🔥 localStorage middleware
const localStorageMiddleware = store => next => action => {
  const result = next(action)
  const state = store.getState()

  localStorage.setItem('Gullak_transactions', JSON.stringify(state.transactions.items))
  localStorage.setItem('Gullak_role', state.auth.role)
  localStorage.setItem('Gullak_theme', state.theme.mode)

  // ✅ FIXED (safe access)
  localStorage.setItem(
    'Gullak_notifications',
    JSON.stringify(state.notifications?.items || [])
  )

  return result
}

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    auth: authReducer,
    theme: themeReducer,
    notifications: notificationReducer, // ✅ correct key
  },

  // ✅ FIXED (safe preload)
  preloadedState: {
    notifications: {
      items: loadNotifications() || []
    }
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})