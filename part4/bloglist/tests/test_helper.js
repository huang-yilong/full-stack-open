const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'https://example.com/html-is-easy',
    likes: 5
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Jane Doe',
    url: 'https://example.com/browser-can-execute-only-javascript',
    likes: 10
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'John Doe', url: 'https://example.com/willremovethissoon'})
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const loginUser = {
  username: 'root',
  password: 'root'
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}