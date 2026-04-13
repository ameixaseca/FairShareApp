import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

const schema = z
  .object({
    creditorUserId: z.string().min(1, 'Selecione um credor'),
    debtorUserId: z.string().min(1, 'Selecione um devedor'),
    amount: z.coerce.number().positive('Valor deve ser maior que zero'),
  })
  .refine((values) => values.creditorUserId !== values.debtorUserId, {
    path: ['debtorUserId'],
    message: 'Credor e devedor devem ser diferentes',
  })

type SettlementFormInputValues = z.input<typeof schema>

export interface SettlementFormValues {
  creditorUserId: string
  debtorUserId: string
  amount: number
}

interface SettlementMemberOption {
  userId: string
  name: string
}

interface CreateSettlementFormProps {
  members: SettlementMemberOption[]
  pendingAmount?: number
  defaultCreditorUserId?: string
  defaultDebtorUserId?: string
  isSubmitting?: boolean
  onSubmit: (values: SettlementFormValues) => Promise<void>
}

export const CreateSettlementForm = ({
  members,
  pendingAmount,
  defaultCreditorUserId,
  defaultDebtorUserId,
  isSubmitting = false,
  onSubmit,
}: CreateSettlementFormProps): React.JSX.Element => {
  const [pendingExceededError, setPendingExceededError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SettlementFormInputValues, unknown, SettlementFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      creditorUserId: defaultCreditorUserId ?? '',
      debtorUserId: defaultDebtorUserId ?? '',
      amount: undefined,
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        if (typeof pendingAmount === 'number' && values.amount > pendingAmount) {
          setPendingExceededError(true)
          return
        }

        setPendingExceededError(false)
        await onSubmit(values)
      })}
    >
      <label className="flex flex-col gap-1 text-sm" htmlFor="creditorUserId">
        <span className="text-slate-700">Credor</span>
        <select className="rounded-md border px-3 py-2" id="creditorUserId" {...register('creditorUserId')}>
          <option value="">Selecione</option>
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.name}
            </option>
          ))}
        </select>
        {errors.creditorUserId ? <span className="text-xs text-danger">{errors.creditorUserId.message}</span> : null}
      </label>

      <label className="flex flex-col gap-1 text-sm" htmlFor="debtorUserId">
        <span className="text-slate-700">Devedor</span>
        <select className="rounded-md border px-3 py-2" id="debtorUserId" {...register('debtorUserId')}>
          <option value="">Selecione</option>
          {members.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.name}
            </option>
          ))}
        </select>
        {errors.debtorUserId ? <span className="text-xs text-danger">{errors.debtorUserId.message}</span> : null}
      </label>

      <Input label="Valor" type="number" step="0.01" error={errors.amount?.message} {...register('amount')} />

      {typeof pendingAmount === 'number' ? (
        <p className="text-xs text-slate-500">Pendência atual: {pendingAmount.toFixed(2)}</p>
      ) : null}

      {pendingExceededError && typeof pendingAmount === 'number' ? (
        <p className="text-xs text-danger" role="alert">
          amount exceeds pending {pendingAmount.toFixed(2)}
        </p>
      ) : null}

      <Button type="submit" disabled={!isValid || isSubmitting} isLoading={isSubmitting}>
        Registrar quitação
      </Button>
    </form>
  )
}
