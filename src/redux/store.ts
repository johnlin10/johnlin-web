import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import viewerReducer from './viewerSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    viewer: viewerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
