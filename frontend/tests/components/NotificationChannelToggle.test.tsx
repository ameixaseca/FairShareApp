import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NotificationChannelToggle } from '../../src/features/notifications/components/NotificationChannelToggle'

describe('NotificationChannelToggle', () => {
  it('renders channel checkboxes and triggers onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <NotificationChannelToggle
        preferences={{ email: true, sms: false, inApp: true }}
        onChange={onChange}
      />,
    )

    expect(screen.getByLabelText('Email')).toBeChecked()
    expect(screen.getByLabelText('SMS')).not.toBeChecked()
    expect(screen.getByLabelText('In-App')).toBeChecked()

    await user.click(screen.getByLabelText('SMS'))

    expect(onChange).toHaveBeenCalledWith({ email: true, sms: true, inApp: true })
  })

  it('shows loading state while saving', () => {
    render(
      <NotificationChannelToggle
        preferences={{ email: true, sms: false, inApp: true }}
        isSaving
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Salvando...')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeDisabled()
  })

  it('shows error message and retry button', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <NotificationChannelToggle
        preferences={{ email: true, sms: false, inApp: true }}
        errorMessage="Falha no salvamento"
        onChange={vi.fn()}
        onRetry={onRetry}
      />,
    )

    expect(screen.getByText('Falha no salvamento')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(onRetry).toHaveBeenCalled()
  })
})
