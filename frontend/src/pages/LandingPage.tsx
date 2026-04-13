import { Link } from 'react-router-dom'

export const LandingPage = (): React.JSX.Element => (
  <section className="space-y-6">
    <h1 className="text-4xl font-bold text-primary">Organize despesas compartilhadas com confiança</h1>
    <p className="max-w-2xl text-slate-600">
      FairShare simplifica grupos, despesas, saldos e quitações em uma interface web rápida e segura.
    </p>
    <div className="flex gap-3">
      <Link className="inline-flex min-h-[44px] items-center rounded-md bg-primary px-4 text-sm font-medium text-white" to="/register">
        Criar conta
      </Link>
      <Link className="inline-flex min-h-[44px] items-center rounded-md border border-slate-300 px-4 text-sm font-medium" to="/login">
        Entrar
      </Link>
    </div>
  </section>
)
