import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays header', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
  })
})
