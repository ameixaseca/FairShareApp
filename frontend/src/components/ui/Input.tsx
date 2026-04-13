import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', id, ...props },
  ref,
) {
  const controlId = id ?? props.name

  return (
    <label className="flex w-full flex-col gap-1 text-sm" htmlFor={controlId}>
      <span className="text-slate-700">{label}</span>
      <input
        {...props}
        id={controlId}
        ref={ref}
        className={`h-11 rounded-md border px-3 py-2 outline-none focus:border-primary ${className}`}
      />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  )
})
