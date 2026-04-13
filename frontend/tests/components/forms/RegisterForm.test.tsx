import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RegisterForm } from '../../../src/features/auth/components/RegisterForm'

describe('RegisterForm', () => {
  it('validates minimum fields and disables submit while invalid', async () => {
    const user = userEvent.setup()
    render(<RegisterForm onSubmit={vi.fn()} />)

    const submitButton = screen.getByRole('button', { name: 'Criar conta' })
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByLabelText('Nome'), 'A')
    await user.type(screen.getByLabelText('E-mail'), 'invalid-email')
    await user.type(screen.getByLabelText('Senha'), '123')

    expect(submitButton).toBeDisabled()
  })

  it('submits valid payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<RegisterForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Ana Silva')
    await user.type(screen.getByLabelText('E-mail'), 'ana@example.com')
    await user.type(screen.getByLabelText('Senha'), '12345678')

    const submitButton = screen.getByRole('button', { name: 'Criar conta' })
    expect(submitButton).toBeEnabled()

    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ana Silva',
      email: 'ana@example.com',
      password: '12345678',
    })
  })

  it('renders generic duplicate email error without account enumeration', () => {
    render(<RegisterForm onSubmit={vi.fn()} errorMessage="Credenciais inválidas ou estado da conta" />)

    expect(screen.getByText('Credenciais inválidas ou estado da conta')).toBeInTheDocument()
  })
})
