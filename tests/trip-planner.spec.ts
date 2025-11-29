import { test, expect } from '@playwright/test'

test.describe('Trip Planner', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/plan-trip')

    await expect(page).toHaveURL(/.*login/)
  })

  test('Get Started button navigates to login for unauthenticated users', async ({ page }) => {
    await page.goto('/')

    const getStartedButton = page.getByRole('link', { name: /get started/i })
    await getStartedButton.click()

    await expect(page).toHaveURL(/.*login/)
  })
})
