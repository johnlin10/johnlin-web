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
      const { uid, email, displayName, photoURL } = action.payload
      state.currentUser = {
        uid,
        email,
        displayName,
        photoURL,
      }
      // 這裡可以根據需要添加其他邏輯來判斷是否為管理員
      state.isAdmin = uid === process.env.REACT_APP_ADMIN_UID || false
    },
    clearUser: (state) => {
      state.currentUser = null
      state.isAdmin = false
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
