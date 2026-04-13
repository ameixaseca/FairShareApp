import type { LedgerEntryResponse } from '../../../types/ledger'
import { formatDate } from '../../../utils/date'
import { formatAmount } from '../../../utils/currency'

interface LedgerViewerProps {
  entries: LedgerEntryResponse[]
}

export const LedgerViewer = ({ entries }: LedgerViewerProps): React.JSX.Element => {
  if (!entries.length) {
    return <p className="text-sm text-slate-500">Nenhuma transação registrada.</p>
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li className="rounded border border-slate-200 p-3" key={entry.id}>
          <div className="flex items-center justify-between">
            <strong>{entry.description}</strong>
            <span>{formatAmount(entry.amount)}</span>
          </div>
          <p className="text-xs text-slate-500">{formatDate(entry.createdAt)}</p>
        </li>
      ))}
    </ul>
  )
}
