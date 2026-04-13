import type { CreateGroupRequest, GroupResponse } from '../../types/groups'
import { apiClient } from './axios'

export const listGroups = async (): Promise<GroupResponse[]> => {
  const { data } = await apiClient.get<GroupResponse[]>('/groups')
  return data
}

export const getGroup = async (groupId: string): Promise<GroupResponse> => {
  const { data } = await apiClient.get<GroupResponse>(`/groups/${groupId}`)
  return data
}

export const createGroup = async (payload: CreateGroupRequest): Promise<GroupResponse> => {
  const { data } = await apiClient.post<GroupResponse>('/groups', payload)
  return data
}
