import type { LedgerListResponse } from '../../types/ledger'
import { apiClient } from './axios'
import { logInfo } from '../observability/logging'

export const getLedger = async (groupId: string): Promise<LedgerListResponse> => {
  const { data } = await apiClient.get<LedgerListResponse>(`/groups/${groupId}/ledger`)
  logInfo('ledger.loaded', { groupId, entries: data.entries.length })
  return data
}
