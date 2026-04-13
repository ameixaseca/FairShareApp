import { type PropsWithChildren } from 'react'

export const Card = ({ children }: PropsWithChildren): React.JSX.Element => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">{children}</div>
)
