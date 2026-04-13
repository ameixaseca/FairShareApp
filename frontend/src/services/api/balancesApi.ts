import type { BalanceResponse } from '../../types/balances'
import { apiClient } from './axios'
import { logInfo } from '../observability/logging'

export const getBalances = async (groupId: string): Promise<BalanceResponse[]> => {
  const { data } = await apiClient.get<BalanceResponse[]>(`/groups/${groupId}/balances`)
  logInfo('balances.loaded', { groupId, count: data.length })
  return data
}
