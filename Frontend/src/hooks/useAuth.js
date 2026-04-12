import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, signup, fetchUser, logout, updateProfile } from '../features/auth/authSlice_NEW'

/**
 * Custom hook for authentication operations
 * Provides login, signup, logout, and profile update methods
 * Usage:
 *   const { login, signup, logout, user, loading, error } = useAuth()
 */
export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, loading, error } = useSelector((s) => s.auth)

  const handleLogin = useCallback(
    async (email, password) => {
      try {
        const result = await dispatch(login({ email, password })).unwrap()
        // Fetch fresh user data after login
        await dispatch(fetchUser())
        return result
      } catch (err) {
        throw err
      }
    },
    [dispatch]
  )

  const handleSignup = useCallback(
    async (name, email, password) => {
      try {
        const result = await dispatch(signup({ name, email, password })).unwrap()
        // Fetch fresh user data after signup
        await dispatch(fetchUser())
        return result
      } catch (err) {
        throw err
      }
    },
    [dispatch]
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  const handleUpdateProfile = useCallback(
    async (profileData) => {
      try {
        const result = await dispatch(updateProfile(profileData)).unwrap()
        return result
      } catch (err) {
        throw err
      }
    },
    [dispatch]
  )

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,

    // Methods
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
  }
}

export default useAuth
