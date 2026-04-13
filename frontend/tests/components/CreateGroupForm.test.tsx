import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CreateGroupForm } from '../../src/features/groups/components/CreateGroupForm'

describe('CreateGroupForm', () => {
  it('requires valid name and currency before enabling submit', async () => {
    const user = userEvent.setup()
    render(<CreateGroupForm onSubmit={vi.fn()} />)

    const submit = screen.getByRole('button', { name: 'Criar grupo' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('Nome do grupo'), 'Viagem')
    await user.selectOptions(screen.getByLabelText('Moeda'), 'BRL')

    expect(submit).toBeEnabled()
  })
})
