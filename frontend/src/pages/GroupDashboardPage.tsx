import { useNavigate, useParams } from 'react-router-dom'
import { BalanceCard } from '../features/balances/components/BalanceCard'
import { ObligationRow } from '../features/balances/components/ObligationRow'
import { useBalances } from '../features/balances/hooks/useBalances'
import { MemberList } from '../features/groups/components/MemberList'
import { useGroup } from '../features/groups/hooks/useGroup'

export const GroupDashboardPage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const { groupId = '' } = useParams()
  const { data: group } = useGroup(groupId)
  const { data: balances = [] } = useBalances(groupId)
  const currentBalance = balances[0]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{group?.name ?? 'Painel do grupo'}</h1>
      <button
        className="text-sm font-medium text-primary underline"
        type="button"
        onClick={() => navigate(`/settlements/new?groupId=${groupId || 'default-group'}`)}
      >
        Settle an Obligation
      </button>
      {currentBalance ? <BalanceCard balance={currentBalance.balance} currency={group?.currency ?? 'BRL'} /> : null}
      <div className="space-y-2">
        {currentBalance?.obligations.map((obligation) => (
          <ObligationRow
            key={`${obligation.fromUserId}-${obligation.toUserId}`}
            obligation={obligation}
            currency={group?.currency ?? 'BRL'}
            onSettle={(selected) =>
              navigate(
                `/settlements/new?groupId=${groupId || 'default-group'}&from=${selected.fromUserId}&to=${selected.toUserId}&pending=${selected.amount}`,
              )
            }
          />
        ))}
      </div>
      <MemberList isAdmin members={group?.members ?? []} />
    </div>
  )
}
