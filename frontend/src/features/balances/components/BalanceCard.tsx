import { formatAmount } from '../../../utils/currency'

interface BalanceCardProps {
  balance: number
  currency: string
}

export const BalanceCard = ({ balance, currency }: BalanceCardProps): React.JSX.Element => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">Seu saldo</p>
    <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-emerald-600' : 'text-danger'}`}>
      {formatAmount(balance, currency)}
    </p>
  </div>
)
