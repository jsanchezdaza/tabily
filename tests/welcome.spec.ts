import { test, expect } from '@playwright/test'

test.describe('Welcome Page', () => {
  test('displays welcome page with correct content', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/tabily/)
    await expect(page.getByRole('heading', { name: /welcome to tabily/i })).toBeVisible()
    await expect(page.getByText(/plan your perfect trip with the most advanced ai/i)).toBeVisible()
  })

  test('displays AI-Powered Travel badge', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText(/ai-powered travel/i)).toBeVisible()
  })

  test('displays world landmarks image', async ({ page }) => {
    await page.goto('/')

    const image = page.getByAltText(/world landmarks illustration/i)
    await expect(image).toBeVisible()
  })

  test('Get Started button redirects to login when not logged in', async ({ page }) => {
    await page.goto('/')

    const getStartedButton = page.getByRole('link', { name: /get started/i })
    await expect(getStartedButton).toBeVisible()

    await getStartedButton.click()

    await expect(page).toHaveURL(/.*login/)
    await expect(page.getByRole('heading', { name: /welcome to tabily/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('Get Started button has correct href for logged in users', async ({ page }) => {
    await page.goto('/')

    const getStartedButton = page.getByRole('link', { name: /get started/i })
    await expect(getStartedButton).toBeVisible()

    const href = await getStartedButton.getAttribute('href')
    expect(href === '/login' || href === '/home').toBeTruthy()
  })

  test('Get Started button has same styling as header Sign In button', async ({ page }) => {
    await page.goto('/')

    const getStartedButton = page.getByRole('link', { name: /get started/i })
    const headerSignInButton = page.locator('header').getByRole('link', { name: /sign in/i })

    const getStartedClasses = await getStartedButton.getAttribute('class')
    const headerClasses = await headerSignInButton.getAttribute('class')

    expect(getStartedClasses).toContain('border-emerald-300')
    expect(getStartedClasses).toContain('text-emerald-300')
    expect(getStartedClasses).toContain('rounded-full')

    expect(headerClasses).toContain('border-emerald-300')
    expect(headerClasses).toContain('text-emerald-300')
    expect(headerClasses).toContain('rounded-full')
  })
})
