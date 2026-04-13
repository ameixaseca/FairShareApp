import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { GroupCard } from '../features/groups/components/GroupCard'
import { useGroups } from '../features/groups/hooks/useGroups'

export const GroupsListPage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const { data: groups = [] } = useGroups()

  if (!groups.length) {
    return (
      <EmptyState
        title="Nenhum grupo encontrado"
        description="Crie seu primeiro grupo para começar a dividir despesas."
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map((group) => (
        <GroupCard group={group} key={group.id} onClick={(groupId) => navigate(`/groups/${groupId}`)} />
      ))}
    </div>
  )
}
