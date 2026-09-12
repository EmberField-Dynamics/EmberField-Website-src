export const SYSTEMS = [
  { key: 'store', status: 'operational', uptime: '99.99%' },
  { key: 'auth', status: 'operational', uptime: '99.98%' },
  { key: 'website', status: 'operational', uptime: '100%' },
  { key: 'forum', status: 'operational', uptime: '99.97%' },
  { key: 'support', status: 'operational', uptime: '99.95%' },
  { key: 'docs', status: 'operational', uptime: '100%' },
  { key: 'api', status: 'degraded', uptime: '99.12%' },
  { key: 'cdn', status: 'operational', uptime: '99.99%' },
]

export const INCIDENTS = [
  {
    date: '2026-08-30',
    title: 'API latency degraded for 40 minutes',
    status: 'resolved',
    desc: 'A database connection pool was saturated after a deploy. Traffic was offloaded to the warm standby while the pool was resized. No data was lost.',
  },
  {
    date: '2026-07-14',
    title: 'Planned maintenance for the forum service',
    status: 'maintenance',
    desc: 'The forums were placed in read-only mode for 25 minutes during a schema migration. Announcements were posted in advance.',
  },
  {
    date: '2026-06-02',
    title: 'CDN edge failover test',
    status: 'resolved',
    desc: 'A scheduled test of our multi-region failover routing performed within expected latency targets. No user impact reported.',
  },
]

export const statusLabel = (s, t) => {
  switch (s) {
    case 'operational': return t.status.operational
    case 'degraded': return t.status.degraded
    case 'down': return t.status.down
    case 'maintenance': return t.status.maintenance
    default: return s
  }
}

export const statusColor = (s) => {
  switch (s) {
    case 'operational': return '#10B981'
    case 'degraded': return '#F59E0B'
    case 'down': return '#EF4444'
    case 'maintenance': return '#3B82F6'
    default: return '#10B981'
  }
}