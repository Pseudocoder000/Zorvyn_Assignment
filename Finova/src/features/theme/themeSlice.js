import { createSlice } from '@reduxjs/toolkit'

function getInitial() {
  const saved = localStorage.getItem('finova_theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: getInitial() },
  reducers: { toggleTheme: (state) => { state.mode = state.mode === 'dark' ? 'light' : 'dark' } },
})
export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer