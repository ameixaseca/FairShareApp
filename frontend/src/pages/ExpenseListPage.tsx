import { useNavigate } from 'react-router-dom'
import { ExpenseList } from '../features/expenses/components/ExpenseList'
import { useDeleteExpense } from '../features/expenses/hooks/useDeleteExpense'
import { useExpenses } from '../features/expenses/hooks/useExpenses'

export const ExpenseListPage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const groupId = 'default-group'
  const { data: expenses = [] } = useExpenses(groupId)
  const deleteExpenseMutation = useDeleteExpense(groupId)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Despesas</h1>
      <ExpenseList
        expenses={expenses}
        onDelete={(expenseId) => {
          void deleteExpenseMutation.mutate(expenseId)
        }}
        onEdit={(expenseId) => navigate(`/expenses/${expenseId}/edit`)}
      />
    </div>
  )
}
