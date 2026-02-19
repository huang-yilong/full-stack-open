import axios from 'axios'

const baseUrl = '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const check = async () => {
  const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
  if (!loggedUserJSON) {
    return null
  }
  const user = JSON.parse(loggedUserJSON)
  const userInfo = await axios.get(baseUrl, {
    headers: { Authorization: `Bearer ${user.token}` },
  })
  if (userInfo) {

    userInfo.data.token = user.token
    return userInfo.data
  }
  return null
}

const logout = () => {
  localStorage.removeItem('loggedBlogAppUser')
}

export default { login, check, logout }
