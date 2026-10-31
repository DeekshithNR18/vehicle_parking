export function CardSkeleton() {
  return (
    <div className="bg-panel/60 border border-white/10 rounded-3xl p-6 h-32 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-white/10 rounded w-1/2"></div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-panel/60 border border-white/10 rounded-2xl p-4 h-20 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="h-4 bg-white/10 rounded w-2/3 mb-3"></div>
          <div className="h-3 bg-white/10 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
}
