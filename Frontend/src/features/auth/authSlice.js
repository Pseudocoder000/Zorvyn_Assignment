import { createSlice } from '@reduxjs/toolkit'

const savedRole = localStorage.getItem('Gullak_role')
const savedUser = JSON.parse(localStorage.getItem('Gullak_user') || 'null')
const savedToken = localStorage.getItem('Gullak_token')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    role: savedRole || 'admin',
    user: savedUser || { name: 'Jaya Ganguly', email: 'gangulyjaya@gmail.com', avatar: 'JG' },
    token: savedToken || null,
  },
  reducers: {
    setRole: (state, action) => { state.role = action.payload },
    setUser: (state, action) => { state.user = action.payload },
    setToken: (state, action) => { state.token = action.payload },
    logout: (state) => {
      state.role = 'viewer'
      state.user = null
      state.token = null
    },
  },
})
export const { setRole, setUser, setToken, logout } = authSlice.actions
export default authSlice.reducer