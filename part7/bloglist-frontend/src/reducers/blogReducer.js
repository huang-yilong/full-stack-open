import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    },
    deleteBlog(state, action) {
      const idToDelete = action.payload
      return state.filter((blog) => blog.id !== idToDelete)
    },
  },
})

const { setBlogs, appendBlog, updateBlog, deleteBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const createdBlog = await blogService.create(blogObject)
    dispatch(appendBlog(createdBlog))
  }
}

export const likeBlog = (id, updatedBlog) => {
  return async (dispatch) => {
    const updated = await blogService.update(id, updatedBlog)
    dispatch(updateBlog(updated))
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
  }
}

export const addComment = (id, content) => {
  return async (dispatch) => {
    const updated = await blogService.addComment(id, content)
    dispatch(updateBlog(updated))
  }
}

export default blogSlice.reducer