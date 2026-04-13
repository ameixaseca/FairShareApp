import { useQuery } from '@tanstack/react-query'
import { getBalances } from '../../../services/api/balancesApi'
import { withSpan } from '../../../services/observability/tracing'

export const useBalances = (groupId: string) =>
  useQuery({
    queryKey: ['groups', groupId, 'balances'],
    queryFn: () => withSpan('balances.list', () => getBalances(groupId)),
    enabled: Boolean(groupId),
  })
