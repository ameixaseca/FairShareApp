import { useQuery } from '@tanstack/react-query'
import { getLedger } from '../../../services/api/ledgerApi'
import { withSpan } from '../../../services/observability/tracing'

export const useLedger = (groupId: string) =>
  useQuery({
    queryKey: ['groups', groupId, 'ledger'],
    queryFn: () => withSpan('ledger.list', () => getLedger(groupId)),
    enabled: Boolean(groupId),
  })
