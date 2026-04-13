import { Link, useNavigate } from 'react-router-dom'
import { LoginForm } from '../features/auth/components/LoginForm'
import { useLogin } from '../features/auth/hooks/useLogin'

export const LoginPage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <LoginForm
        errorMessage={loginMutation.error ? 'Credenciais inválidas ou estado da conta' : undefined}
        onSubmit={async (values) => {
          await loginMutation.mutateAsync(values)
          navigate('/groups')
        }}
      />
      <p className="text-sm text-slate-600">
        Ainda não tem conta?{' '}
        <Link className="inline-flex min-h-[44px] items-center px-1 text-primary underline" to="/register">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
