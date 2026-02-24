const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }).populate('comments', { content: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  console.log(user)

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({ title: body.title, author: body.author, url: body.url, likes: body.likes || 0, user: user._id })

  let savedBlog = await blog.save()
  savedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user.id) {
    return response.status(403).json({ error: 'forbidden' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {  returnDocument: 'after', runValidators: true, context: 'query' }).populate('user', { username: 1, name: 1 })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const content = request.body.content
  if (!content) {
    return response.status(400).json({ error: 'comment is required' })
  }

  let blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const comment = new Comment({ content, blog: blog._id })
  const savedComment = await comment.save()

  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()
  blog = await blog.populate('comments', { content: 1 })
  response.json(blog)
})

module.exports = blogsRouter