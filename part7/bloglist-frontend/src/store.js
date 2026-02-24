import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import notificationReducer from './reducers/notificationReducer'
import visibleReducer from './reducers/visibleReducer'
import usersReducer from './reducers/usersReducer'

const state = configureStore({
  reducer: {
    blogs: blogReducer,
    user: userReducer,
    notification: notificationReducer,
    visible: visibleReducer,
    users: usersReducer,
  },
})

export default state