import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import {
  CreateSettlementForm,
  type SettlementFormValues,
} from '../features/settlements/components/CreateSettlementForm'
import { useCreateSettlement } from '../features/settlements/hooks/useCreateSettlement'

export const CreateSettlementPage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const createSettlementMutation = useCreateSettlement()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const groupId = searchParams.get('groupId') ?? 'default-group'
  const fromUserId = searchParams.get('from') ?? ''
  const toUserId = searchParams.get('to') ?? ''
  const pendingAmount = Number(searchParams.get('pending') ?? '')

  const members = useMemo(
    () => [
      { userId: 'owner', name: 'Owner' },
      { userId: 'member-1', name: 'Member 1' },
      { userId: 'member-2', name: 'Member 2' },
    ],
    [],
  )

  const handleSubmit = async (values: SettlementFormValues): Promise<void> => {
    await createSettlementMutation.mutateAsync({
      groupId,
      fromUserId: values.debtorUserId,
      toUserId: values.creditorUserId,
      amount: values.amount,
    })

    setSuccessMessage('Settlement recorded')
    navigate(`/balances?groupId=${groupId}`)
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Registrar quitação</h1>

      {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
      {createSettlementMutation.isError ? (
        <ErrorBanner message={createSettlementMutation.error instanceof Error ? createSettlementMutation.error.message : 'Falha ao registrar quitação'} />
      ) : null}

      <CreateSettlementForm
        members={members}
        pendingAmount={Number.isFinite(pendingAmount) ? pendingAmount : undefined}
        defaultDebtorUserId={fromUserId}
        defaultCreditorUserId={toUserId}
        isSubmitting={createSettlementMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
