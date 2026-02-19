import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ToggleTable from './components/ToggleTable'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: '', type: '' })
  const blogFormRef = useRef()

  const checkUser = async () => {
    const user = await loginService.check()
    if (user) {
      blogService.setToken(user.token)
      setUser(user)
    } else {
      blogService.setToken(null)
      setUser(null)
      setInfo({
        message: 'session expired, please log in again',
        type: 'error',
      })
      setTimeout(() => {
        setInfo({ message: '', type: '' })
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(sortBlogs(blogs))
    })
  }, [])

  useEffect(() => {
    checkUser()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      checkUser()
      setUsername('')
      setPassword('')
    } catch {
      setInfo({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setInfo({ message: '', type: '' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    loginService.logout()
    setUser(null)
  }

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.create(blogObject)
      setBlogs(sortBlogs(blogs.concat(createdBlog)))
      setInfo({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'success',
      })
      setTimeout(() => {
        setInfo({ message: '', type: '' })
      }, 5000)
    } catch {
      setInfo({ message: 'failed to create blog', type: 'error' })
      setTimeout(() => {
        setInfo({ message: '', type: '' })
      }, 5000)
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const updated = await blogService.update(id, updatedBlog)
      setBlogs(
        sortBlogs(blogs.map((blog) => (blog.id === id ? updated : blog))),
      )
    } catch {
      setInfo({ message: 'failed to update blog', type: 'error' })
      setTimeout(() => {
        setInfo({ message: '', type: '' })
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(sortBlogs(blogs.filter((blog) => blog.id !== id)))
    } catch {
      setInfo({ message: 'failed to remove blog', type: 'error' })
      setTimeout(() => {
        setInfo({ message: '', type: '' })
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification info={info} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info} />
      <p>
        {user.name} logged in<button onClick={handleLogout}>logout</button>
      </p>

      <ToggleTable buttonlabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </ToggleTable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  )
}

export default App
