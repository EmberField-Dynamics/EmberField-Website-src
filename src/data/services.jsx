export const CATEGORIES = [
  {
    id: 'minecraft',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M7 7h4v4H7z" />
        <path d="M13 7h4v4h-4z" />
        <path d="M7 13h4v4H7z" />
        <path d="M13 13h4v4h-4z" />
      </svg>
    ),
  },
  {
    id: 'discord',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    id: 'web',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'design',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: 'automation',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
  {
    id: 'security',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

export const PRODUCTS = [
  {
    slug: 'anticheat',
    cat: 'minecraft',
    name: 'Custom AntiCheat Configuration',
    price: 3.99,
    popular: false,
    features: [
      'Configuration of any Anticheat',
      'Setup on your server',
      'Custom Detection Rules',
      'Performance Optimization',
      '24/7 Support',
    ],
  },
  {
    slug: 'servermode',
    cat: 'minecraft',
    name: 'Server Mode Setup',
    price: 14.99,
    popular: true,
    features: [
      'Complete Server Configuration',
      'Setup on your machine',
      'Server naming to your preference',
      'Anticheat included',
      'Permissions ready',
      'Any game mode',
      'Performance Optimization',
    ],
  },
  {
    slug: 'plugins',
    cat: 'minecraft',
    name: 'Custom Plugin Development',
    price: 24.99,
    popular: false,
    features: [
      'Full plugin built from scratch',
      'Everything to your preference',
      'Database integration',
      'Configuration files',
      'Source code included',
      '30 days maintenance',
    ],
  },
  {
    slug: 'modpacks',
    cat: 'minecraft',
    name: 'Modpack Setup',
    price: 12.99,
    popular: false,
    features: [
      'Forge / Fabric / NeoForge',
      'Mod selection and configuration',
      'Server + client setup',
      'Crash fixes',
      'Update support',
    ],
  },
  {
    slug: 'datapacks',
    cat: 'minecraft',
    name: 'Custom Datapacks',
    price: 6.99,
    popular: false,
    features: [
      'Custom mechanics',
      'JSON and function packs',
      'Balancing included',
      'Compatibility testing',
      '30 days maintenance',
    ],
  },
  {
    slug: 'practice',
    cat: 'minecraft',
    name: 'Practice & PvP Servers',
    price: 19.99,
    popular: false,
    features: [
      'Arena and queue systems',
      'Kit configuration',
      'Elo and stats tracking',
      'Spectator support',
      'Match making setup',
    ],
  },
  {
    slug: 'minigames',
    cat: 'minecraft',
    name: 'Minigame Development',
    price: 29.99,
    popular: false,
    features: [
      'Custom minigames',
      'Party systems',
      'Scoreboards and stats',
      'Arenas and maps',
      'Economy integration',
    ],
  },
  {
    slug: 'resourcepacks',
    cat: 'minecraft',
    name: 'Custom Resource Packs',
    price: 7.99,
    popular: false,
    features: [
      'Custom models and textures',
      'GUI design',
      'Server pack hosting',
      'Optimization',
      'Updates included',
    ],
  },
  {
    slug: 'discordbot',
    cat: 'discord',
    name: 'Custom Discord Bot',
    price: 5.99,
    popular: false,
    features: [
      'Everything to your preference',
      'Moderation Features',
      'Complete Entertainment',
      'Server Management Tools',
      'Custom Commands',
      'Database Integration',
    ],
  },
  {
    slug: 'ticketsystem',
    cat: 'discord',
    name: 'Custom Ticket System',
    price: 7.99,
    popular: false,
    features: [
      'Multi-category tickets',
      'Staff panels',
      'Transcripts saved',
      'Activity logging',
      'Priority queue options',
    ],
  },
  {
    slug: 'modsuite',
    cat: 'discord',
    name: 'Moderation Suite',
    price: 9.99,
    popular: false,
    features: [
      'Auto-moderation',
      'Warning and strike system',
      'Logs and audit channel',
      'Mute and timeout automation',
      'Dashboard for configuration',
    ],
  },
  {
    slug: 'musicbot',
    cat: 'discord',
    name: 'Music Bot',
    price: 5.99,
    popular: false,
    features: [
      'High quality playback',
      'Queue management',
      '24/7 mode',
      'Platform playlist support',
      'Custom aliases',
    ],
  },
  {
    slug: 'economybot',
    cat: 'discord',
    name: 'Economy & Leveling Bot',
    price: 8.99,
    popular: false,
    features: [
      'Currency and shops',
      'Leveling and XP',
      'Daily rewards',
      'Leaderboards',
      'Minigames',
    ],
  },
  {
    slug: 'verifybot',
    cat: 'discord',
    name: 'Verification Bot',
    price: 6.99,
    popular: false,
    features: [
      'Captcha verification',
      'Automatic role assignment',
      'Punishment tracking',
      'Alt account checks',
      'Full logging',
    ],
  },
  {
    slug: 'giveawaybot',
    cat: 'discord',
    name: 'Giveaway & Events Bot',
    price: 4.99,
    popular: false,
    features: [
      'Giveaway manager',
      'Reaction based entries',
      'Custom winner count',
      'Event scheduling',
      'Logging',
    ],
  },
  {
    slug: 'landingpage',
    cat: 'web',
    name: 'Landing Page',
    price: 14.99,
    popular: false,
    features: [
      'Modern responsive design',
      'Conversion focused sections',
      'SEO setup',
      'Analytics',
      'Contact forms',
      '30 days maintenance',
    ],
  },
  {
    slug: 'storefront',
    cat: 'web',
    name: 'E-commerce Storefront',
    price: 24.99,
    popular: false,
    features: [
      'Product catalog',
      'Cart and checkout flow',
      'Payment gateway',
      'Order emails',
      'Admin panel access',
    ],
  },
  {
    slug: 'dashboard',
    cat: 'web',
    name: 'Admin Dashboard',
    price: 29.99,
    popular: false,
    features: [
      'Custom data panels',
      'Charts and analytics',
      'Role based access',
      'API ready',
      'Responsive layout',
    ],
  },
  {
    slug: 'portfolioweb',
    cat: 'web',
    name: 'Portfolio Website',
    price: 19.99,
    popular: false,
    features: [
      'Personal or brand portfolio',
      'Gallery and case studies',
      'Blog ready',
      'SEO optimized',
      'Fast loading',
    ],
  },
  {
    slug: 'botsite',
    cat: 'web',
    name: 'Bot Website',
    price: 9.99,
    popular: false,
    features: [
      'Branded landing for your bot',
      'Status and invite buttons',
      'Stats widgets',
      'SEO setup',
      'Responsive design',
    ],
  },
  {
    slug: 'controlpanel',
    cat: 'web',
    name: 'Custom Control Panel',
    price: 49.99,
    popular: false,
    features: [
      'Full management panel',
      'User roles and permissions',
      'Database driven',
      'API integrations',
      'Deployment ready',
    ],
  },
  {
    slug: 'logodesign',
    cat: 'design',
    name: 'Logo Design',
    price: 7.99,
    popular: false,
    features: [
      'Custom concept',
      'Vector files',
      'Full color variants',
      'Transparent formats',
      'Source files',
    ],
  },
  {
    slug: 'bannerset',
    cat: 'design',
    name: 'Banner & Thumbnail Pack',
    price: 4.99,
    popular: false,
    features: [
      'Thumbnails',
      'Server banners',
      'Discord banners',
      'Print ready sizes',
      'Source files',
    ],
  },
  {
    slug: 'brandingkit',
    cat: 'design',
    name: 'Branding Kit',
    price: 14.99,
    popular: false,
    features: [
      'Logo + banner + avatar set',
      'Color palette',
      'Typography guide',
      'Social media kit',
      'Source files',
    ],
  },
  {
    slug: 'uiux',
    cat: 'design',
    name: 'UI/UX Design',
    price: 19.99,
    popular: false,
    features: [
      'Wireframes and prototypes',
      'Modern UI system',
      'Design tool source',
      'Responsive design system',
      'Handoff docs',
    ],
  },
  {
    slug: 'serverart',
    cat: 'design',
    name: 'Server Art Pack',
    price: 5.99,
    popular: false,
    features: [
      'Discord server icons',
      'Banner and splash',
      'Emoji and sticker pack',
      'Custom styles',
      'Source files',
    ],
  },
  {
    slug: 'workflows',
    cat: 'automation',
    name: 'Automation Workflows',
    price: 12.99,
    popular: false,
    features: [
      'Automate any process',
      'API based triggers',
      'Scheduled tasks',
      'Notifications',
      'Logging and retries',
    ],
  },
  {
    slug: 'apiintegrations',
    cat: 'automation',
    name: 'API Integrations',
    price: 19.99,
    popular: false,
    features: [
      'Connect any service',
      'Webhooks and REST APIs',
      'Data sync',
      'Error handling',
      'Documentation',
    ],
  },
  {
    slug: 'webhookhub',
    cat: 'automation',
    name: 'Webhook Relay & Logging',
    price: 6.99,
    popular: false,
    features: [
      'Multi-channel webhook relays',
      'Rich formatting',
      'Log retention',
      'Rate-limit safe',
      'Analytics',
    ],
  },
  {
    slug: 'schedulers',
    cat: 'automation',
    name: 'Cloud Scheduler & Cron',
    price: 8.99,
    popular: false,
    features: [
      'Scheduled jobs',
      'Recurring tasks',
      'Retry policies',
      'Discord alerts',
      'Dashboard',
    ],
  },
  {
    slug: 'formautomation',
    cat: 'automation',
    name: 'Form Automation',
    price: 7.99,
    popular: false,
    features: [
      'Custom form builders',
      'Auto reply emails',
      'Database storage',
      'Discord delivery',
      'Analytics',
    ],
  },
  {
    slug: 'hardening',
    cat: 'security',
    name: 'Server Hardening',
    price: 9.99,
    popular: false,
    features: [
      'OS and service hardening',
      'Firewall rules',
      'Intrusion prevention',
      'Audit logging',
      'Security checklist',
    ],
  },
  {
    slug: 'secaudit',
    cat: 'security',
    name: 'Security Audit',
    price: 19.99,
    popular: false,
    features: [
      'Vulnerability scan',
      'Config review',
      'Credential review',
      'Penetration summary',
      'Actionable report',
    ],
  },
  {
    slug: 'perftuning',
    cat: 'security',
    name: 'Performance Tuning',
    price: 8.99,
    popular: false,
    features: [
      'Code and config profiling',
      'Cache optimization',
      'Database tuning',
      'Load testing',
      'Before/after report',
    ],
  },
  {
    slug: 'backups',
    cat: 'security',
    name: 'Backup & Recovery Setup',
    price: 9.99,
    popular: false,
    features: [
      'Automated backups',
      'Offsite storage',
      'Restore testing',
      'Monitoring and alerts',
      'Documentation',
    ],
  },
  {
    slug: 'ddosreview',
    cat: 'security',
    name: 'Anti-DDoS & Proxy Review',
    price: 12.99,
    popular: false,
    features: [
      'Proxy and CDN recommendations',
      'Rate-limit analysis',
      'DNS and backend review',
      'Mitigation configuration',
      'Final report',
    ],
  },
]

export const productsByCategory = (catId) => PRODUCTS.filter((p) => p.cat === catId)