import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  isLoading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-[#0d2550]',
  secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
  danger: 'bg-danger text-white hover:bg-red-700',
}

export const Button = ({
  children,
  className = '',
  isLoading = false,
  variant = 'primary',
  ...props
}: ButtonProps): React.JSX.Element => (
  <button
    {...props}
    className={`inline-flex min-h-[44px] items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${variantClasses[variant]} ${className}`}
    disabled={isLoading || props.disabled}
  >
    {isLoading ? 'Carregando...' : children}
  </button>
)
