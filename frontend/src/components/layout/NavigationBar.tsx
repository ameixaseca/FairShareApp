import { Link } from 'react-router-dom'

export const NavigationBar = (): React.JSX.Element => {
  return (
    <nav className="flex flex-wrap gap-2 text-sm">
      {[['Grupos', '/groups'], ['Despesas', '/expenses'], ['Saldos', '/balances'], ['Histórico', '/history'], ['Preferências', '/preferences']].map(
        ([label, to]) => (
          <Link key={to} to={to} className="inline-flex min-h-[44px] items-center px-3 text-slate-700 hover:text-slate-900">
            {label}
          </Link>
        )
      )}
    </nav>
  )
}
