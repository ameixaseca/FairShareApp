import type { ObligationResponse } from '../../../types/balances'
import { formatAmount } from '../../../utils/currency'

interface ObligationRowProps {
  obligation: ObligationResponse
  onSettle?: (obligation: ObligationResponse) => void
  currency?: string
  isCurrentUserDebtor?: boolean
}

export const ObligationRow = ({
  obligation,
  onSettle,
  currency = 'BRL',
  isCurrentUserDebtor = false,
}: ObligationRowProps): React.JSX.Element => (
  <div className="flex flex-col gap-2 rounded border border-slate-200 p-3 text-sm md:flex-row md:items-center md:justify-between">
    <span className={isCurrentUserDebtor ? 'text-danger' : ''}>
      {obligation.fromUserName} deve para {obligation.toUserName}
    </span>
    <div className="flex items-center gap-3">
      <span className="font-semibold text-danger">{formatAmount(obligation.amount, currency)}</span>
      {onSettle ? (
        <button className="text-xs text-primary underline" type="button" onClick={() => onSettle(obligation)}>
          Settle
        </button>
      ) : null}
    </div>
  </div>
)
