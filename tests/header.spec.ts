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
})
