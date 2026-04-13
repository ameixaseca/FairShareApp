export type InviteChannel = 'Link' | 'Email'
export type InviteStatus = 'Pending' | 'Accepted' | 'Revoked' | 'Expired'

export interface InviteResponse {
  id: string
  groupId: string
  channel: InviteChannel
  recipient: string
  status: InviteStatus
  expiresAt: string
}

export interface CreateInviteRequest {
  channel: InviteChannel
  recipient: string
  expiresAt: string
}
