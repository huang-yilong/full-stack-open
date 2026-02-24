import { useDispatch } from 'react-redux'
import loginService from '../services/login'
import { showNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'

const LoginForm = () => {
  const dispatch = useDispatch()
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username: event.target.username.value, password: event.target.password.value })
      event.target.username.value = ''
      event.target.password.value = ''
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      dispatch(setUser(user))
    } catch {
      dispatch(showNotification('wrong username or password', 'error'))
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>
              username
            <input name="username" />
          </label>
        </div>
        <div>
          <label>
              password
            <input name="password" />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
