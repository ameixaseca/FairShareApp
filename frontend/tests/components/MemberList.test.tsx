import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { GroupMember } from '../../src/types/groups'
import { MemberList } from '../../src/features/groups/components/MemberList'

const members: GroupMember[] = [
  { userId: '1', name: 'Ana', role: 'Owner', status: 'Active' },
  { userId: '2', name: 'Bruno', role: 'Member', status: 'Active' },
]

describe('MemberList', () => {
  it('renders members and role badges', () => {
    render(<MemberList members={members} isAdmin={false} />)

    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
    expect(screen.getByText('Owner')).toBeInTheDocument()
    expect(screen.getByText('Member')).toBeInTheDocument()
  })
})
