import { useEffect } from 'react'
import Notification from './components/Notification'
import ToggleTable from './components/ToggleTable'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, addComment } from './reducers/blogReducer'
import BlogList from './components/BlogList'
import { clearUser } from './reducers/userReducer'
import LoginForm from './components/LoginForm'
import { initializeUsers } from './reducers/usersReducer'
import { Routes, Route, useMatch, NavLink, Link } from 'react-router'
import { initializeUser } from './reducers/userReducer'

const Users = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const User = ({ matchedUser }) => {
  if (!matchedUser) {
    return null
  }

  return (
    <div>
      <h2>{matchedUser.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {matchedUser.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

const Blog = ({ matchedBlog }) => {
  const dispatch = useDispatch()

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    const content = event.target.comment.value
    event.target.comment.value = ''
    dispatch(addComment(matchedBlog.id, content))
  }

  if (!matchedBlog) {
    return null
  }

  return (
    <div>
      <h2>{matchedBlog.title} {matchedBlog.author}</h2>
      <p><a href={matchedBlog.url}>{matchedBlog.url}</a></p>
      <p>{matchedBlog.likes} likes</p>
      <p>added by {matchedBlog.user.name}</p>
      <h3>comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input name='comment' />
        <button type='submit'>add comment</button>
      </form>
      <ul>
        {matchedBlog.comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)
  const users = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  const userMatch = useMatch('/users/:id')
  const matchedUser = userMatch ? users.find((u) => u.id === userMatch.params.id) : null

  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch ? blogs.find((b) => b.id === blogMatch.params.id) : null

  const handleLogout = () => {
    loginService.logout()
    dispatch(clearUser())
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <nav >
        <Link to="/">blogs</Link>
        <Link to="/users">users</Link>
        <span>{user.name} logged in</span>
        <button onClick={handleLogout}>logout</button>
      </nav>
      <Notification />
      <h2>blog app</h2>
      <Routes>
        <Route path="/" element={
          <div>
            <ToggleTable buttonlabel="create new blog">
              <BlogForm  />
            </ToggleTable>
            <BlogList />
          </div>
        } />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User matchedUser={matchedUser}/>} />
        <Route path="/blogs/:id" element={<Blog matchedBlog={matchedBlog}/>} />
      </Routes>
    </div>
  )
}

export default App
