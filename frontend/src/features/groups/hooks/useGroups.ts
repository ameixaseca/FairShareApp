import { useQuery } from '@tanstack/react-query'
import { listGroups } from '../../../services/api/groupsApi'
import { withSpan } from '../../../services/observability/tracing'

export const useGroups = () =>
  useQuery({
    queryKey: ['groups'],
    queryFn: () => withSpan('groups.list', listGroups),
  })
