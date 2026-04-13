import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BalanceCard } from '../../src/features/balances/components/BalanceCard'

describe('BalanceCard', () => {
  it('renders balance value and label', () => {
    render(<BalanceCard balance={120.5} currency="BRL" />)

    expect(screen.getByText('Seu saldo')).toBeInTheDocument()
    expect(screen.getByText(/R\$/)).toBeInTheDocument()
  })
})
