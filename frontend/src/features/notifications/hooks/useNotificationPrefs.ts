import { useQuery } from '@tanstack/react-query'
import { getNotificationPreferences } from '../../../services/api/notificationsApi'
import { withSpan } from '../../../services/observability/tracing'

export const useNotificationPrefs = () =>
  useQuery({
    queryKey: ['users', 'notification-preferences'],
    queryFn: () => withSpan('notifications.preferences.get', () => getNotificationPreferences()),
  })
