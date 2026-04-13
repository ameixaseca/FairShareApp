import type { ExpenseResponse } from '../../../types/expenses'
import { formatAmount } from '../../../utils/currency'
import { formatDate } from '../../../utils/date'

interface ExpenseCardProps {
  expense: ExpenseResponse
  onEdit?: (expenseId: string) => void
  onDelete?: (expenseId: string) => void
}

export const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps): React.JSX.Element => (
  <article className="space-y-2 rounded-lg border border-slate-200 p-4 shadow-sm">
    <header className="flex items-center justify-between">
      <h2 className="text-base font-semibold">{expense.description}</h2>
      <span className="text-sm font-semibold text-accent">{formatAmount(expense.amount)}</span>
    </header>
    <p className="text-xs text-slate-500">{formatDate(expense.createdAt)}</p>
    <div className="flex gap-2">
      {onEdit ? (
        <button className="rounded border px-2 py-1 text-xs" onClick={() => onEdit(expense.id)} type="button">
          Editar
        </button>
      ) : null}
      {onDelete ? (
        <button
          className="rounded border border-red-200 px-2 py-1 text-xs text-danger"
          onClick={() => onDelete(expense.id)}
          type="button"
        >
          Excluir
        </button>
      ) : null}
    </div>
  </article>
)
