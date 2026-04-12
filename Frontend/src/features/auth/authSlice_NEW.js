import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authAPI from '../../api/authAPI'

const savedRole = localStorage.getItem('Gullak_role')
const savedUser = JSON.parse(localStorage.getItem('Gullak_user') || 'null')
const savedToken = localStorage.getItem('Gullak_token')

/**
 * ============================================
 * ASYNC THUNKS
 * ============================================
 */

/**
 * Signup thunk - Create new user account
 * Saves token and user to localStorage and Redux state
 */
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(name, email, password)
      const { token, user } = response.data

      // Save to localStorage
      localStorage.setItem('Gullak_token', token)
      localStorage.setItem('Gullak_user', JSON.stringify(user))
      localStorage.setItem('Gullak_role', 'user')

      return { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Signup failed'
      )
    }
  }
)

/**
 * Login thunk - Authenticate user
 * Saves token and user to localStorage and Redux state
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password)
      const { token, user } = response.data

      // Save to localStorage
      localStorage.setItem('Gullak_token', token)
      localStorage.setItem('Gullak_user', JSON.stringify(user))
      localStorage.setItem('Gullak_role', 'user')

      return { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
      )
    }
  }
)

/**
 * Fetch current user thunk - Get latest user profile
 * Used after login/signup to ensure user data is fresh
 * Also called on app initialization to restore session
 */
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe()
      const user = response.data.user
      // Update localStorage with fresh user data
      localStorage.setItem('Gullak_user', JSON.stringify(user))
      return user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch user'
      )
    }
  }
)

/**
 * Update profile thunk - Update user profile including bank details
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      const user = response.data.user
      // Update localStorage with new user data
      localStorage.setItem('Gullak_user', JSON.stringify(user))
      return user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update profile'
      )
    }
  }
)

/**
 * ============================================
 * SLICE
 * ============================================
 */

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // Core auth state
    user: savedUser || null,
    token: savedToken || null,
    role: savedRole || 'user',

    // Loading & error states
    loading: false,
    error: null,

    // Sub-states for different operations
    isAuthenticated: !!savedToken,
    isFetchingUser: false,
  },

  // Synchronous actions
  reducers: {
    /**
     * Manually set user (if needed)
     */
    setUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem('Gullak_user', JSON.stringify(action.payload))
    },

    /**
     * Manually set token
     */
    setToken: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = !!action.payload
      if (action.payload) {
        localStorage.setItem('Gullak_token', action.payload)
      } else {
        localStorage.removeItem('Gullak_token')
      }
    },

    /**
     * Manually set role
     */
    setRole: (state, action) => {
      state.role = action.payload
      localStorage.setItem('Gullak_role', action.payload)
    },

    /**
     * Clear error state
     */
    clearError: (state) => {
      state.error = null
    },

    /**
     * Logout - Clear all auth state
     */
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = 'user'
      state.isAuthenticated = false
      state.error = null
      state.isFetchingUser = false

      // Clear localStorage
      localStorage.removeItem('Gullak_token')
      localStorage.removeItem('Gullak_user')
      localStorage.removeItem('Gullak_role')
    },
  },

  // Async thunk handlers
  extraReducers: (builder) => {
    // ─── SIGNUP ───────────────────────
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.role = 'user'
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })

    // ─── LOGIN ────────────────────────
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.role = 'user'
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })

    // ─── FETCH USER ───────────────────
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isFetchingUser = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isFetchingUser = false
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isFetchingUser = false
        state.error = action.payload
      })

    // ─── UPDATE PROFILE ───────────────
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setUser, setToken, setRole, clearError, logout } = authSlice.actions
export default authSlice.reducer
