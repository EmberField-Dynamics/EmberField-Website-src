import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export default function UsersTableSkeleton({ rows = 5 }) {
  return (
    <SkeletonTheme baseColor="var(--surface)" highlightColor="var(--surface-hover)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 20px', borderRadius: 12,
              border: '1px solid var(--border)', background: 'var(--card-bg)',
            }}
          >
            <Skeleton circle width={44} height={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Skeleton width="40%" height={14} style={{ marginBottom: 6 }} />
              <Skeleton width="55%" height={11} />
            </div>
            <Skeleton width={72} height={32} borderRadius={8} style={{ flexShrink: 0 }} />
            <Skeleton width={40} height={32} borderRadius={8} style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  )
}