import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ObligationRow } from '../../src/features/balances/components/ObligationRow'

describe('ObligationRow', () => {
  it('shows debtor, creditor and amount', () => {
    render(
      <ObligationRow
        obligation={{
          fromUserId: 'u1',
          fromUserName: 'Ana',
          toUserId: 'u2',
          toUserName: 'Bruno',
          amount: 50,
        }}
      />,
    )

    expect(screen.getByText(/Ana deve para Bruno/i)).toBeInTheDocument()
    expect(screen.getByText(/R\$/)).toBeInTheDocument()
  })

  it('calls onSettle when action button is clicked', async () => {
    const user = userEvent.setup()
    const onSettle = vi.fn()

    render(
      <ObligationRow
        obligation={{
          fromUserId: 'u1',
          fromUserName: 'Ana',
          toUserId: 'u2',
          toUserName: 'Bruno',
          amount: 50,
        }}
        onSettle={onSettle}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Settle' }))
    expect(onSettle).toHaveBeenCalled()
  })
})
