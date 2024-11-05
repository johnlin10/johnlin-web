import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  isAdmin: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
      state.isAdmin = action.payload?.uid === process.env.REACT_APP_ADMIN_UID
    },
    clearUser: (state) => {
      state.currentUser = null
      state.isAdmin = false
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
