import { useMutation, useQueryClient } from '@tanstack/react-query'
import { revokeInvite } from '../../../services/api/invitesApi'
import { logInfo } from '../../../services/observability/logging'
import { withSpan } from '../../../services/observability/tracing'

export const useRevokeInvite = (groupId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteId: string) => withSpan('invites.revoke', () => revokeInvite(inviteId)),
    onSuccess: async (_, inviteId) => {
      logInfo('invite.revoked', { groupId, inviteId })
      await queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'invites'] })
    },
  })
}
