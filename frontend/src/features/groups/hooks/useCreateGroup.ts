import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../contexts/AuthContext'
import { createGroup } from '../../../services/api/groupsApi'
import { logInfo } from '../../../services/observability/logging'
import { withSpan } from '../../../services/observability/tracing'

export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({ name, currency }: { name: string; currency: string }) =>
      withSpan('groups.create', () =>
        createGroup({
          name,
          currency,
          ownerId: user?.id ?? '',
        }),
      ),
    onSuccess: async (group) => {
      logInfo('group.created', { groupId: group.id, ownerId: user?.id })
      await queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}
