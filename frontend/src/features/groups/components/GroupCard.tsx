import type { GroupResponse } from '../../../types/groups'

interface GroupCardProps {
  group: GroupResponse
  onClick: (groupId: string) => void
}

export const GroupCard = ({ group, onClick }: GroupCardProps): React.JSX.Element => (
  <button
    className="w-full rounded-lg border border-slate-200 p-4 text-left shadow-sm transition hover:shadow"
    onClick={() => onClick(group.id)}
    type="button"
  >
    <h2 className="text-lg font-semibold">{group.name}</h2>
    <p className="text-sm text-slate-500">{group.members.length} membros</p>
  </button>
)
