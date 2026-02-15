const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  )

  return favorite
}

const mostBlogs = (blogs) => {
  const authorBlogCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const mostBlogsAuthor = Object.entries(authorBlogCount).reduce(
    (prev, current) => (current[1] > prev[1] ? current : prev),
    ["", 0]
  )

  return {
    author: mostBlogsAuthor[0],
    blogs: mostBlogsAuthor[1],
  }
}

const mostLikes = (blogs) => {
  const authorLikesCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const mostLikesAuthor = Object.entries(authorLikesCount).reduce(
    (prev, current) => (current[1] > prev[1] ? current : prev),
    ["", 0]
  )

  return {
    author: mostLikesAuthor[0],
    likes: mostLikesAuthor[1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}