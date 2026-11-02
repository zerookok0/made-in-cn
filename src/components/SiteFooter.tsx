import { useState } from 'react'
import { site } from '../data/site'
import { useI18n } from '../i18n'
import { AppLink } from './AppLink'

export function SiteFooter() {
  const { t } = useI18n()
  const [subscribed, setSubscribed] = useState(false)
  const policyLabel = (label: string) => {
    const labels: Record<string, string> = {
      'Shipping & returns': t('footer.shipping'),
      'Craft & care': t('footer.craftCare'),
      Privacy: t('footer.privacy'),
      Terms: t('footer.terms'),
    }
    return labels[label] ?? label
  }

  return (
    <footer className="footer">
      <div className="footer-top">
        <AppLink href="/" className="brand" ariaLabel={`${site.brand} home`}>
          <span className="brand-seal" aria-hidden="true">中</span>
          <span className="brand-word">
            {site.brand}
            <small>{site.brandCn}</small>
          </span>
        </AppLink>
        <p>{t('site.tagline')}</p>
      </div>

      <div className="footer-grid">
        <div className="footer-column">
          <h4>{t('footer.shop')}</h4>
          <AppLink href="/shop">{t('common.shopAll')}</AppLink>
          <AppLink href="/shop?collection=pokemon">{t('collection.pokemon')}</AppLink>
          <AppLink href="/shop?collection=heritage">{t('collection.heritage')}</AppLink>
          <AppLink href="/collection/fu-lu-cup">{t('footer.fuLu')}</AppLink>
        </div>

        <div className="footer-column">
          <h4>{t('footer.studio')}</h4>
          <AppLink href="/craft">{t('nav.craft')}</AppLink>
          <AppLink href="/craft">{t('footer.materials')}</AppLink>
          <AppLink href="/craft">{t('footer.shipping')}</AppLink>
          <AppLink href={`mailto:${site.email}`}>{t('nav.contact')}</AppLink>
        </div>

        <div className="footer-column">
          <h4>{t('footer.connect')}</h4>
          {site.social.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>

        <div className="footer-news">
          <h4>{t('footer.notes')}</h4>
          <p>{t('footer.notesBody')}</p>
          {subscribed ? (
            <p className="footer-contact">{t('footer.onList')}</p>
          ) : (
            <form
              className="news-form"
              onSubmit={(event) => {
                event.preventDefault()
                setSubscribed(true)
              }}
            >
              <input type="email" placeholder={t('footer.emailPlaceholder')} aria-label={t('footer.emailPlaceholder')} required />
              <button type="submit" aria-label={t('footer.subscribe')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-links footer-links--legal">
        {site.policies.map((item) => (
          <AppLink key={item.label} href={item.href}>{policyLabel(item.label)}</AppLink>
        ))}
        <AppLink href="/admin">{t('footer.admin')}</AppLink>
      </div>

      <div className="footer-bottom">
        <span>{t('footer.rights', { year: new Date().getFullYear(), brand: site.brand })}</span>
        <span>{site.studio} · {site.hours}</span>
      </div>

      <p className="footer-note">{t('footer.note', { brand: site.brand })}</p>
    </footer>
  )
}
