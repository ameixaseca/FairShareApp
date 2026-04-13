import { useNavigate } from 'react-router-dom'
import { CreateGroupForm } from '../features/groups/components/CreateGroupForm'
import { useCreateGroup } from '../features/groups/hooks/useCreateGroup'

export const CreateGroupPage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const createGroupMutation = useCreateGroup()

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Criar grupo</h1>
      <CreateGroupForm
        onSubmit={async (values) => {
          await createGroupMutation.mutateAsync(values)
          navigate('/groups')
        }}
      />
    </div>
  )
}
