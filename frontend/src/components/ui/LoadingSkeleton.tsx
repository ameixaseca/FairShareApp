export const LoadingSkeleton = (): React.JSX.Element => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 w-2/3 rounded bg-slate-200" />
    <div className="h-4 w-full rounded bg-slate-200" />
    <div className="h-4 w-4/5 rounded bg-slate-200" />
  </div>
)
