import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { GroupResponse } from '../../src/types/groups'
import { GroupCard } from '../../src/features/groups/components/GroupCard'

const group: GroupResponse = {
  id: 'g-1',
  name: 'Roommates',
  currency: 'BRL',
  ownerId: 'u-1',
  members: [],
}

describe('GroupCard', () => {
  it('renders group details and handles click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<GroupCard group={group} onClick={onClick} />)

    expect(screen.getByText('Roommates')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Roommates/i }))

    expect(onClick).toHaveBeenCalledWith('g-1')
  })
})
