import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export default function PageSkeleton({ count = 4 }) {
  return (
    <SkeletonTheme baseColor="var(--surface)" highlightColor="var(--surface-hover)">
      <div style={{ padding: '120px 24px 60px', maxWidth: '1100px', margin: '0 auto' }}>
        <Skeleton width={140} height={18} borderRadius={6} style={{ marginBottom: 16 }} />
        <Skeleton width={320} height={40} borderRadius={8} style={{ marginBottom: 10 }} />
        <Skeleton width={480} height={14} count={2} style={{ marginBottom: 20 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 40 }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
              <Skeleton circle width={44} height={44} style={{ marginBottom: 14 }} />
              <Skeleton width="60%" height={15} style={{ marginBottom: 10 }} />
              <Skeleton width="100%" height={11} count={3} style={{ marginBottom: 4 }} />
              <Skeleton width="85%" height={32} borderRadius={8} style={{ marginTop: 16 }} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  )
}