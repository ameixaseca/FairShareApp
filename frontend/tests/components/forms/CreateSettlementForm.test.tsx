import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CreateSettlementForm } from '../../../src/features/settlements/components/CreateSettlementForm'

describe('CreateSettlementForm', () => {
  const members = [
    { userId: 'u1', name: 'Alice' },
    { userId: 'u2', name: 'Bob' },
  ]

  it('prefills creditor and debtor from props', () => {
    render(
      <CreateSettlementForm
        members={members}
        defaultCreditorUserId="u2"
        defaultDebtorUserId="u1"
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Credor')).toHaveValue('u2')
    expect(screen.getByLabelText('Devedor')).toHaveValue('u1')
  })

  it('calls onSubmit with creditor, debtor and amount', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<CreateSettlementForm members={members} onSubmit={onSubmit} />)

    await user.selectOptions(screen.getByLabelText('Credor'), 'u2')
    await user.selectOptions(screen.getByLabelText('Devedor'), 'u1')
    await user.type(screen.getByLabelText('Valor'), '25')
    await user.click(screen.getByRole('button', { name: 'Registrar quitação' }))

    expect(onSubmit).toHaveBeenCalledWith({
      creditorUserId: 'u2',
      debtorUserId: 'u1',
      amount: 25,
    })
  })

  it('shows pending amount exceeded error and prevents submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<CreateSettlementForm members={members} pendingAmount={20} onSubmit={onSubmit} />)

    await user.selectOptions(screen.getByLabelText('Credor'), 'u2')
    await user.selectOptions(screen.getByLabelText('Devedor'), 'u1')
    await user.type(screen.getByLabelText('Valor'), '30')
    await user.click(screen.getByRole('button', { name: 'Registrar quitação' }))

    expect(screen.getByRole('alert')).toHaveTextContent('amount exceeds pending 20.00')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('disables submit while submitting', () => {
    render(<CreateSettlementForm members={members} isSubmitting onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Carregando...' })).toBeDisabled()
  })
})
