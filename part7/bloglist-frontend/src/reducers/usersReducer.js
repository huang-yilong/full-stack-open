import { createSlice } from '@reduxjs/toolkit'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

const { setUsers } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const response = await fetch('/api/users')
    const users = await response.json()
    dispatch(setUsers(users))
  }
}

export default usersSlice.reducer