import { createSlice } from '@reduxjs/toolkit'

const visibleSlice = createSlice({
  name: 'visible',
  initialState: false,
  reducers: {
    toggleVisible(state) {
      return !state
    },
    setVisible(state, action) {
      return action.payload
    },
  },
})

export const { toggleVisible, setVisible } = visibleSlice.actions

export default visibleSlice.reducer