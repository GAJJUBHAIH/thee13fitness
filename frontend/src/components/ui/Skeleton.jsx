export function SkeletonBox({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl border border-white/10 p-5 space-y-4 animate-pulse">
      <div className="skeleton aspect-square rounded-xl" />
      <div className="space-y-2">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-5 w-3/4" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-7 w-20" />
        <div className="skeleton h-8 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-4 rounded ${className}`} />
}

export default SkeletonCard
