import { LedgerViewer } from '../features/ledger/components/LedgerViewer'
import { useLedger } from '../features/ledger/hooks/useLedger'

export const LedgerHistoryPage = (): React.JSX.Element => {
  const { data } = useLedger('default-group')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Histórico</h1>
      <LedgerViewer entries={data?.entries ?? []} />
    </div>
  )
}
