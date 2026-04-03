const Shimmer = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-white/[0.04] ${className}`} />
)

export function SkeletonStatCard() {
  return (
    <div className="gc rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <Shimmer className="w-11 h-11 rounded-2xl" />
        <Shimmer className="w-14 h-6 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Shimmer className="w-28 h-7" />
        <Shimmer className="w-20 h-4" />
        <Shimmer className="w-24 h-3" />
      </div>
      <Shimmer className="w-full h-0.5 rounded-full" />
    </div>
  )
}

export function SkeletonTransactionRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <Shimmer className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="w-32 h-4" />
        <Shimmer className="w-20 h-3" />
      </div>
      <div className="flex gap-2">
        <Shimmer className="w-16 h-5 rounded-lg" />
        <Shimmer className="w-16 h-5 rounded-lg" />
      </div>
      <Shimmer className="w-16 h-4" />
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="animate-pulse space-y-3">
      <Shimmer className="w-36 h-5" />
      <Shimmer className="w-20 h-3" />
      <Shimmer className="w-full h-52 rounded-2xl mt-2" />
    </div>
  )
}