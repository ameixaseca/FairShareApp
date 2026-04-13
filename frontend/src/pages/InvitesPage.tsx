import { useParams } from 'react-router-dom'
import { CreateInviteForm } from '../features/invites/components/CreateInviteForm'
import { InviteTable } from '../features/invites/components/InviteTable'
import { useCreateInvite } from '../features/invites/hooks/useCreateInvite'
import { useInvites } from '../features/invites/hooks/useInvites'

export const InvitesPage = (): React.JSX.Element => {
  const { groupId = '' } = useParams()
  const { data: invites = [] } = useInvites(groupId)
  const createInviteMutation = useCreateInvite(groupId)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Convites</h1>
      <CreateInviteForm
        onSubmit={async (values) => {
          await createInviteMutation.mutateAsync(values)
        }}
      />
      <InviteTable invites={invites} />
    </div>
  )
}
