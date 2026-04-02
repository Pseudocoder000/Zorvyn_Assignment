import { createSlice } from '@reduxjs/toolkit'
const saved = localStorage.getItem('finova_role')
const authSlice = createSlice({
  name: 'auth',
  initialState: { role: saved || 'admin' },
  reducers: { setRole: (state, action) => { state.role = action.payload } },
})
export const { setRole } = authSlice.actions
export default authSlice.reducer