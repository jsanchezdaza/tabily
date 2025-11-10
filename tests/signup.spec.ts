import { test, expect } from '@playwright/test'

test.describe('Sign Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should navigate to signup page from login', async ({ page }) => {
    await page.click('text=Sign Up')

    await expect(page).toHaveURL(/.*signup/)
    await expect(page.locator('h1')).toContainText('Create Account')
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('http://localhost:5173/signup')

    await page.click('button[type="submit"]')

    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('http://localhost:5173/signup')

    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')

    await page.click('button[type="submit"]')

    await expect(page.locator('text=Invalid email address')).toBeVisible()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    await page.goto('http://localhost:5173/signup')

    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'different123')

    await page.click('button[type="submit"]')

    await expect(page.locator('text=Passwords do not match')).toBeVisible()
  })

  test('should show error for weak password', async ({ page }) => {
    await page.goto('http://localhost:5173/signup')

    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="password"]', '123')
    await page.fill('input[name="confirmPassword"]', '123')

    await page.click('button[type="submit"]')

    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible()
  })

  test('should successfully sign up and show verification message', async ({ page }) => {
    await page.route('**/auth/v1/signup**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '123',
            email: 'test@example.com',
            confirmed_at: null,
          },
          session: null,
        }),
      })
    })

    await page.goto('http://localhost:5173/signup')

    const timestamp = Date.now()
    const email = `test${timestamp}@example.com`

    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', 'testpassword123')
    await page.fill('input[name="confirmPassword"]', 'testpassword123')

    await page.click('button[type="submit"]')

    await expect(page.locator('text=Check your email')).toBeVisible()
    await expect(page.locator('text=verification link')).toBeVisible()
  })

  test('should have a link back to login page', async ({ page }) => {
    await page.goto('http://localhost:5173/signup')

    await expect(page.locator('text=Already have an account?')).toBeVisible()
    await expect(page.locator('text=Sign In')).toBeVisible()

    await page.click('text=Sign In')

    await expect(page).toHaveURL(/.*\/$|.*login/)
  })

  test('should disable submit button while loading', async ({ page }) => {
    await page.goto('http://localhost:5173/signup')

    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'password123')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    await expect(submitButton).toBeDisabled()
  })
})
