import { useState } from 'react'
import { site } from '../data/site'
import { AppLink } from './AppLink'

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false)

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
        <p>{site.tagline}</p>
      </div>

      <div className="footer-grid">
        <div className="footer-column">
          <h4>Shop</h4>
          <AppLink href="/shop">All objects</AppLink>
          <AppLink href="/shop?collection=pokemon">Pokémon Artisan</AppLink>
          <AppLink href="/shop?collection=heritage">Heritage</AppLink>
          <AppLink href="/collection/fu-lu-cup">Fu Lu tea cup</AppLink>
        </div>

        <div className="footer-column">
          <h4>Studio</h4>
          <AppLink href="/craft">Our craft</AppLink>
          <AppLink href="/craft">Materials & makers</AppLink>
          <AppLink href="/craft">Shipping & returns</AppLink>
          <AppLink href={`mailto:${site.email}`}>Contact</AppLink>
        </div>

        <div className="footer-column">
          <h4>Connect</h4>
          {site.social.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>

        <div className="footer-news">
          <h4>Studio notes</h4>
          <p>New makers, restocks and the occasional workshop story. No spam.</p>
          {subscribed ? (
            <p className="footer-contact">You’re on the list.</p>
          ) : (
            <form
              className="news-form"
              onSubmit={(event) => {
                event.preventDefault()
                setSubscribed(true)
              }}
            >
              <input type="email" placeholder="Email address" aria-label="Email address" required />
              <button type="submit" aria-label="Subscribe">
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
          <AppLink key={item.label} href={item.href}>{item.label}</AppLink>
        ))}
        <AppLink href="/admin">Content studio</AppLink>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.brand}. All rights reserved.</span>
        <span>{site.studio} · {site.hours}</span>
      </div>

      <p className="footer-note">
        Concept storefront for {site.brand}. Product copy, availability and checkout settings are managed in the content studio.
      </p>
    </footer>
  )
}
