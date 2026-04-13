import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ExpenseResponse } from '../../src/types/expenses'
import { ExpenseList } from '../../src/features/expenses/components/ExpenseList'

const expenses: ExpenseResponse[] = [
  {
    id: 'e1',
    groupId: 'g1',
    paidByUserId: 'u1',
    amount: 30,
    description: 'Mercado',
    status: 'Posted',
    createdAt: '2030-01-01T00:00:00Z',
  },
]

describe('ExpenseList', () => {
  it('renders list entries and empty state', () => {
    const { rerender } = render(<ExpenseList expenses={expenses} />)
    expect(screen.getByText('Mercado')).toBeInTheDocument()

    rerender(<ExpenseList expenses={[]} />)
    expect(screen.getByText('Nenhuma despesa registrada.')).toBeInTheDocument()
  })
})
