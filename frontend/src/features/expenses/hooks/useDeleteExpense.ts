import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteExpense } from '../../../services/api/expensesApi'
import { logInfo } from '../../../services/observability/logging'
import { withSpan } from '../../../services/observability/tracing'

export const useDeleteExpense = (groupId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (expenseId: string) => withSpan('expenses.delete', () => deleteExpense(expenseId)),
    onSuccess: async (_, expenseId) => {
      logInfo('expense.deleted', { expenseId, groupId })
      await queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'expenses'] })
      await queryClient.invalidateQueries({ queryKey: ['groups', groupId, 'balances'] })
    },
  })
}
