import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LedgerViewer } from '../../src/features/ledger/components/LedgerViewer'

describe('LedgerViewer', () => {
  it('renders ledger entries in list', () => {
    render(
      <LedgerViewer
        entries={[
          {
            id: 'l1',
            type: 'Expense',
            description: 'Mercado',
            amount: 40,
            createdAt: '2030-01-01T00:00:00Z',
          },
        ]}
      />,
    )

    expect(screen.getByText('Mercado')).toBeInTheDocument()
  })
})
