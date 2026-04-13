import { expect, test } from '@playwright/test'

const viewports = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1200, height: 900 },
]

const publicRoutes = [
  { path: '/', heading: 'Organize despesas compartilhadas com confiança' },
  { path: '/login', heading: 'Entrar' },
  { path: '/register', heading: 'Criar conta' },
]

const privateRoutes = [
  '/groups',
  '/groups/new',
  '/expenses',
  '/expenses/new',
  '/balances',
  '/history',
  '/preferences',
]

const assertNoHorizontalOverflow = async (page: import('@playwright/test').Page) => {
  const hasOverflow = await page.evaluate(() => {
    const root = document.documentElement
    return root.scrollWidth > root.clientWidth
  })

  expect(hasOverflow).toBeFalsy()
}

const assertTouchTargets = async (page: import('@playwright/test').Page, isMobile: boolean) => {
  if (!isMobile) {
    return
  }

  const tooSmallTargetCount = await page.evaluate(() => {
    const interactive = Array.from(
      document.querySelectorAll<
        HTMLButtonElement | HTMLAnchorElement | HTMLInputElement | HTMLSelectElement
      >('button, a, input, select'),
    )
      .filter((element) => {
        const style = window.getComputedStyle(element)
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          !element.hasAttribute('disabled')
        )
      })
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })

    return interactive.filter((element) => {
      const rect = element.getBoundingClientRect()
      return rect.width < 44 || rect.height < 44
    }).length
  })

  expect(tooSmallTargetCount).toBe(0)
}

test.describe('responsive pages', () => {
  for (const viewport of viewports) {
    test.describe(viewport.name, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } })

      for (const route of publicRoutes) {
        test(`public route ${route.path} renders`, async ({ page }) => {
          await page.goto(route.path)
          await expect(page.getByRole('heading', { name: route.heading })).toBeVisible()
          await assertNoHorizontalOverflow(page)
          await assertTouchTargets(page, viewport.name === 'mobile')
        })
      }

      for (const route of privateRoutes) {
        test(`private route ${route} redirects unauthenticated user`, async ({ page }) => {
          await page.goto(route)
          await expect(page).toHaveURL(/\/login$/)
          await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
          await assertNoHorizontalOverflow(page)
          await assertTouchTargets(page, viewport.name === 'mobile')
        })
      }
    })
  }
})
