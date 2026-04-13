import { useParams } from 'react-router-dom'
import { MemberList } from '../features/groups/components/MemberList'
import { useGroup } from '../features/groups/hooks/useGroup'

export const MembersPage = (): React.JSX.Element => {
  const { groupId = '' } = useParams()
  const { data: group } = useGroup(groupId)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Membros</h1>
      <MemberList isAdmin members={group?.members ?? []} />
    </div>
  )
}
