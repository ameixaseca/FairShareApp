import type { CreateInviteRequest, InviteResponse } from '../../types/invites'
import { apiClient } from './axios'

export const listInvites = async (groupId: string): Promise<InviteResponse[]> => {
  const { data } = await apiClient.get<InviteResponse[]>(`/groups/${groupId}/invites`)
  return data
}

export const createInvite = async (
  groupId: string,
  payload: CreateInviteRequest,
): Promise<InviteResponse> => {
  const { data } = await apiClient.post<InviteResponse>(`/groups/${groupId}/invites`, payload)
  return data
}

export const revokeInvite = async (inviteId: string): Promise<void> => {
  await apiClient.delete(`/invites/${inviteId}`)
}
