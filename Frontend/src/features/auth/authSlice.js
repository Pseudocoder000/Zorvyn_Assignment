import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginRequest, signupRequest, getCurrentUser, updateProfile } from '../../utils/api'

const savedRole = localStorage.getItem('Gullak_role')
const savedUser = JSON.parse(localStorage.getItem('Gullak_user') || 'null')
const savedToken = localStorage.getItem('Gullak_token')

// Async Thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await signupRequest(name, email, password)
      const { token, user } = response
      
      // Save to localStorage
      localStorage.setItem('Gullak_token', token)
      localStorage.setItem('Gullak_user', JSON.stringify(user))
      
      return { token, user }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginRequest(email, password)
      const { token, user } = response
      
      // Save to localStorage
      localStorage.setItem('Gullak_token', token)
      localStorage.setItem('Gullak_user', JSON.stringify(user))
      
      return { token, user }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser()
      return response.user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateProfileThunk = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateProfile(profileData)
      // Update localStorage with new user data
      localStorage.setItem('Gullak_user', JSON.stringify(response.user))
      return response.user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: savedRole || 'user',
    user: savedUser || null,
    token: savedToken || null,
    loading: false,
    error: null,
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload
      localStorage.setItem('Gullak_role', action.payload)
    },
    setUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem('Gullak_user', JSON.stringify(action.payload))
    },
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('Gullak_token', action.payload)
    },
    logout: (state) => {
      state.role = 'user'
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('Gullak_role')
      localStorage.removeItem('Gullak_user')
      localStorage.removeItem('Gullak_token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Signup
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
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Login
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
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch User
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Update Profile
    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setRole, setUser, setToken, logout, clearError } = authSlice.actions
export default authSlice.reducer