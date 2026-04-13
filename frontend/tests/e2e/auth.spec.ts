import { expect, test } from '@playwright/test'

const mockAuthUser = { id: 'owner', name: 'Owner', email: 'owner@example.com' }

test.describe('US0 auth flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/auth/me', (route) => route.fulfill({ status: 401, body: '{}' }))
    await page.route('**/auth/register', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAuthUser),
      }),
    )
    await page.route('**/auth/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockAuthUser),
      }),
    )
  })

  test('shows landing page with primary CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('main').getByRole('link', { name: 'Criar conta' })).toBeVisible()
  })

  test('opens register page from landing CTA', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('main').getByRole('link', { name: 'Criar conta' }).click()
    await expect(page.getByRole('heading', { name: 'Criar conta' })).toBeVisible()
  })

  test('shows register form fields', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByLabel('Nome')).toBeVisible()
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
  })

  test('shows login form fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible()
  })

  test('registers then logs in and redirects to groups', async ({ page }) => {
    const random = Date.now()
    await page.goto('/register')
    await page.getByLabel('Nome').fill('Usuário Teste')
    await page.getByLabel('E-mail').fill(`user${random}@example.com`)
    await page.getByLabel('Senha').fill('12345678')
    await page.getByRole('button', { name: 'Criar conta' }).click()

    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()

    const loginForm = page
      .locator('form')
      .filter({ has: page.getByRole('button', { name: 'Entrar' }) })

    await loginForm.getByLabel('E-mail').fill(`user${random}@example.com`)
    await loginForm.getByLabel('Senha').fill('12345678')
    const loginButton = loginForm.getByRole('button', { name: 'Entrar' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click()

    await expect(page).toHaveURL(/\/groups$/)
  })
})
