import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { InviteResponse } from '../../src/types/invites'
import { InviteTable } from '../../src/features/invites/components/InviteTable'

const invites: InviteResponse[] = [
  {
    id: 'i-1',
    groupId: 'g-1',
    channel: 'Email',
    recipient: 'member@example.com',
    status: 'Pending',
    expiresAt: '2030-01-01T00:00:00Z',
  },
]

describe('InviteTable', () => {
  it('renders invite entries', () => {
    render(<InviteTable invites={invites} />)

    expect(screen.getByText('member@example.com')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })
})
