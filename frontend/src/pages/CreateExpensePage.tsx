import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CreateExpenseForm } from '../features/expenses/components/CreateExpenseForm'
import { useCreateExpense } from '../features/expenses/hooks/useCreateExpense'

export const CreateExpensePage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const createExpenseMutation = useCreateExpense()

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Nova despesa</h1>
      <CreateExpenseForm
        members={['owner', 'member-1']}
        onSubmit={async ({ amount, description, excludedUserIds }) => {
          await createExpenseMutation.mutateAsync({
            groupId: 'default-group',
            paidByUserId: user?.id ?? '',
            amount,
            description,
            excludedUserIds,
          })
          navigate('/expenses')
        }}
      />
    </div>
  )
}
