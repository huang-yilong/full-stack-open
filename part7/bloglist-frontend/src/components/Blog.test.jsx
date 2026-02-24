import { describe, test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog component', () => {
  test('renders content', () => {
    const blog = {
      'title': 'test-like',
      'author': '123',
      'url': '123',
      'likes': 2,
      'user': {
        'username': 'root',
        'name': 'Superuser',
        'id': '699079cc0617082c71907bf4'
      },
      'id': '69954bc474c09709bc149615'
    }

    const { container } = render(<Blog blog={blog} />)

    let div = container.querySelector('.blog-title')
    expect(div).toHaveTextContent('test-like')
    div = container.querySelector('.blog-author')
    expect(div).toHaveTextContent('123')
    div = container.querySelector('.blog-url')
    expect(div).not.toBeVisible()
    div = container.querySelector('.blog-likes')
    expect(div).not.toBeVisible()
  })

  test('renders url and likes when view button is clicked', async () => {
    const blog = {
      'title': 'test-like',
      'author': '123',
      'url': '123',
      'likes': 2,
      'user': {
        'username': 'root',
        'name': 'Superuser',
        'id': '699079cc0617082c71907bf4'
      },
      'id': '69954bc474c09709bc149615'
    }

    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = container.querySelector('.toggle-visibility')
    await user.click(button)
    const div = container.querySelector('.blog-url')
    expect(div).toBeVisible()
    const div2 = container.querySelector('.blog-likes')
    expect(div2).toBeVisible()
  })

  test('clicking like button twice calls event handler twice', async () => {
    const blog = {
      'title': 'test-like',
      'author': '123',
      'url': '123',
      'likes': 2,
      'user': {
        'username': 'root',
        'name': 'Superuser',
        'id': '699079cc0617082c71907bf4'
      },
      'id': '69954bc474c09709bc149615'
    }
    const mockHandler = vi.fn()
    const { container } = render(<Blog blog={blog} updateBlog={mockHandler} />)

    const user = userEvent.setup()
    const viewButton = container.querySelector('.toggle-visibility')
    await user.click(viewButton)

    const likeButton = container.querySelector('.blog-likes button')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})