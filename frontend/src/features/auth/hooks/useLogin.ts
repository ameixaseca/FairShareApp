import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../../contexts/AuthContext'
import { withSpan } from '../../../services/observability/tracing'

export const useLogin = () => {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) =>
      withSpan('auth.login', () => login(email, password)),
  })
}
