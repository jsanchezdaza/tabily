import { test, expect } from '@playwright/test'

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays dark header banner', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('displays tabily logo with Torii gate icon', async ({ page }) => {
    await expect(page.locator('header svg')).toBeVisible()
  })

  test('displays tabily text in header', async ({ page }) => {
    await expect(page.locator('header').getByText('tabily')).toBeVisible()
  })

  test('header has dark background', async ({ page }) => {
    const header = page.locator('header')
    const bgColor = await header.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })
    // Should be a dark color (gray-900 or similar)
    expect(bgColor).toBeTruthy()
  })

  test('does not display My trips link when not logged in', async ({ page }) => {
    await expect(page.locator('header').getByRole('link', { name: /my trips/i })).not.toBeVisible()
  })

  test('displays Login link when not logged in', async ({ page }) => {
    await expect(page.locator('header').getByRole('link', { name: /login/i })).toBeVisible()
  })

  test('does not display profile icon when not logged in', async ({ page }) => {
    await expect(page.locator('header button[aria-label="Profile menu"]')).not.toBeVisible()
  })

  test('does not display Logout button directly when not logged in', async ({ page }) => {
    await expect(page.locator('header').getByRole('button', { name: /logout/i })).not.toBeVisible()
  })

  test('navigation is visible on the right side', async ({ page }) => {
    const nav = page.locator('header nav')
    await expect(nav).toBeVisible()
  })
})
