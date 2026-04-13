import { useQuery } from '@tanstack/react-query'
import { listExpenses } from '../../../services/api/expensesApi'
import { withSpan } from '../../../services/observability/tracing'

export const useExpenses = (groupId: string) =>
  useQuery({
    queryKey: ['groups', groupId, 'expenses'],
    queryFn: () => withSpan('expenses.list', () => listExpenses(groupId)),
    enabled: Boolean(groupId),
  })
