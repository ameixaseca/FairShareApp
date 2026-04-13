import type { NotificationPrefsResponse } from '../../../types/notifications'
import { Button } from '../../../components/ui/Button'

interface NotificationChannelToggleProps {
  preferences: NotificationPrefsResponse
  isSaving?: boolean
  errorMessage?: string
  onChange: (prefs: NotificationPrefsResponse) => void
  onRetry?: () => void
}

export const NotificationChannelToggle = ({
  preferences,
  isSaving = false,
  errorMessage,
  onChange,
  onRetry,
}: NotificationChannelToggleProps): React.JSX.Element => (
  <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="text-sm font-semibold text-slate-700">Canais de notificação</h2>

    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={preferences.email}
        onChange={(event) => onChange({ ...preferences, email: event.target.checked })}
        disabled={isSaving}
      />
      Email
    </label>

    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={preferences.sms}
        onChange={(event) => onChange({ ...preferences, sms: event.target.checked })}
        disabled={isSaving}
      />
      SMS
    </label>

    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={preferences.inApp}
        onChange={(event) => onChange({ ...preferences, inApp: event.target.checked })}
        disabled={isSaving}
      />
      In-App
    </label>

    {isSaving ? <p className="text-xs text-slate-500">Salvando...</p> : null}

    {errorMessage ? (
      <div className="space-y-2">
        <p className="text-xs text-danger">{errorMessage}</p>
        {onRetry ? (
          <Button type="button" variant="secondary" onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : null}
      </div>
    ) : null}
  </div>
)
