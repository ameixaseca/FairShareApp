import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

const schema = z.object({
  name: z.string().min(3, 'Informe ao menos 3 caracteres'),
  currency: z.string().min(3),
})

type FormValues = z.infer<typeof schema>

interface CreateGroupFormProps {
  onSubmit: (values: FormValues) => Promise<void>
}

export const CreateGroupForm = ({ onSubmit }: CreateGroupFormProps): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      currency: '',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      <Input label="Nome do grupo" error={errors.name?.message} {...register('name')} />
      <label className="flex flex-col gap-1 text-sm" htmlFor="currency">
        <span className="text-slate-700">Moeda</span>
        <select className="rounded-md border px-3 py-2" id="currency" {...register('currency')}>
          <option value="">Selecione</option>
          <option value="BRL">BRL</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        {errors.currency ? <span className="text-xs text-danger">{errors.currency.message}</span> : null}
      </label>
      <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
        Criar grupo
      </Button>
    </form>
  )
}
