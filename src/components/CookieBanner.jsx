import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const CONSENT_KEY = 'ed-cookie-consent'
const SHOW_DELAY_MS = 10000

export function getCookieConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

export default function CookieBanner() {
  const { lang, t } = useLanguage()
  const [consent, setConsent] = useState(getCookieConsent)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  if (consent || !visible) return null

  const choose = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {}
    setConsent(value)
  }

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cb-inner">
        <div className="cb-text">
          <span className="cb-title">{t.cookies.title}</span>
          <span className="cb-message">{t.cookies.message}</span>
          <Link to={`/${lang}/cookies`} className="cb-link">{t.cookies.learn}</Link>
        </div>
        <div className="cb-actions">
          <button type="button" className="btn-ghost cb-btn" onClick={() => choose('essential')}>
            {t.cookies.essential}
          </button>
          <button type="button" className="btn-primary cb-btn" onClick={() => choose('all')}>
            {t.cookies.acceptAll}
          </button>
        </div>
      </div>
      <style>{`
        .cookie-banner {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          z-index: 140;
          padding: 14px 20px;
          background: #030712;
          border-top: 1px solid rgba(148,163,184,0.15);
          box-shadow: 0 -8px 30px rgba(0,0,0,0.35);
          animation: cookieUp 0.4s ease-out;
        }
        .cookie-banner .cb-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .cookie-banner .cb-text {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 4px 8px;
        }
        .cookie-banner .cb-title { color: #F8FAFC; font-weight: 700; font-size: 14px; }
        .cookie-banner .cb-message { color: #94A3B8; font-size: 13px; }
        .cookie-banner .cb-link { color: var(--primary); font-size: 13px; font-weight: 600; text-decoration: none; }
        .cookie-banner .cb-link:hover { text-decoration: underline; }
        .cookie-banner .cb-actions { display: flex; gap: 10px; flex-shrink: 0; }
        .cookie-banner .cb-btn { white-space: nowrap; border-radius: 0; font-size: 13px; }
        @keyframes cookieUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (max-width: 768px) {
          .cookie-banner .cb-inner { flex-direction: column; align-items: stretch; }
          .cookie-banner .cb-actions { width: 100%; }
          .cookie-banner .cb-btn { flex: 1; }
        }
      `}</style>
    </div>
  )
}