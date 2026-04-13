import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSettlement } from '../../../services/api/settlementsApi'
import { logInfo } from '../../../services/observability/logging'
import { withSpan } from '../../../services/observability/tracing'
import { generateRequestId } from '../../../utils/idempotency'

export const useCreateSettlement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      groupId: string
      fromUserId: string
      toUserId: string
      amount: number
    }) => {
      const requestId = generateRequestId()
      return withSpan('settlements.create', () =>
        createSettlement(
          payload.groupId,
          payload.fromUserId,
          payload.toUserId,
          payload.amount,
          requestId,
        ),
      )
    },
    onSuccess: async (settlement) => {
      logInfo('settlement_recorded', { groupId: settlement.groupId, settlementId: settlement.id })
      await queryClient.invalidateQueries({ queryKey: ['groups', settlement.groupId, 'balances'] })
      await queryClient.invalidateQueries({ queryKey: ['groups', settlement.groupId, 'ledger'] })
      await queryClient.invalidateQueries({
        queryKey: ['groups', settlement.groupId, 'settlements'],
      })
    },
  })
}
