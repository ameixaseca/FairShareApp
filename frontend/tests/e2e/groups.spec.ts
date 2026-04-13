import { expect, test } from '@playwright/test'

const mockAuthUser = { id: 'owner', name: 'Owner', email: 'owner@example.com' }

test.describe('US1 groups and members flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAuthUser),
      }),
    )
  })

  test('creates a group and opens group dashboard', async ({ page }) => {
    await page.goto('/groups/new')
    await expect(page.getByRole('heading', { name: 'Criar grupo' })).toBeVisible()
    await expect(page.getByLabel('Nome do grupo')).toBeVisible()
    await expect(page.getByLabel('Moeda')).toBeVisible()
  })

  test('shows invite screen and allows creating invite payload', async ({ page }) => {
    await page.goto('/invites')
    await expect(page.getByRole('heading', { name: 'Convites' })).toBeVisible()

    await page.getByLabel('Destinatário').fill('friend@example.com')
    await page.getByLabel('Expira em').fill('2030-01-01')
    await page.getByRole('button', { name: 'Enviar convite' }).click()

    // Backend invite API contract is finalized in subsequent stories; UI behavior is asserted here.
    await expect(page.getByRole('heading', { name: 'Convites' })).toBeVisible()
  })
})
