import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CreateExpenseForm } from '../../../src/features/expenses/components/CreateExpenseForm'

describe('CreateExpenseForm', () => {
  it('disables submit for invalid amount and enables for valid payload', async () => {
    const user = userEvent.setup()
    render(<CreateExpenseForm members={['u1', 'u2']} onSubmit={vi.fn()} />)

    const submit = screen.getByRole('button', { name: 'Registrar despesa' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('Valor'), '50')
    await user.type(screen.getByLabelText('Descrição'), 'Jantar')

    expect(submit).toBeEnabled()
  })

  it('submits valid expense payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<CreateExpenseForm members={['u1', 'u2']} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Valor'), '80')
    await user.type(screen.getByLabelText('Descrição'), 'Almoço')
    await user.click(screen.getByRole('button', { name: 'Registrar despesa' }))

    expect(onSubmit).toHaveBeenCalledWith({ amount: 80, description: 'Almoço' })
  })
})
