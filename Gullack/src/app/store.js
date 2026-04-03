import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from '../features/transactions/transactionsSlice'
import authReducer from '../features/auth/authSlice'
import themeReducer from '../features/theme/themeSlice'

const localStorageMiddleware = store => next => action => {
  const result = next(action)
  const state = store.getState()
  localStorage.setItem('finova_transactions', JSON.stringify(state.transactions.items))
  localStorage.setItem('finova_role', state.auth.role)
  localStorage.setItem('finova_theme', state.theme.mode)
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