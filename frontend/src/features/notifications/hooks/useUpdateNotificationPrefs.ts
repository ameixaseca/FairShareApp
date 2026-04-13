import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdatePrefsRequest } from '../../../types/notifications'
import { updateNotificationPreferences } from '../../../services/api/notificationsApi'
import { logInfo } from '../../../services/observability/logging'
import { withSpan } from '../../../services/observability/tracing'

export const useUpdateNotificationPrefs = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePrefsRequest) =>
      withSpan('notifications.preferences.update', () => updateNotificationPreferences(payload)),
    onSuccess: async (preferences) => {
      logInfo('notification_prefs_updated', preferences)
      await queryClient.invalidateQueries({ queryKey: ['users', 'notification-preferences'] })
    },
  })
}
