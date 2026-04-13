import { Link, Outlet } from 'react-router-dom'

export const PublicLayout = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link to="/" className="inline-flex min-h-[44px] items-center text-lg font-semibold text-primary">
              FairShare
            </Link>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="inline-flex min-h-[44px] items-center text-sm text-slate-600 hover:text-slate-900 px-2">
              Entrar
            </Link>
            <Link to="/register" className="inline-flex min-h-[44px] items-center rounded-md bg-primary px-4 text-sm text-white">
              Criar conta
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
