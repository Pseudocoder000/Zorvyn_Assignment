import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../features/auth/authSlice_NEW'

/**
 * Custom hook for session initialization
 * Call this once in your main App component to:
 * 1. Restore user session from localStorage
 * 2. Fetch fresh user data from backend on app load
 * 
 * Usage:
 *   useSessionInit()
 *   
 * This ensures user profile including bank details is always in sync with backend
 */
export const useSessionInit = () => {
  const dispatch = useDispatch()
  const { token, isFetchingUser } = useSelector((s) => s.auth)

  useEffect(() => {
    // Only fetch user if we have a token and user isn't already being fetched
    if (token && !isFetchingUser) {
      dispatch(fetchUser()).catch((err) => {
        console.error('Failed to restore session:', err)
      })
    }
  }, [token, dispatch, isFetchingUser])
}

export default useSessionInit
