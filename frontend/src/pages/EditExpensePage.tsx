import { useNavigate, useParams } from 'react-router-dom'
import { EditExpenseForm } from '../features/expenses/components/EditExpenseForm'
import { useExpense } from '../features/expenses/hooks/useExpense'
import { useUpdateExpense } from '../features/expenses/hooks/useUpdateExpense'

export const EditExpensePage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const { expenseId = '' } = useParams()
  const groupId = 'default-group'
  const { expense } = useExpense(groupId, expenseId)
  const updateExpenseMutation = useUpdateExpense(groupId)

  if (!expense) {
    return <p className="text-sm text-slate-500">Despesa não encontrada.</p>
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Editar despesa</h1>
      <EditExpenseForm
        initialAmount={expense.amount}
        initialDescription={expense.description}
        onSubmit={async ({ amount, description }) => {
          await updateExpenseMutation.mutateAsync({
            expenseId,
            amount,
            description,
          })
          navigate('/expenses')
        }}
      />
    </div>
  )
}
