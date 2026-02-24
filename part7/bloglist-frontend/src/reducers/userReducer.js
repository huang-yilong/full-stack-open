import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const initializeUser = () => {
  return async (dispatch) => {
    const user = await loginService.check()
    if (user) {
      blogService.setToken(user.token)
      dispatch(setUser(user))
    } else {
      blogService.setToken(null)
      dispatch(clearUser())
      dispatch(showNotification('session expired, please log in again', 'error'))
    }
  }
}

export default userSlice.reducer