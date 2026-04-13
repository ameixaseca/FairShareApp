import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const RedirectIfAuth = (): React.JSX.Element => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Carregando sessão...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/groups" replace />
  }

  return <Outlet />
}
