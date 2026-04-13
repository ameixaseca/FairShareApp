interface EmptyStateProps {
  title: string
  description: string
}

export const EmptyState = ({ title, description }: EmptyStateProps): React.JSX.Element => (
  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
    <h2 className="mb-2 text-lg font-semibold text-slate-800">{title}</h2>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
)
