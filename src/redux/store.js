import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import viewerReducer from './viewerSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    viewer: viewerReducer,
  },
})

export default store
