import type { SettlementResponse } from '../../types/settlements'
import { apiClient } from './axios'
import { logInfo } from '../observability/logging'

export const listSettlements = async (groupId: string): Promise<SettlementResponse[]> => {
  const { data } = await apiClient.get<SettlementResponse[]>(`/groups/${groupId}/settlements`)
  return data
}

export const createSettlement = async (
  groupId: string,
  fromUserId: string,
  toUserId: string,
  amount: number,
  requestId: string,
): Promise<SettlementResponse> => {
  const { data } = await apiClient.post<SettlementResponse>(
    '/settlements',
    {
      groupId,
      fromUserId,
      toUserId,
      amount,
      requestId,
    },
    {
      headers: {
        'X-Request-Id': requestId,
      },
    },
  )
  logInfo('settlement_recorded', { groupId, fromUserId, toUserId, amount, settlementId: data.id })
  return data
}
