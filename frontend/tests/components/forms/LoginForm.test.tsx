import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from '../../../src/features/auth/components/LoginForm'

describe('LoginForm', () => {
  it('masks password input and disables submit when empty', () => {
    render(<LoginForm onSubmit={vi.fn()} />)

    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeDisabled()
  })

  it('enables submit for valid credentials and triggers callback', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('E-mail'), 'test@example.com')
    await user.type(screen.getByLabelText('Senha'), 'super-secret')

    const submitButton = screen.getByRole('button', { name: 'Entrar' })
    expect(submitButton).toBeEnabled()

    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'super-secret',
    })
  })

  it('shows generic error message when provided', () => {
    render(<LoginForm onSubmit={vi.fn()} errorMessage="Falha de autenticação" />)
    expect(screen.getByText('Falha de autenticação')).toBeInTheDocument()
  })
})
