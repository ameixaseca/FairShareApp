import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../../components/ui/Button'
import { ErrorBanner } from '../../../components/ui/ErrorBanner'
import { Input } from '../../../components/ui/Input'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome precisa ter ao menos 2 caracteres'),
  email: z.email({ message: 'Informe um e-mail válido' }),
  password: z.string().min(8, 'Senha precisa ter ao menos 8 caracteres'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>
  errorMessage?: string
}

export const RegisterForm = ({ onSubmit, errorMessage }: RegisterFormProps): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      {errorMessage ? <ErrorBanner message={errorMessage} /> : null}
      <Input label="Nome" error={errors.name?.message} {...register('name')} />
      <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Senha" type="password" error={errors.password?.message} {...register('password')} />
      <Button type="submit" isLoading={isSubmitting} disabled={!isValid} className="w-full">
        Criar conta
      </Button>
    </form>
  )
}
