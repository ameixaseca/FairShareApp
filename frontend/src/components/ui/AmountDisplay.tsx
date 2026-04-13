import { formatAmount } from '../../utils/currency'

interface AmountDisplayProps {
  value: number
  currency: string
}

export const AmountDisplay = ({ value, currency }: AmountDisplayProps): React.JSX.Element => {
  const tone = value > 0 ? 'text-emerald-600' : value < 0 ? 'text-danger' : 'text-slate-600'
  return <span className={`font-semibold ${tone}`}>{formatAmount(value, currency)}</span>
}
