import { Link } from 'react-router-dom'

export const NotFoundPage = (): React.JSX.Element => (
  <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Página não encontrada</h1>
    <p className="text-sm text-slate-600">A rota informada não existe.</p>
    <Link to="/" className="text-sm text-primary underline">
      Voltar para início
    </Link>
  </div>
)
