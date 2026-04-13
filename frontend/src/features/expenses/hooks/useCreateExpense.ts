import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExpense } from '../../../services/api/expensesApi'
import { logInfo } from '../../../services/observability/logging'
import { withSpan } from '../../../services/observability/tracing'
import { generateRequestId } from '../../../utils/idempotency'

export const useCreateExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      groupId: string
      paidByUserId: string
      amount: number
      description: string
      excludedUserIds?: string[]
    }) =>
      withSpan('expenses.create', () =>
        createExpense({
          ...payload,
          requestId: generateRequestId(),
        }),
      ),
    onSuccess: async (expense) => {
      logInfo('expense.created', { expenseId: expense.id, groupId: expense.groupId })
      await queryClient.invalidateQueries({ queryKey: ['groups', expense.groupId, 'expenses'] })
      await queryClient.invalidateQueries({ queryKey: ['groups', expense.groupId, 'balances'] })
    },
  })
}
