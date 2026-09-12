export const POSTS = [
  {
    slug: 'minecraft-server-optimization-guide',
    title: 'A Practical Guide to Minecraft Server Optimization',
    tag: 'Minecraft',
    date: '2026-09-02',
    author: 'Emberfield Engineering',
    readTime: '6 min read',
    excerpt: 'The five levers that move the needle on TPS, memory and player experience — from JVM flags to chunk pre-generation.',
    body: [
      { type: 'p', text: 'Most "laggy server" tickets trace back to the same handful of mistakes. Fix those first and you reclaim 80% of the performance you are losing, often without touching a single plugin.' },
      { type: 'h2', text: '1. Start with the right JVM flags' },
      { type: 'p', text: 'A balanced flag set tuned to your machine (Xms == Xmx, a sensible max heap for your RAM, and flags like "-XX:+UseG1GC") removes most of the stop-the-world pauses players feel as micro-freezes. We benchmark against your actual CPU before recommending anything.' },
      { type: 'h2', text: '2. Pre-generate, don\'t regret' },
      { type: 'p', text: 'Chunk generation is the single most expensive operation a Minecraft server performs. Pre-generating your world during quiet hours turns login spikes from a lagfest into a non-event.' },
      { type: 'h2', text: '3. Know your hot paths' },
      { type: 'p', text: 'Hopper chains, huge redstone clocks and entity farms that run 24/7 are silent TPS killers. Profiling tools show you exactly what is burning ticks so you can rule none in, none out.' },
      { type: 'h2', text: '4. Pack your resource load' },
      { type: 'p', text: 'Optimized textures, particle caps and view-distance budgets keep clients smooth without changing how the game feels.' },
      { type: 'h2', text: '5. Measure after every change' },
      { type: 'p', text: 'Performance work without before/after numbers is guesswork. We always ship a report so you can see the improvement — and so can your players.' },
      { type: 'p', text: 'Need hands-on help? Our Server Mode Setup and Performance Tuning services bundle all of this into a single delivery.' },
    ],
  },
  {
    slug: 'discord-verification-that-scales',
    title: 'Discord Verification That Actually Scales',
    tag: 'Discord',
    date: '2026-08-19',
    author: 'Emberfield Engineering',
    readTime: '4 min read',
    excerpt: 'Captcha, alt checks and role assignment: how to keep raids out of growing servers without punishing legitimate members.',
    body: [
      { type: 'p', text: 'A verification system is only as good as its false-positive rate. Block too much and real members bounce; block too little and raids walk straight through.' },
      { type: 'h2', text: 'Layered, not binary' },
      { type: 'p', text: 'The winning approach stacks cheap checks: account age on join, a lightweight captcha, and a manual approve queue only for the genuinely ambiguous cases. Every layer is automatic until it is not.' },
      { type: 'h2', text: 'Roles as the real gate' },
      { type: 'p', text: 'Verified members get one role and one path to every other permission. If a role grants reads or writes across the server, it should only appear after verification completes.' },
      { type: 'h2', text: 'Escape hatches' },
      { type: 'p', text: 'Always leave a manual approval path and a rescue channel. Bots make mistakes; a human override keeps trust intact when they do.' },
      { type: 'p', text: 'Our Verification Bot and Age & Guest Gate packages implement this stack out of the box.' },
    ],
  },
  {
    slug: 'security-audit-before-you-grow',
    title: 'Run a Security Audit Before You Grow',
    tag: 'Security',
    date: '2026-07-28',
    author: 'Emberfield Engineering',
    readTime: '5 min read',
    excerpt: 'Audits are cheaper before an incident than the incident itself. Here is what a real audit covers and why the report matters more than the scanner.',
    body: [
      { type: 'p', text: 'Every platform we see reaches a point where growth outruns its security basics. The audit we run is designed to catch that gap while fixing it is still a to-do list instead of a post-mortem.' },
      { type: 'h2', text: 'What a real audit checks' },
      { type: 'p', text: 'Exposed services and default credentials, outdated dependencies, broken permission boundaries, open buckets and databases, and shell exposure from misconfigured web apps. Scanners catch some; manual review catches the rest.' },
      { type: 'h2', text: 'The report is the product' },
      { type: 'p', text: 'Findings without priorities are noise. Our audits rank every issue by likelihood and blast radius, so you can fix the expensive ones first with clear guidance.' },
      { type: 'h2', text: 'Do it before it is urgent' },
      { type: 'p', text: 'Pre-incident audits are calm, thorough and cheap. Post-incident ones are stressful, rushed and expensive. Pick your moment.' },
      { type: 'p', text: 'Browse our Security Audit and Misconfiguration Fix services to get started.' },
    ],
  },
  {
    slug: 'what-makes-an-e-commerce-checkout-good',
    title: 'What Makes an E-commerce Checkout Good',
    tag: 'Web',
    date: '2026-07-05',
    author: 'Emberfield Engineering',
    readTime: '5 min read',
    excerpt: 'Conversion is not about big red buttons. It is about removing friction and trust doubt at the exact moments they appear.',
    body: [
      { type: 'p', text: 'You do not lose a sale at the "Buy" button. You lose it at the form field the customer does not understand, or the moment they wonder whether their card details are safe.' },
      { type: 'h2', text: 'One page, one goal' },
      { type: 'p', text: 'Splitting checkout across routes multiplies abandonment. A single column with a visible order summary beats a 4-page wizard every time.' },
      { type: 'h2', text: 'Format as they type' },
      { type: 'p', text: 'Card numbers that group themselves, expiry dates that insert the slash, and inline validation without a submit round-trip feel like magic. They also cut card errors in half.' },
      { type: 'h2', text: 'Say the quiet part about security' },
      { type: 'p', text: 'A small, honest trust row — "encrypted in transit, stored nowhere on disk" — removes the last doubt right before the charge.' },
      { type: 'p', text: 'Our E-commerce Storefront service ships these patterns built-in.' },
    ],
  },
  {
    slug: 'announcing-the-new-store',
    title: 'Announcing the New Emberfield Store',
    tag: 'Announcement',
    date: '2026-09-08',
    author: 'Emberfield Team',
    readTime: '3 min read',
    excerpt: 'Category pages, product deep-dives and cart checkout land today. Here is what changed and how to use it.',
    body: [
      { type: 'p', text: 'The new store organizes every service into browsable categories, gives every product its own detail page, and adds a real cart so you can bundle several services into a single checkout.' },
      { type: 'h2', text: 'What\'s new' },
      { type: 'p', text: 'Per-category store pages for Minecraft, Discord, Web, Design, Automation and Security. Product detail pages show delivery times, support windows, revision counts and source-code availability. A cart drawer follows you across the site.' },
      { type: 'h2', text: 'Multi-item checkout' },
      { type: 'p', text: 'Add several services, then check them out together as one order with a single promo code. Each item is recorded as its own purchase so our delivery team can track it independently.' },
      { type: 'p', text: 'Go open the store and let us know what you think — feedback threads are live on the forums.' },
    ],
  },
]

export const getPost = (slug) => POSTS.find((p) => p.slug === slug)
export const relatedPosts = (slug, limit = 3) => {
  const idx = POSTS.findIndex((p) => p.slug === slug)
  if (idx === -1) return []
  return POSTS.map((p, i) => ({ p, d: Math.abs(i - idx) }))
    .filter((x) => x.p.slug !== slug)
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.p)
}