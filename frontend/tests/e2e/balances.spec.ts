import { expect, test } from '@playwright/test'

const mockAuthUser = { id: 'owner', name: 'Owner', email: 'owner@example.com' }

test.describe('US3 balances and history', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAuthUser),
      }),
    )
  })

  test('shows balances page structure', async ({ page }) => {
    await page.goto('/balances')
    await expect(page.getByText('Painel do grupo')).toBeVisible()
  })

  test('shows history page structure', async ({ page }) => {
    await page.goto('/history')
    await expect(page.getByRole('heading', { name: 'Histórico' })).toBeVisible()
  })
})
