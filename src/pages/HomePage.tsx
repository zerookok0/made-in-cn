import { AppLink } from '../components/AppLink'
import { ProductCard } from '../components/ProductCard'
import { resolveImage } from '../data/images'
import { defaultHome } from '../data/content'
import { formatPrice, getProductById, products } from '../data/products'
import { site } from '../data/site'
import { useCart } from '../lib/cart'
import { useDocumentMeta } from '../lib/router'

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

const STEPS = [
  { number: '01', title: 'Find the workshop', body: 'A person, a place and a material we can trace — not a listing.' },
  { number: '02', title: 'Check the making', body: 'We look at the process, the finishing and the details that survive years.' },
  { number: '03', title: 'Send it direct', body: 'Packed by the studio and shipped with tracking. No marketplace in between.' },
]

const UGC = [
  { image: '/images/products/pikachu/pikachu-detail-02.jpg', handle: '@raka.setups', market: 'Jakarta', views: '1.2M views' },
  { image: '/images/products/9564/1-6.jpg', handle: '@linh.tea', market: 'Hanoi', views: '842K views' },
  { image: '/images/products/gengar/gengar-detail-01.jpg', handle: '@midnight.shelf', market: 'Bangkok', views: '511K views' },
]

const REVIEWS = [
  {
    quote:
      '“The lamp looks like a tiny world on my desk. The packaging alone feels like a collector piece — and it arrived faster than expected.”',
    name: 'Ari · Jakarta',
  },
  {
    quote:
      '“I bought the lacquer cup for my mother. The certificate and gift box made it feel like a real object, not an online order.”',
    name: 'Mai · Ho Chi Minh City',
  },
]

const FAQS = [
  {
    q: 'Where do you ship from?',
    a: 'Every object is made and packed by the partner studio in China, then shipped with tracking. Delivery to Southeast Asia is typically 7–12 working days.',
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
    q: 'Are the Pokémon lamps official products?',
    a: 'They are independent fan-made collectibles, not official Pokémon Center releases. All character artwork belongs to its respective owners.',
  },
  {
    q: 'How do I know who made it?',
    a: 'Each collection names its maker or studio, the material and the place. The tea cup, for example, is by Master Lin Jianjun in Dehua.',
  },
]

export function HomePage() {
  const { addItem, openCart } = useCart()
  const heritage = products.find((product) => product.collection === 'heritage')
  const featured = products.filter((product) => product.featured).slice(0, 3)
  const minUsd = Math.min(...products.filter((product) => product.currency === 'USD').map((product) => product.price))

  useDocumentMeta(`${site.brand} — Objects made in China`, site.tagline)

  const addBundle = () => {
    const pikachu = getProductById('pikachu')
    const gengar = getProductById('gengar')
    if (pikachu) addItem(pikachu)
    if (gengar) addItem(gengar)
    openCart()
  }

  const addHeritage = () => {
    if (!heritage) return
    const result = addItem(heritage)
    if (result === 'added') openCart()
  }

  return (
    <div className="site">
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media">
            <img src={resolveImage('/images/products/pikachu/pikachu-detail-01.jpg')} alt="Pikachu resin lamp glowing on a desk" />
            <span className="media-pill">POV: your desk just became a conversation</span>
            <AppLink href="/craft" className="play-button" ariaLabel="Read how these objects are made">
              <Play />
            </AppLink>
            <span className="media-views">◉ 2.3M views on TikTok</span>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">{defaultHome.hero.kicker}</p>
            <h1 id="hero-title">
              {defaultHome.hero.titleLine1} <em>{defaultHome.hero.titleLine2}</em>
            </h1>
            <p className="lead">{defaultHome.hero.lead}</p>
            <p className="hero-sub">{defaultHome.hero.sub}</p>
            <div className="price-line">
              <strong>From {formatPrice(minUsd, 'USD')}</strong>
              <span>New heritage drop · free shipping over $150</span>
            </div>
            <div className="hero-actions">
              <AppLink className="btn btn-primary" href="/shop">
                {defaultHome.hero.ctaPrimary} <Arrow />
              </AppLink>
              <AppLink className="btn btn-ghost" href="/craft">
                {defaultHome.hero.ctaSecondary} <Play />
              </AppLink>
            </div>
            <div className="trust-grid">
              <span><i>✓</i>Made in China · own workshops</span>
              <span><i>✓</i>1-year warranty</span>
              <span><i>✓</i>30-day returns</span>
              <span><i>✓</i>COD available</span>
            </div>
          </div>
        </section>

        <section className="maker" id="craft" aria-labelledby="maker-title">
          <div className="maker-media">
            <img src={resolveImage('/images/products/9564/1-4.jpg')} alt="Maker's signature on the base of a handmade lacquer tea cup" />
            <span className="made-badge">Made in China</span>
            <AppLink className="maker-play" href="/craft">
              <span>▶</span> Read the craft notes · 2 min
            </AppLink>
          </div>
          <div className="maker-copy">
            <p className="eyebrow">{defaultHome.maker.eyebrow}</p>
            <h2 id="maker-title">
              {defaultHome.maker.titleLine1} <em>{defaultHome.maker.titleLine2}</em>
            </h2>
            <p className="lead">{defaultHome.maker.body}</p>
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
            <AppLink className="text-link" href="/craft">
              {defaultHome.maker.cta} <Arrow />
            </AppLink>
          </div>
        </section>

        <section className="ugc" aria-labelledby="ugc-title">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <p className="eyebrow">As seen on TikTok</p>
                <h2 id="ugc-title">Real rooms. <em>Real hands.</em></h2>
              </div>
              <AppLink className="text-link" href="/shop">
                See all <Arrow />
              </AppLink>
            </div>
            <div className="ugc-grid">
              {UGC.map((item) => (
                <article className="ugc-card" key={item.handle}>
                  <img src={resolveImage(item.image)} alt={`${item.handle} MADE IN CN setup`} loading="lazy" />
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
              <p className="eyebrow">{defaultHome.shop.eyebrow}</p>
              <h2 id="shop-title">{defaultHome.shop.title}</h2>
            </div>
            <p className="section-note">{defaultHome.shop.note}</p>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="section-footer">
            <AppLink className="text-link" href="/shop">
              {defaultHome.shop.cta} <Arrow />
            </AppLink>
          </div>
        </section>

        {heritage && (
          <section className="section heritage-section" id="heritage" aria-labelledby="heritage-title">
            <div className="heritage-card">
              <div className="heritage-media">
                <img src={resolveImage(heritage.images[0])} alt={heritage.name} loading="lazy" />
                <span className="heritage-stamp">
                  MADE IN CN
                  <b>Heritage</b>
                </span>
                <span className="heritage-caption">Dehua, China · 65 ml</span>
              </div>

              <div className="heritage-copy">
                <p className="eyebrow">{defaultHome.heritage.eyebrow}</p>
                <h2 id="heritage-title">
                  {defaultHome.heritage.titleLine1} <em>{defaultHome.heritage.titleLine2}</em>
                </h2>
                <p className="lead">{defaultHome.heritage.body}</p>
                <div className="heritage-meta">
                  <span>Handmade lacquer</span>
                  <span>Dehua celadon</span>
                  <span>Gift box included</span>
                </div>
                <div className="heritage-price">
                  <strong>{formatPrice(heritage.price, heritage.currency)}</strong>
                  <span>Product ID {heritage.id}</span>
                </div>
                <div className="heritage-actions">
                  <AppLink className="btn btn-primary" href={`/collection/${heritage.slug}`}>
                    {defaultHome.heritage.cta} <Arrow />
                  </AppLink>
                  <button className="btn btn-ghost" type="button" onClick={addHeritage}>
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="section" id="compare" aria-labelledby="compare-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">{defaultHome.compare.eyebrow}</p>
              <h2 id="compare-title">{defaultHome.compare.title}</h2>
            </div>
            <p className="section-note">{defaultHome.compare.note}</p>
          </div>
          <div className="compare-table">
            <div className="compare-row compare-head">
              <span>What you get</span>
              <span>MADE IN CN</span>
              <span>Marketplace</span>
            </div>
            {defaultHome.compare.rows.map((row) => (
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
              <img src={resolveImage('/images/products/pikachu/pikachu-01.jpg')} alt="" loading="lazy" />
              <img src={resolveImage('/images/products/gengar/gengar-01.jpg')} alt="" loading="lazy" />
            </div>
            <div className="bundle-copy">
              <p className="eyebrow">{defaultHome.bundle.eyebrow}</p>
              <h2 id="bundle-title">
                {defaultHome.bundle.titleLine1} <em>{defaultHome.bundle.titleLine2}</em>
              </h2>
              <p>{defaultHome.bundle.body}</p>
              <button className="btn btn-primary" type="button" onClick={addBundle}>
                {defaultHome.bundle.cta} <Arrow />
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

        <section className="closing">
          <p className="eyebrow">{defaultHome.closing.eyebrow}</p>
          <h2>
            {defaultHome.closing.titleLine1} <em>{defaultHome.closing.titleLine2}</em>
          </h2>
          <p>{defaultHome.closing.body}</p>
          <div className="closing-actions">
            <AppLink className="btn btn-primary" href="/shop">
              {defaultHome.closing.ctaPrimary} <Arrow />
            </AppLink>
            <AppLink className="btn btn-ghost" href="/craft">
              {defaultHome.closing.ctaSecondary}
            </AppLink>
          </div>
        </section>
      </main>
    </div>
  )
}
