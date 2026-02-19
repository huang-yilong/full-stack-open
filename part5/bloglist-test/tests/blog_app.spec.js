const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    // empty the db here
    // create a user for the backend here
    await page.request.post('/api/testing/reset')
    await page.request.post('/api/users', {
      data: {
        username: 'testuser',
        name: 'test user',
        password: 'password'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'password')
      await expect(page.getByText('test user logged in')).toBeVisible()
    })
    
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog', 'Test Author', 'https://test.blog')

      await expect(page.getByText('a new blog Test Blog by Test Author added')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Test Blog', 'Test Author', 'https://test.blog')

      // like the blog
      await page.getByText('view').click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({ page }) => {
      // create a blog first
      await createBlog(page, 'Test Blog', 'Test Author', 'https://test.blog')
      
      // delete the blog
      await page.getByText('view').click()
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Test Blog')).not.toBeVisible()
    })

    //Make a test that ensures that only the user who added the blog sees the blog's delete button.
    test('only the user who added the blog sees the delete button', async ({ page }) => {
      // create a blog first
      await createBlog(page, 'Test Blog', 'Test Author', 'https://test.blog')
      
      // log out and log in with another user
      await page.getByText('logout').click()
      await page.request.post('/api/users', {
        data: {
          username: 'otheruser',
          name: 'other user',
          password: 'password'
        }
      })
      await loginWith(page, 'otheruser', 'password')

      // check that the delete button is not visible
      await page.getByText('view').click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    //Do a test that ensures that the blogs are arranged in the order according to the likes, the blog with the most likes first.
    test.only('blogs are arranged in the order according to the likes', async ({ page }) => {
      // create two blogs
      await createBlog(page, 'First Blog', 'First Author', 'https://first.blog')
      await createBlog(page, 'Second Blog', 'Second Author', 'https://second.blog')

      // like the first blog
      await page.pause()
      await page.getByText('First Blog by First Authorview').getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      // go back to the main page
      await page.getByRole('button', { name: 'hide' }).click()

      // check that the blogs are ordered by likes
      const blogTitles = await page.$$eval('.blog-title', blogs => blogs.map(blog => blog.innerText))
      expect(blogTitles).toEqual(['First Blog', 'Second Blog'])
    })
  })
})