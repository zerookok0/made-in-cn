import { AppLink } from '../components/AppLink'
import { ProductCard } from '../components/ProductCard'
import { resolveImage } from '../data/images'
import { defaultHome, defaultHomeVi } from '../data/content'
import { formatPrice, getProductById, products } from '../data/products'
import { useI18n } from '../i18n'
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

const HOME_STATIC = {
  en: {
    heroAlt: 'Pikachu resin lamp glowing on a desk',
    mediaPill: 'POV: your desk just became a conversation',
    mediaViews: '◉ 2.3M views on TikTok',
    playAria: 'Read how these objects are made',
    from: 'From',
    shippingNote: 'New heritage drop · free shipping over $150',
    trust: ['Made in China · own workshops', '1-year warranty', '30-day returns', 'COD available'],
    steps: [
      { title: 'Find the workshop', body: 'A person, a place and a material we can trace — not a listing.' },
      { title: 'Check the making', body: 'We look at the process, the finishing and the details that survive years.' },
      { title: 'Send it direct', body: 'Packed by the studio and shipped with tracking. No marketplace in between.' },
    ],
    ugcEyebrow: 'As seen on TikTok',
    ugcTitle1: 'Real rooms.',
    ugcTitle2: 'Real hands.',
    ugcCta: 'See all',
    ugc: [
      { image: '/images/products/pikachu/pikachu-detail-02.jpg', handle: '@raka.setups', market: 'Jakarta', views: '1.2M views' },
      { image: '/images/products/9564/1-6.jpg', handle: '@linh.tea', market: 'Hanoi', views: '842K views' },
      { image: '/images/products/gengar/gengar-detail-01.jpg', handle: '@midnight.shelf', market: 'Bangkok', views: '511K views' },
    ],
    compareHead: ['What you get', 'MADE IN CN', 'Marketplace'],
    heritageMeta: ['Handmade lacquer', 'Dehua celadon', 'Gift box included'],
    productId: 'Product ID',
    reviewsEyebrow: 'Collector feedback',
    reviewsTitle1: 'Loved in',
    reviewsTitle2: 'real rooms.',
    reviewsNote: 'Illustrative reviews for this prototype.',
    reviews: [
      {
        quote: '“The lamp looks like a tiny world on my desk. The packaging alone feels like a collector piece — and it arrived faster than expected.”',
        name: 'Ari · Jakarta',
      },
      {
        quote: '“I bought the lacquer cup for my mother. The certificate and gift box made it feel like a real object, not an online order.”',
        name: 'Mai · Ho Chi Minh City',
      },
    ],
    faqEyebrow: 'Before you order',
    faqTitle1: 'Good to',
    faqTitle2: 'know.',
    faqs: [
      { q: 'Where do you ship from?', a: 'Every object is made and packed by the partner studio in China, then shipped with tracking. Delivery to Southeast Asia is typically 7–12 working days.' },
      { q: 'Can I pay on delivery?', a: 'COD is available in selected Southeast Asian markets. The exact option is shown at checkout based on your address.' },
      { q: 'What if it arrives damaged?', a: 'Send us a photo within 30 days and we will repair or replace it. Every piece is QC-checked and packed in protective foam.' },
      { q: 'Are the Pokémon lamps official products?', a: 'They are independent fan-made collectibles, not official Pokémon Center releases. All character artwork belongs to its respective owners.' },
      { q: 'How do I know who made it?', a: 'Each collection names its maker or studio, the material and the place. The tea cup, for example, is by Master Lin Jianjun in Dehua.' },
    ],
  },
  vi: {
    heroAlt: 'Đèn resin Pikachu phát sáng trên bàn làm việc',
    mediaPill: 'POV: bàn làm việc của bạn vừa trở thành câu chuyện',
    mediaViews: '◉ 2,3 triệu lượt xem trên TikTok',
    playAria: 'Đọc cách những món đồ này được làm',
    from: 'Từ',
    shippingNote: 'Bộ sưu tập Di sản mới · miễn phí giao hàng cho đơn từ $150',
    trust: ['Sản xuất tại Trung Quốc · xưởng riêng', 'Bảo hành 1 năm', 'Đổi trả 30 ngày', 'Có COD'],
    steps: [
      { title: 'Tìm xưởng', body: 'Một con người, một nơi chốn và một chất liệu có thể truy nguyên — không phải một trang bán hàng.' },
      { title: 'Xem cách làm', body: 'Chúng tôi xem quy trình, cách hoàn thiện và những chi tiết còn lại qua nhiều năm.' },
      { title: 'Gửi trực tiếp', body: 'Đóng gói tại xưởng và gửi kèm mã theo dõi. Không có sàn thương mại ở giữa.' },
    ],
    ugcEyebrow: 'Được thấy trên TikTok',
    ugcTitle1: 'Phòng thật.',
    ugcTitle2: 'Bàn tay thật.',
    ugcCta: 'Xem tất cả',
    ugc: [
      { image: '/images/products/pikachu/pikachu-detail-02.jpg', handle: '@raka.setups', market: 'Jakarta', views: '1,2 triệu lượt xem' },
      { image: '/images/products/9564/1-6.jpg', handle: '@linh.tea', market: 'Hà Nội', views: '842 nghìn lượt xem' },
      { image: '/images/products/gengar/gengar-detail-01.jpg', handle: '@midnight.shelf', market: 'Bangkok', views: '511 nghìn lượt xem' },
    ],
    compareHead: ['Bạn nhận được', 'MADE IN CN', 'Chợ trực tuyến'],
    heritageMeta: ['Sơn mài thủ công', 'Sứ thanh hóa Đức Hóa', 'Kèm hộp quà'],
    productId: 'Mã sản phẩm',
    reviewsEyebrow: 'Phản hồi từ người sưu tầm',
    reviewsTitle1: 'Được yêu thích trong',
    reviewsTitle2: 'những căn phòng thật.',
    reviewsNote: 'Đánh giá minh họa cho bản thử nghiệm.',
    reviews: [
      { quote: '“Chiếc đèn như một thế giới nhỏ trên bàn tôi. Riêng phần đóng gói đã giống một món sưu tầm — và hàng đến nhanh hơn tôi nghĩ.”', name: 'Ari · Jakarta' },
      { quote: '“Tôi mua chén sơn mài cho mẹ. Chứng nhận và hộp quà khiến nó giống một món đồ thật, không phải đơn hàng online.”', name: 'Mai · TP. Hồ Chí Minh' },
    ],
    faqEyebrow: 'Trước khi đặt hàng',
    faqTitle1: 'Điều cần',
    faqTitle2: 'biết.',
    faqs: [
      { q: 'Hàng gửi từ đâu?', a: 'Mỗi món được làm và đóng gói tại xưởng đối tác ở Trung Quốc, sau đó gửi kèm mã theo dõi. Giao đến Đông Nam Á thường mất 7–12 ngày làm việc.' },
      { q: 'Có thanh toán khi nhận hàng không?', a: 'COD có ở một số thị trường Đông Nam Á. Tùy chọn chính xác được hiển thị khi thanh toán theo địa chỉ của bạn.' },
      { q: 'Nếu hàng đến bị hỏng thì sao?', a: 'Gửi ảnh cho chúng tôi trong vòng 30 ngày, chúng tôi sẽ sửa hoặc thay. Mọi sản phẩm đều được kiểm tra và đóng gói với xốp bảo vệ.' },
      { q: 'Đèn Pokémon có phải hàng chính thức không?', a: 'Đây là đồ sưu tầm độc lập do người hâm mộ làm, không phải bản phát hành chính thức của Pokémon Center. Bản quyền nhân vật thuộc về chủ sở hữu tương ứng.' },
      { q: 'Làm sao biết ai đã làm ra món đồ?', a: 'Mỗi bộ sưu tập nêu tên người làm hoặc xưởng, chất liệu và nơi chốn. Ví dụ, chén trà do nghệ nhân Lin Jianjun làm tại Đức Hóa.' },
    ],
  },
} as const

