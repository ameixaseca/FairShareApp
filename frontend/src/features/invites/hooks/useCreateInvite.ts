import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInvite } from '../../../services/api/invitesApi'
import { logInfo } from '../../../services/observability/logging'
import { withSpan } from '../../../services/observability/tracing'

export const useCreateInvite = (groupId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ recipient, expiresAt }: { recipient: string; expiresAt: string }) =>
      withSpan('invites.create', () =>
        createInvite(groupId, {
          channel: 'Email',
          recipient,
          expiresAt,
        }),
      ),
    onSuccess: async (invite) => {
      logInfo('invite.created', { groupId, inviteId: invite.id })
      await queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'invites'] })
    },
  })
}
