import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleLike = () => {
    // Logic to handle liking the blog post
    console.log(
      `Liked blog: ${blog.title} by ${blog.author} by ${blog.user.id}`,
    )
    updateBlog(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user.id,
      likes: blog.likes + 1,
    })
  }

  return (
    <div style={blogStyle}>
      <div>
        <span className='blog-title'>{blog.title}</span> by <span className='blog-author'>{blog.author}</span>
        <button onClick={() => setVisible(!visible)} className='toggle-visibility'>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog?.user?.name}</div>
        <div>
          <button
            onClick={() => {
              if (
                window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
              ) {
                removeBlog(blog.id)
              }
            }}
            style={{
              display: !user || !blog.user || blog.user.id !== user.id ? 'none' : '',
              background:
                'linear-gradient(to bottom, #6baaff 0%, #0066cc 100%)',
              color: 'black',
              border: '1px solid #0059b3',
              borderRadius: '2px',
            }}
          >
            remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default Blog
