import { useMemo } from 'react'
import { useExpenses } from './useExpenses'

export const useExpense = (groupId: string, expenseId: string) => {
  const expensesQuery = useExpenses(groupId)

  const expense = useMemo(
    () => expensesQuery.data?.find((candidate) => candidate.id === expenseId),
    [expenseId, expensesQuery.data],
  )

  return {
    ...expensesQuery,
    expense,
  }
}
