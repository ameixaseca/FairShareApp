import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

const schema = z.object({
  recipient: z.email({ message: 'Informe um e-mail válido' }),
  expiresAt: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

interface CreateInviteFormProps {
  onSubmit: (values: FormValues) => Promise<void>
}

export const CreateInviteForm = ({ onSubmit }: CreateInviteFormProps): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      expiresAt: '',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      <Input label="Destinatário" type="email" error={errors.recipient?.message} {...register('recipient')} />
      <Input label="Expira em" type="date" error={errors.expiresAt?.message} {...register('expiresAt')} />
      <Button type="submit" isLoading={isSubmitting}>
        Enviar convite
      </Button>
    </form>
  )
}
