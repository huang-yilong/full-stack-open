import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { toggleVisible } from '../reducers/visibleReducer'

const BlogForm = () => {
  const dispatch = useDispatch()

  const handleCreateBlog = (event) => {
    event.preventDefault()
    dispatch(createBlog({
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
    }))
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    dispatch(toggleVisible())
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>
            title
            <input name='title' />
          </label>
        </div>
        <div>
          <label>
            author
            <input name='author' />
          </label>
        </div>
        <div>
          <label>
            url
            <input name='url' />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm
