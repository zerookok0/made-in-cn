import { useEffect, useMemo, useState } from 'react'

interface Product {
  id: string
  name: string
  subtitle: string
  price: number
  image: string
  accent: string
}

const PRODUCTS: Product[] = [
  {
    id: 'pikachu',
    name: 'Pikachu',
    subtitle: "Electric Gold · Collector's Edition",
    price: 189,
    image: 'pikachu-01.jpg',
    accent: '#e4a600',
  },
  {
    id: 'gengar',
    name: 'Gengar',
    subtitle: "Phantom Purple · Collector's Edition",
    price: 179,
    image: 'gengar-01.jpg',
    accent: '#7c5cff',
  },
]

const STEPS = [
  { number: '01', title: 'Sculpt the scene', body: 'A miniature diorama, shaped and painted by hand.' },
  { number: '02', title: 'Pour the crystal', body: 'Layers of clear resin build depth around the character.' },
  { number: '03', title: 'Fit the glow', body: 'A warm LED core is fitted and tested before packing.' },
]

const UGC = [
  { image: 'pikachu-detail-01.jpg', handle: '@raka.setups', market: 'Jakarta', views: '1.2M views' },
  { image: 'pikachu-detail-02.jpg', handle: '@mika.room', market: 'Bangkok', views: '842K views' },
  { image: 'gengar-detail-01.jpg', handle: '@linh.collects', market: 'Hanoi', views: '511K views' },
]

const COMPARE = [
  { label: 'Made in our own workshop', direct: 'Yes', market: 'Resold' },
  { label: '1-year warranty', direct: 'Included', market: 'Seller-dependent' },
  { label: 'Real human support', direct: 'WhatsApp', market: 'Chatbot' },
  { label: 'Exclusive drops', direct: 'Direct', market: 'Generic stock' },
]

const REVIEWS = [
  {
    quote:
      '“The glow is unreal at night. It looks like a tiny world on my desk — way better than the marketplace photos.”',
    name: 'Ari · Jakarta',
  },
  {
    quote:
      '“Ordered on TikTok, arrived in 8 days. The packaging alone feels like a collector piece.”',
    name: 'Mika · Bangkok',
  },
]

const FAQS = [
  {
    q: 'Where do you ship from?',
    a: 'Every lamp is made and packed in our workshop in China, then shipped with tracking. Delivery to Southeast Asia is typically 7–12 working days.',
  },
  {
    q: 'Can I pay on delivery?',
    a: 'COD is available in selected Southeast Asian markets. The exact option is shown at checkout based on your address.',
  },
  {
    q: 'What if it arrives damaged?',
    a: 'Send us a photo within 30 days and we will repair or replace it. Every piece is QC-checked and packed in protective foam.',
  },
  {
    q: 'Is this an official Pokémon product?',
    a: 'This is an independent fan-made collectible, not an official Pokémon Center release. All character artwork belongs to its respective owners.',
  },
]

const asset = (file: string) => `${import.meta.env.BASE_URL}images/${file}`
const money = (value: number) => `$${value.toFixed(0)}`

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

