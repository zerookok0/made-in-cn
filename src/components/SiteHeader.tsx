import { useEffect, useMemo, useState } from 'react'
import { resolveImage } from '../data/images'
import { formatPrice, products } from '../data/products'
import { navigation, site } from '../data/site'
import { useCart } from '../lib/cart'
import { AppLink } from './AppLink'
import { useEscape, useRoute, useScrollLock } from '../lib/router'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 8h14l-1.2 11H6.2L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function SiteHeader() {
  const route = useRoute()
  const { count, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  useScrollLock(menuOpen || searchOpen)
  useEscape(menuOpen, () => setMenuOpen(false))
  useEscape(searchOpen, () => setSearchOpen(false))

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [route.path, route.query])

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return products
      .filter(
        (product) =>
          !normalized ||
          `${product.name} ${product.subtitle} ${product.collection}`.toLowerCase().includes(normalized),
      )
      .slice(0, 6)
  }, [query])

  const isActive = (href: string) => {
    const [path, search = ''] = href.split('?')
    if (path === '/') return route.path === '/'
    if (path !== route.path && !route.path.startsWith(`${path}/`)) return false
    if (!search) return !route.query.get('collection')
    return new URLSearchParams(search).get('collection') === route.query.get('collection')
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <AppLink href="/" className="brand" ariaLabel={`${site.brand} home`}>
            <span className="brand-seal" aria-hidden="true">中</span>
            <span className="brand-word">
              {site.brand}
              <small>{site.brandCn}</small>
            </span>
          </AppLink>

          <nav className="nav" aria-label="Primary">
            {navigation.map((item) => (
              <AppLink
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={isActive(item.href) ? 'is-active' : ''}
              >
                {item.label}
              </AppLink>
            ))}
          </nav>

          <div className="top-actions">
            <span className="made-pill">中国制造 · direct</span>
            <button className="cart-button" type="button" onClick={() => setSearchOpen(true)} aria-label="Search">
              <SearchIcon />
            </button>
            <button className="cart-button" type="button" onClick={openCart} aria-label="Open cart">
              <CartIcon />
              {count > 0 && <span>{count > 99 ? '99+' : count}</span>}
            </button>
            <button className="cart-button menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <button className="mobile-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <CloseIcon />
        </button>
        <span className="brand-seal" aria-hidden="true">中</span>
        <nav aria-label="Mobile">
          {navigation.map((item) => (
            <AppLink key={`${item.label}-${item.href}`} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </AppLink>
          ))}
        </nav>
        <p>{site.tagline}</p>
      </div>

      <div className={`search-panel ${searchOpen ? 'is-open' : ''}`} aria-hidden={!searchOpen}>
        <div className="search-row">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search lamps, tea ware, makers…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search products"
          />
          <button className="search-close" type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
            <CloseIcon />
          </button>
        </div>
        <div className="search-results">
          {results.length === 0 ? (
            <p className="search-empty">No pieces matched “{query}”.</p>
          ) : (
            results.map((product) => (
              <AppLink
                key={product.id}
                href={`/collection/${product.slug}`}
                className="search-result"
                onClick={() => setSearchOpen(false)}
              >
                <img src={resolveImage(product.images[0], 160)} alt="" />
                <span>
                  <strong>{product.name}</strong>
                  <small>{product.subtitle}</small>
                </span>
                <b>{formatPrice(product.price, product.currency)}</b>
              </AppLink>
            ))
          )}
        </div>
      </div>
    </>
  )
}
