import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: []
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({
        id: Date.now(),
        message: action.payload,
        read: false
      })
    },

    markAsRead: (state, action) => {
      const notif = state.items.find(n => n.id === action.payload)
      if (notif) notif.read = true
    },

    markAllAsRead: (state) => {
      state.items.forEach(n => n.read = true)
    }
  }
})

export const { addNotification, markAsRead, markAllAsRead } = notificationSlice.actions
export default notificationSlice.reducer