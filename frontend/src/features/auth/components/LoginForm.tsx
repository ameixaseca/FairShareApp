import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../../components/ui/Button'
import { ErrorBanner } from '../../../components/ui/ErrorBanner'
import { Input } from '../../../components/ui/Input'

const loginSchema = z.object({
  email: z.email({ message: 'Informe um e-mail válido' }),
  password: z.string().min(1, 'Informe sua senha'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>
  errorMessage?: string
}

export const LoginForm = ({ onSubmit, errorMessage }: LoginFormProps): React.JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(async (values) => onSubmit(values))}>
      {errorMessage ? <ErrorBanner message={errorMessage} /> : null}
      <Input label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
      <div className="space-y-1">
        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          className="inline-flex min-h-[44px] items-center text-xs text-slate-500 underline"
          type="button"
          onClick={() => setShowPassword((value) => !value)}
        >
          {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        </button>
      </div>
      <Button type="submit" isLoading={isSubmitting} disabled={!isValid} className="w-full">
        Entrar
      </Button>
    </form>
  )
}
