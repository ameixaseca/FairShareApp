import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

const schema = z.object({
  amount: z.coerce.number().positive('Valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição obrigatória').max(200, 'Máximo de 200 caracteres'),
})

type FormValues = z.output<typeof schema>
type FormInputValues = z.input<typeof schema>

interface EditExpenseFormProps {
  initialAmount: number
  initialDescription: string
  onSubmit: (values: FormValues) => Promise<void>
}

export const EditExpenseForm = ({
  initialAmount,
  initialDescription,
  onSubmit,
}: EditExpenseFormProps): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      amount: initialAmount,
      description: initialDescription,
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      <Input label="Valor" type="number" step="0.01" error={errors.amount?.message} {...register('amount')} />
      <Input label="Descrição" error={errors.description?.message} {...register('description')} />
      <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
        Salvar alterações
      </Button>
    </form>
  )
}