export function HomePage() {
  const { locale, t } = useI18n()
  const { addItem, openCart } = useCart()
  const home = locale === 'vi' ? defaultHomeVi : defaultHome
  const copy = HOME_STATIC[locale]
  const heritage = products.find((product) => product.collection === 'heritage')
  const featured = products.filter((product) => product.featured).slice(0, 3)
  const minProduct = products.reduce((min, product) => (product.price < min.price ? product : min), products[0])

  useDocumentMeta(t('meta.homeTitle'), t('meta.homeDesc'))

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
            <img src={resolveImage('/images/products/pikachu/pikachu-detail-01.jpg')} alt={copy.heroAlt} />
            <span className="media-pill">{copy.mediaPill}</span>
            <AppLink href="/craft" className="play-button" ariaLabel={copy.playAria}>
              <Play />
            </AppLink>
            <span className="media-views">{copy.mediaViews}</span>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">{home.hero.kicker}</p>
            <h1 id="hero-title">
              {home.hero.titleLine1} <em>{home.hero.titleLine2}</em>
            </h1>
            <p className="lead">{home.hero.lead}</p>
            <p className="hero-sub">{home.hero.sub}</p>
            <div className="price-line">
              <strong>{copy.from} {formatPrice(minProduct.price, minProduct.currency)}</strong>
              <span>{copy.shippingNote}</span>
            </div>
            <div className="hero-actions">
              <AppLink className="btn btn-primary" href="/shop">
                {home.hero.ctaPrimary} <Arrow />
              </AppLink>
              <AppLink className="btn btn-ghost" href="/craft">
                {home.hero.ctaSecondary} <Play />
              </AppLink>
            </div>
            <div className="trust-grid">
              {copy.trust.map((item) => <span key={item}><i>✓</i>{item}</span>)}
            </div>
          </div>
        </section>

        <section className="maker" id="craft" aria-labelledby="maker-title">
          <div className="maker-media">
            <img src={resolveImage('/images/products/9564/1-4.jpg')} alt="Maker's signature on the base of a handmade lacquer tea cup" />
            <span className="made-badge">Made in China</span>
            <AppLink className="maker-play" href="/craft">
              <span>▶</span> {t('home.craftNote')}
            </AppLink>
          </div>
          <div className="maker-copy">
            <p className="eyebrow">{home.maker.eyebrow}</p>
            <h2 id="maker-title">
              {home.maker.titleLine1} <em>{home.maker.titleLine2}</em>
            </h2>
            <p className="lead">{home.maker.body}</p>
            <div className="steps">
              {copy.steps.map((step, index) => (
                <div className="step" key={step.title}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <AppLink className="text-link" href="/craft">
              {home.maker.cta} <Arrow />
            </AppLink>
          </div>
        </section>

        <section className="ugc" aria-labelledby="ugc-title">
          <div className="section-inner">
            <div className="section-head">
              <div>
                <p className="eyebrow">{copy.ugcEyebrow}</p>
                <h2 id="ugc-title">{copy.ugcTitle1} <em>{copy.ugcTitle2}</em></h2>
              </div>
              <AppLink className="text-link" href="/shop">
                {copy.ugcCta} <Arrow />
              </AppLink>
            </div>
            <div className="ugc-grid">
              {copy.ugc.map((item) => (
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
              <p className="eyebrow">{home.shop.eyebrow}</p>
              <h2 id="shop-title">{home.shop.title}</h2>
            </div>
            <p className="section-note">{home.shop.note}</p>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="section-footer">
            <AppLink className="text-link" href="/shop">
              {home.shop.cta} <Arrow />
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
                <span className="heritage-caption">{t('home.heritageCaption')}</span>
              </div>

              <div className="heritage-copy">
                <p className="eyebrow">{home.heritage.eyebrow}</p>
                <h2 id="heritage-title">
                  {home.heritage.titleLine1} <em>{home.heritage.titleLine2}</em>
                </h2>
                <p className="lead">{home.heritage.body}</p>
                <div className="heritage-meta">
                  {copy.heritageMeta.map((item) => <span key={item}>{item}</span>)}
                </div>
                <div className="heritage-price">
                  <strong>{formatPrice(heritage.price, heritage.currency)}</strong>
                  <span>{copy.productId} {heritage.id}</span>
                </div>
                <div className="heritage-actions">
                  <AppLink className="btn btn-primary" href={`/collection/${heritage.slug}`}>
                    {home.heritage.cta} <Arrow />
                  </AppLink>
                  <button className="btn btn-ghost" type="button" onClick={addHeritage}>
                    {t('common.addToCart')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="section" id="compare" aria-labelledby="compare-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">{home.compare.eyebrow}</p>
              <h2 id="compare-title">{home.compare.title}</h2>
            </div>
            <p className="section-note">{home.compare.note}</p>
          </div>
          <div className="compare-table">
            <div className="compare-row compare-head">
              {copy.compareHead.map((item) => <span key={item}>{item}</span>)}
            </div>
            {home.compare.rows.map((row) => (
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
              <p className="eyebrow">{home.bundle.eyebrow}</p>
              <h2 id="bundle-title">
                {home.bundle.titleLine1} <em>{home.bundle.titleLine2}</em>
              </h2>
              <p>{home.bundle.body}</p>
              <button className="btn btn-primary" type="button" onClick={addBundle}>
                {home.bundle.cta} <Arrow />
              </button>
            </div>
          </div>
        </section>

        <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">{copy.reviewsEyebrow}</p>
              <h2 id="reviews-title">{copy.reviewsTitle1} <em>{copy.reviewsTitle2}</em></h2>
            </div>
            <p className="section-note">{copy.reviewsNote}</p>
          </div>
          <div className="review-grid">
            {copy.reviews.map((review) => (
              <article className="review-card" key={review.name}>
                <div className="stars" aria-label={t('home.starsAria')}>★★★★★</div>
                <p>{review.quote}</p>
                <span>{review.name}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">{copy.faqEyebrow}</p>
              <h2 id="faq-title">{copy.faqTitle1} <em>{copy.faqTitle2}</em></h2>
            </div>
          </div>
          <div className="faq">
            {copy.faqs.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="closing">
          <p className="eyebrow">{home.closing.eyebrow}</p>
          <h2>
            {home.closing.titleLine1} <em>{home.closing.titleLine2}</em>
          </h2>
          <p>{home.closing.body}</p>
          <div className="closing-actions">
            <AppLink className="btn btn-primary" href="/shop">
              {home.closing.ctaPrimary} <Arrow />
            </AppLink>
            <AppLink className="btn btn-ghost" href="/craft">
              {home.closing.ctaSecondary}
            </AppLink>
          </div>
        </section>
      </main>
    </div>
  )
}
