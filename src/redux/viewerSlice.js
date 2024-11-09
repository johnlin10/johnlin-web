import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isViewerOpen: false,
  currentImage: {
    src: '',
    fileName: '',
  },
}

const viewerSlice = createSlice({
  name: 'viewer',
  initialState,
  reducers: {
    openViewer: (state, action) => {
      state.isViewerOpen = true
      state.currentImage = action.payload
    },
    closeViewer: (state) => {
      state.isViewerOpen = false
      state.currentImage = initialState.currentImage
    },
  },
})

export const { openViewer, closeViewer } = viewerSlice.actions
export default viewerSlice.reducer
