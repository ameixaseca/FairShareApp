import { type PropsWithChildren } from 'react'

interface BadgeProps extends PropsWithChildren {
  tone?: 'neutral' | 'success' | 'warning'
}

const toneClass = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
}

export const Badge = ({ children, tone = 'neutral' }: BadgeProps): React.JSX.Element => (
  <span className={`rounded-full px-2 py-1 text-xs font-medium ${toneClass[tone]}`}>{children}</span>
)
