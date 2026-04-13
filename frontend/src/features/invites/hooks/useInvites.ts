import { useQuery } from '@tanstack/react-query'
import { listInvites } from '../../../services/api/invitesApi'

export const useInvites = (groupId: string) =>
  useQuery({
    queryKey: ['groups', groupId, 'invites'],
    queryFn: () => listInvites(groupId),
    enabled: Boolean(groupId),
  })
