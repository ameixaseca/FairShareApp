import { useQuery } from '@tanstack/react-query'
import { getGroup } from '../../../services/api/groupsApi'

export const useGroup = (groupId: string) =>
  useQuery({
    queryKey: ['groups', groupId],
    queryFn: () => getGroup(groupId),
    enabled: Boolean(groupId),
  })
