import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RedirectIfAuth } from '../../../src/components/guards/RedirectIfAuth'

vi.mock('../../../src/contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true, isLoading: false }),
}))

describe('RedirectIfAuth', () => {
  it('redirects authenticated users to /groups', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<RedirectIfAuth />}>
            <Route path="/login" element={<div>Login page</div>} />
          </Route>
          <Route path="/groups" element={<div>Groups page</div>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Groups page')).toBeInTheDocument()
  })
})
