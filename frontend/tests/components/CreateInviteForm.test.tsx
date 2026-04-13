import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CreateInviteForm } from '../../src/features/invites/components/CreateInviteForm'

describe('CreateInviteForm', () => {
  it('submits invite payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<CreateInviteForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Destinatário'), 'friend@example.com')
    await user.type(screen.getByLabelText('Expira em'), '2030-01-01')
    await user.click(screen.getByRole('button', { name: 'Enviar convite' }))

    expect(onSubmit).toHaveBeenCalled()
  })
})
