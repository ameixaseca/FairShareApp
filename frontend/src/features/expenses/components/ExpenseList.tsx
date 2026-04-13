import type { ExpenseResponse } from '../../../types/expenses'
import { ExpenseCard } from './ExpenseCard'

interface ExpenseListProps {
  expenses: ExpenseResponse[]
  onEdit?: (expenseId: string) => void
  onDelete?: (expenseId: string) => void
}

export const ExpenseList = ({ expenses, onEdit, onDelete }: ExpenseListProps): React.JSX.Element => {
  if (!expenses.length) {
    return <p className="text-sm text-slate-500">Nenhuma despesa registrada.</p>
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard expense={expense} key={expense.id} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  )
}
