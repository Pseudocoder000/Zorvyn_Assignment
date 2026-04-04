import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from '../features/transactions/transactionsSlice'
import authReducer from '../features/auth/authSlice'
import themeReducer from '../features/theme/themeSlice'

const localStorageMiddleware = store => next => action => {
  const result = next(action)
  const state = store.getState()
  localStorage.setItem('Gullak_transactions', JSON.stringify(state.transactions.items))
  localStorage.setItem('Gullak_role', state.auth.role)
  localStorage.setItem('Gullak_theme', state.theme.mode)
  return result
}

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    auth: authReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})