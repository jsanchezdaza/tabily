import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('displays login page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/tabily/)
    await expect(page.getByRole('heading', { name: /welcome to tabily/i })).toBeVisible()
  })

  test('displays email and password input fields', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
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
    await page.locator('input#password').fill('123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/password must be at least 12 characters/i)).toBeVisible()
  })

  test('displays sign up link', async ({ page }) => {
    await expect(page.getByText(/don't have an account/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
  })

  test('displays password visibility toggle button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /show password/i })).toBeVisible()
  })

  test('toggles password visibility when clicking toggle button', async ({ page }) => {
    const passwordInput = page.locator('input#password')
    const toggleButton = page.getByRole('button', { name: /show password/i })

    await expect(passwordInput).toHaveAttribute('type', 'password')

    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    await expect(page.getByRole('button', { name: /hide password/i })).toBeVisible()

    const hideButton = page.getByRole('button', { name: /hide password/i })
    await hideButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
    await expect(page.getByRole('button', { name: /show password/i })).toBeVisible()
  })
})
