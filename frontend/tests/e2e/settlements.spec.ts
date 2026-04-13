import { expect, test } from '@playwright/test'

const mockAuthUser = { id: 'owner', name: 'Owner', email: 'owner@example.com' }

async function mockAuth(page: import('@playwright/test').Page) {
  await page.route('**/auth/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAuthUser),
    }),
  )
}

test.describe('US4 settlements and notifications', () => {
  test('shows settlement form with prefilled users from query params', async ({ page }) => {
    await mockAuth(page)
    await page.goto('/settlements/new?groupId=default-group&from=member-1&to=owner&pending=45')

    await expect(page.getByRole('heading', { name: 'Registrar quitação' })).toBeVisible()
    await expect(page.getByLabel('Devedor')).toHaveValue('member-1')
    await expect(page.getByLabel('Credor')).toHaveValue('owner')
  })

  test('shows validation message when amount exceeds pending', async ({ page }) => {
    await mockAuth(page)
    await page.goto('/settlements/new?groupId=default-group&from=member-1&to=owner&pending=30')

    await page.getByLabel('Valor').fill('40')
    await page.getByRole('button', { name: 'Registrar quitação' }).click()
    await expect(page.getByText('amount exceeds pending 30.00')).toBeVisible()
  })

  test('shows notification preferences channels', async ({ page }) => {
    await page.route('**/users/notification-preferences', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ emailEnabled: true, smsEnabled: false, inAppEnabled: true }),
      }),
    )
    await mockAuth(page)
    await page.goto('/preferences')
    await expect(page.getByRole('heading', { name: 'Preferências de notificação' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('SMS')).toBeVisible()
    await expect(page.getByLabel('In-App')).toBeVisible()
  })
})
