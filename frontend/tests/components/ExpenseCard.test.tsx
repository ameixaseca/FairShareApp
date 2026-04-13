import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ExpenseResponse } from '../../src/types/expenses'
import { ExpenseCard } from '../../src/features/expenses/components/ExpenseCard'

const expense: ExpenseResponse = {
  id: 'e1',
  groupId: 'g1',
  paidByUserId: 'u1',
  amount: 25.5,
  description: 'Táxi',
  status: 'Posted',
  createdAt: '2030-01-01T00:00:00Z',
}

describe('ExpenseCard', () => {
  it('renders expense details and handles edit', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(<ExpenseCard expense={expense} onEdit={onEdit} />)

    expect(screen.getByText('Táxi')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Editar' }))
    expect(onEdit).toHaveBeenCalledWith('e1')
  })
})
