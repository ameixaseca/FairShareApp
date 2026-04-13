import { Link, useNavigate } from 'react-router-dom'
import { RegisterForm } from '../features/auth/components/RegisterForm'
import { useRegister } from '../features/auth/hooks/useRegister'

export const RegisterPage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <RegisterForm
        errorMessage={registerMutation.error ? 'Credenciais inválidas ou estado da conta' : undefined}
        onSubmit={async (values) => {
          await registerMutation.mutateAsync(values)
          navigate('/login')
        }}
      />
      <p className="text-sm text-slate-600">
        Já possui conta?{' '}
        <Link className="inline-flex min-h-[44px] items-center px-1 text-primary underline" to="/login">
          Entrar
        </Link>
      </p>
    </div>
  )
}
