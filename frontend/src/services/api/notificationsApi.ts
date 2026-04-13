import type { NotificationPrefsResponse, UpdatePrefsRequest } from '../../types/notifications'
import { apiClient } from './axios'
import { logInfo } from '../observability/logging'

export const getNotificationPreferences = async (): Promise<NotificationPrefsResponse> => {
  const { data } = await apiClient.get<NotificationPrefsResponse>('/users/notification-preferences')
  return data
}

export const updateNotificationPreferences = async (
  payload: UpdatePrefsRequest,
): Promise<NotificationPrefsResponse> => {
  const { data } = await apiClient.patch<NotificationPrefsResponse>(
    '/users/notification-preferences',
    payload,
  )
  logInfo('notification_prefs_updated', payload)
  return data
}