function Play() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 8h14l-1.2 11H6.2L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export default function App() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')

  const lines = useMemo(
    () =>
      PRODUCTS.filter((product) => (cart[product.id] ?? 0) > 0).map((product) => ({
        ...product,
        qty: cart[product.id],
      })),
    [cart],
  )

  const count = lines.reduce((total, line) => total + line.qty, 0)
  const subtotal = lines.reduce((total, line) => total + line.price * line.qty, 0)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!cartOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [cartOpen])

  const addToCart = (product: Product) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }))
    setToast(`${product.name} added to your cart`)
  }

  const changeQty = (id: string, delta: number) => {
    setCart((current) => {
      const next = (current[id] ?? 0) + delta
      if (next <= 0) {
        const copy = { ...current }
        delete copy[id]
        return copy
      }
      return { ...current, [id]: Math.min(99, next) }
    })
  }

  const removeLine = (id: string) => {
    setCart((current) => {
      const copy = { ...current }
      delete copy[id]
      return copy
    })
  }

  const addBundle = () => {
    setCart((current) => ({
      ...current,
      pikachu: (current.pikachu ?? 0) + 1,
      gengar: (current.gengar ?? 0) + 1,
    }))
    setToast('Collector bundle added to your cart')
    setCartOpen(true)
  }

  const checkout = () => {
    setCartOpen(false)
    setToast('Demo checkout — connect WooCommerce to take payments.')
  }

  return (
    <div className="site" id="top">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top" aria-label="POKÉLIGHT home">
            <span className="brand-mark" aria-hidden="true" />
            <span>POK<em>É</em>LIGHT</span>
          </a>

          <nav className="nav" aria-label="Primary">
            <a href="#shop">Shop</a>
            <a href="#craft">Our craft</a>
            <a href="#compare">Why direct</a>
            <a href="#reviews">Reviews</a>
          </nav>

          <div className="top-actions">
            <span className="made-pill">Made in China · own workshop</span>
            <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <CartIcon />
              {count > 0 && <span>{count}</span>}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media">
            <img src={asset('pikachu-detail-01.jpg')} alt="Pikachu resin lamp glowing on a desk" />
            <span className="media-pill">POV: your desk just became a Pokémon world</span>
            <a className="play-button" href="#craft" aria-label="See how the lamp is made">
              <Play />
            </a>
            <span className="media-views">◉ 2.3M views on TikTok</span>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">POKÉLIGHT · MADE IN CN</p>
            <h1 id="hero-title">
              The Pokémon lamp that <em>lights up the feed.</em>
            </h1>
            <p className="lead">
              Hand-cast crystal resin. Made in our own workshop in China. Direct from the maker — no marketplace
              markup.
            </p>
            <div className="price-line">
              <strong>{money(189)}</strong>
              <span>or 3 payments of $63 · free shipping over $150</span>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#shop">
                Shop the drop <Arrow />
              </a>
              <a className="btn btn-ghost" href="#craft">
                See how it's made <Play />
              </a>
            </div>
            <div className="trust-grid">
              <span><i>✓</i>Made in China · own workshop</span>
              <span><i>✓</i>1-year warranty</span>
              <span><i>✓</i>30-day returns</span>
              <span><i>✓</i>COD available</span>
            </div>
          </div>
        </section>

        <section className="maker" id="craft" aria-labelledby="maker-title">
          <div className="maker-media">
            <img src={asset('pikachu-detail-04.jpg')} alt="Pikachu lamp with packaging and accessories" />
            <span className="made-badge">Made in China</span>
            <a className="maker-play" href="#shop">
              <span>▶</span> Watch the workshop · 0:22
            </a>
          </div>
          <div className="maker-copy">
            <p className="eyebrow">Our workshop</p>
            <h2 id="maker-title">
              Made in our own workshop. <em>Not a marketplace.</em>
            </h2>
            <p className="lead">
              We sculpt, pour, and light every piece in our own studio in China. No middlemen. No marketplace markup.
              Just the maker, the materials, and the piece you take home.
            </p>
            <div className="steps">
              {STEPS.map((step) => (
                <div className="step" key={step.number}>
                  <strong>{step.number}</strong>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <a className="text-link" href="#compare">What changes when you buy direct? <Arrow /></a>
          </div>
        </section>

        <section className="ugc" aria-labelledby="ugc-title">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <p className="eyebrow">As seen on TikTok</p>
                <h2 id="ugc-title">Real rooms. <em>Real glow.</em></h2>
              </div>
              <a className="text-link" href="#shop">See all <Arrow /></a>
            </div>
            <div className="ugc-grid">
              {UGC.map((item) => (
                <article className="ugc-card" key={item.handle}>
                  <img src={asset(item.image)} alt={`${item.handle} POKÉLIGHT setup`} />
                  <span className="ugc-play"><Play /></span>
                  <div className="ugc-meta">
                    <strong>{item.handle}</strong>
                    <span>{item.views} · {item.market}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="shop" aria-labelledby="shop-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Pick your world</p>
              <h2 id="shop-title">Choose your <em>Pokémon.</em></h2>
            </div>
            <p className="section-note">Two collector editions. The same hand-built detail.</p>
          </div>
          <div className="product-grid">
            {PRODUCTS.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-media">
                  <img src={asset(product.image)} alt={`${product.name} collectible resin lamp`} />
                  <span className="product-tag" style={{ color: product.accent }}>Collector's Edition</span>
                </div>
                <div className="product-body">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.subtitle}</p>
                  </div>
                  <div className="product-bottom">
                    <strong>{money(product.price)}</strong>
                    <button className="btn btn-small btn-primary" type="button" onClick={() => addToCart(product)}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="compare" aria-labelledby="compare-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Why buy direct</p>
              <h2 id="compare-title">Skip the <em>middleman.</em></h2>
            </div>
            <p className="section-note">No mystery seller. No marketplace markup.</p>
          </div>
          <div className="compare-table">
            <div className="compare-row compare-head">
              <span>What you get</span>
              <span>POKÉLIGHT</span>
              <span>Marketplace</span>
            </div>
            {COMPARE.map((row) => (
              <div className="compare-row" key={row.label}>
                <span>{row.label}</span>
                <span className="yes">{row.direct}</span>
                <span className="muted">{row.market}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="bundle-title">
          <div className="bundle">
            <div className="bundle-images" aria-hidden="true">
              <img src={asset('pikachu-01.jpg')} alt="" />
              <img src={asset('gengar-01.jpg')} alt="" />
            </div>
            <div className="bundle-copy">
              <p className="eyebrow">Collector bundle</p>
              <h2 id="bundle-title">Any two lamps. <em>15% off.</em></h2>
              <p>Build a shelf worth filming. Free shipping and a numbered collector card included.</p>
              <button className="btn btn-primary" type="button" onClick={addBundle}>
                Build my bundle <Arrow />
              </button>
            </div>
          </div>
        </section>

        <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Collector feedback</p>
              <h2 id="reviews-title">Loved in <em>real rooms.</em></h2>
            </div>
            <p className="section-note">Illustrative reviews for this prototype.</p>
          </div>
          <div className="review-grid">
            {REVIEWS.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                <p>{review.quote}</p>
                <span>{review.name}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Before you order</p>
              <h2 id="faq-title">Good to <em>know.</em></h2>
            </div>
          </div>
          <div className="faq">
            {FAQS.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true" />
            <span>POK<em>É</em>LIGHT</span>
          </a>
          <p>Hand-built resin dioramas. Made in our own workshop in China.</p>
        </div>
        <div className="footer-links">
          <a href="#shop">Shop</a>
          <a href="#craft">Our craft</a>
          <a href="#compare">Why direct</a>
          <a href="mailto:studio@pokelight.example">Contact</a>
        </div>
        <p className="footer-note">
          Concept prototype for “made in cn”. Reviews, shipping times and COD availability are placeholders.
        </p>
      </footer>

      <div className="sticky-buy">
        <div>
          <strong>From $179</strong>
          <span>Free shipping · COD</span>
        </div>
        <a className="btn btn-primary" href="#shop">
          Shop now <Arrow />
        </a>
      </div>

      {toast && !cartOpen && <div className="toast" role="status">{toast}</div>}

      {cartOpen && (
        <>
          <button className="cart-overlay" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" />
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
            <header>
              <h2>Your cart {count > 0 ? `(${count})` : ''}</h2>
              <button className="icon-button" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
                <CloseIcon />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="cart-empty">
                <span><CartIcon /></span>
                <p>Your cart is empty.</p>
                <button className="btn btn-ghost btn-small" type="button" onClick={() => setCartOpen(false)}>
                  Keep exploring
                </button>
              </div>
            ) : (
              <>
                <div className="cart-lines">
                  {lines.map((line) => (
                    <div className="cart-line" key={line.id}>
                      <img src={asset(line.image)} alt={line.name} />
                      <div className="cart-line-copy">
                        <strong>{line.name}</strong>
                        <span>{money(line.price)} each</span>
                        <div className="qty">
                          <button type="button" onClick={() => changeQty(line.id, -1)} aria-label={`Decrease ${line.name}`}>−</button>
                          <span>{line.qty}</span>
                          <button type="button" onClick={() => changeQty(line.id, 1)} aria-label={`Increase ${line.name}`}>+</button>
                        </div>
                      </div>
                      <button className="remove" type="button" onClick={() => removeLine(line.id)}>Remove</button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                  <button className="btn btn-primary" type="button" onClick={checkout}>Checkout <Arrow /></button>
                  <p>Demo checkout. Connect WooCommerce to take payments.</p>
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </div>
  )
}
