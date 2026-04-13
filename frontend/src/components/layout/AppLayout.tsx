import { Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { NavigationBar } from './NavigationBar'

export const AppLayout = (): React.JSX.Element => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold text-primary">FairShare</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <button className="text-sm text-slate-600" onClick={() => void logout()}>
            Sair
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4">
          <NavigationBar />
        </aside>
        <main className="rounded-lg border border-slate-200 bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
