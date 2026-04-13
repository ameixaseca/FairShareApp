import { ErrorBanner } from '../components/ui/ErrorBanner'
import { NotificationChannelToggle } from '../features/notifications/components/NotificationChannelToggle'
import { useNotificationPrefs } from '../features/notifications/hooks/useNotificationPrefs'
import { useUpdateNotificationPrefs } from '../features/notifications/hooks/useUpdateNotificationPrefs'

export const NotificationPreferencesPage = (): React.JSX.Element => {
  const preferencesQuery = useNotificationPrefs()
  const updatePreferencesMutation = useUpdateNotificationPrefs()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Preferências de notificação</h1>

      {preferencesQuery.isError ? <ErrorBanner message="Falha ao carregar preferências" /> : null}

      {preferencesQuery.data ? (
        <NotificationChannelToggle
          preferences={preferencesQuery.data}
          isSaving={updatePreferencesMutation.isPending}
          errorMessage={updatePreferencesMutation.isError ? 'Não foi possível salvar preferências' : undefined}
          onChange={(prefs) => {
            updatePreferencesMutation.mutate(prefs)
          }}
          onRetry={() => {
            if (preferencesQuery.data) {
              updatePreferencesMutation.mutate(preferencesQuery.data)
            }
          }}
        />
      ) : (
        <p className="text-sm text-slate-500">Carregando preferências...</p>
      )}
    </div>
  )
}
