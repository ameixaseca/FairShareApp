import { expect, test } from '@playwright/test'

const mockAuthUser = { id: 'owner', name: 'Owner', email: 'owner@example.com' }

test.describe('US2 expenses flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAuthUser),
      }),
    )
  })

  test('displays create expense form fields', async ({ page }) => {
    await page.goto('/expenses/new')
    await expect(page.getByLabel('Valor')).toBeVisible()
    await expect(page.getByLabel('Descrição')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Registrar despesa' })).toBeVisible()
  })

  test('validates positive amount before enabling submit', async ({ page }) => {
    await page.goto('/expenses/new')

    const submit = page.getByRole('button', { name: 'Registrar despesa' })
    await expect(submit).toBeDisabled()

    await page.getByLabel('Valor').fill('0')
    await page.getByLabel('Descrição').fill('Jantar')
    await expect(submit).toBeDisabled()

    await page.getByLabel('Valor').fill('45.50')
    await expect(submit).toBeEnabled()
  })
})
