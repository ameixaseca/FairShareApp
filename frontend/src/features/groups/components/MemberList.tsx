import type { GroupMember } from '../../../types/groups'
import { Badge } from '../../../components/ui/Badge'

interface MemberListProps {
  members: GroupMember[]
  isAdmin: boolean
}

export const MemberList = ({ members }: MemberListProps): React.JSX.Element => {
  if (!members.length) {
    return <p className="text-sm text-slate-500">Nenhum membro cadastrado.</p>
  }

  return (
    <ul className="space-y-2">
      {members.map((member) => (
        <li className="flex items-center justify-between rounded-md border border-slate-200 p-3" key={member.userId}>
          <span>{member.name}</span>
          <div className="flex items-center gap-2">
            <Badge>{member.role}</Badge>
            <Badge tone={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</Badge>
          </div>
        </li>
      ))}
    </ul>
  )
}
