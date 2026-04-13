import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../../contexts/AuthContext'
import { withSpan } from '../../../services/observability/tracing'

export const useRegister = () => {
  const { register } = useAuth()

  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) => withSpan('auth.register', () => register(name, email, password)),
  })
}
