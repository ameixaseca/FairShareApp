export interface NotificationPrefsResponse {
  email: boolean
  sms: boolean
  inApp: boolean
}

export interface UpdatePrefsRequest {
  email: boolean
  sms: boolean
  inApp: boolean
}
