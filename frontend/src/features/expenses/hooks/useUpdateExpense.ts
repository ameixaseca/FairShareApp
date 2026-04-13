import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateExpense } from '../../../services/api/expensesApi'
import { logInfo } from '../../../services/observability/logging'
import { withSpan } from '../../../services/observability/tracing'

export const useUpdateExpense = (groupId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      expenseId,
      amount,
      description,
    }: {
      expenseId: string
      amount?: number
      description?: string
    }) => withSpan('expenses.update', () => updateExpense(expenseId, { amount, description })),
    onSuccess: async (expense) => {
      logInfo('expense.updated', { expenseId: expense.id, groupId })
      await queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'expenses'] })
      await queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'balances'] })
    },
  })
}
