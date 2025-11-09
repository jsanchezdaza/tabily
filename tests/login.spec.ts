import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays login page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/tabily/)
    await expect(page.getByRole('heading', { name: /welcome to tabily/i })).toBeVisible()
  })

  test('displays email and password input fields', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('displays sign in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('displays Google sign in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
  })

  test('shows error message when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/email is required/i)).toBeVisible()
  })

  test('shows error message when password is too short', async ({ page }) => {
    await page.getByLabel(/email/i).fill('user@example.com')
    await page.getByLabel(/password/i).fill('123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible()
  })

  test('displays sign up link', async ({ page }) => {
    await expect(page.getByText(/don't have an account/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
  })
})
