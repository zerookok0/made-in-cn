import { useEffect, useState } from 'react'
import { AppLink } from '../components/AppLink'
import { ProductCard } from '../components/ProductCard'
import { resolveImage } from '../data/images'
import {
  collectionLabel,
  formatPrice,
  getProduct,
  getRelated,
  productDisplayTitle,
  productNameFor,
  specsFor,
} from '../data/products'
import type { Product } from '../data/types'
import { useI18n } from '../i18n'
import { useCart } from '../lib/cart'
import { useDocumentMeta } from '../lib/router'

function copyFor(product: Product, language: 'en' | 'vi') {
  const translation = language === 'vi' ? product.translations?.vi : undefined
  return {
    name: translation?.name ?? product.name,
    title: translation?.headline ?? translation?.name ?? productDisplayTitle(product),
    subtitle: translation?.subtitle ?? product.subtitle,
    description: translation?.description ?? product.description,
    note: translation?.note ?? product.note,
    specs: specsFor(product, language),
  }
}

export function ProductPage({ slug }: { slug: string }) {
  const { locale, t } = useI18n()
  const product = getProduct(slug)
  const { addItem, openCart } = useCart()
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setActiveImage(0)
    setQty(1)
    setMessage('')
  }, [slug])

  const copy = product ? copyFor(product, locale) : null
  useDocumentMeta(
    product ? `${copy?.title ?? productNameFor(product, locale)} | MADE IN CN` : `${t('product.notFoundTitle')} | MADE IN CN`,
    product ? (product.seoDescription ?? copy?.subtitle) : t('product.notFoundBody'),
  )

  if (!product || !copy) {
    return (
      <section className="missing-page">
        <p className="eyebrow">{t('product.notFoundEyebrow')}</p>
        <h1>{t('product.notFoundTitle')}</h1>
        <p>{t('product.notFoundBody')}</p>
        <AppLink className="btn btn-primary" href="/shop">{t('product.notFoundCta')}</AppLink>
      </section>
    )
  }

  const collection = collectionLabel(product.collection, locale)
  const available = product.availability === 'available' || product.availability === 'made-to-order'
  const related = getRelated(product)
  const detailCaptions =
    locale === 'vi' ? (product.detailCaptionsVi ?? product.detailCaptions) : product.detailCaptions

  const handleAdd = () => {
    setMessage('')
    const result = addItem(product, { qty })
    if (result === 'added') {
      openCart()
      return
    }
    if (result === 'unavailable') setMessage(t('product.enquireNote'))
    else if (result === 'no-store-id') setMessage(t('product.storeNote'))
    else setMessage(t('product.sizeNote'))
  }

  return (
    <div className="product-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <AppLink href="/">{t('product.breadcrumbHome')}</AppLink>
        <span>/</span>
        <AppLink href="/shop">{t('product.breadcrumbShop')}</AppLink>
        <span>/</span>
        <span aria-current="page">{copy.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-gallery">
          <div className="product-detail-media">
            <img src={resolveImage(product.images[activeImage], 1600)} alt={`${copy.name} view ${activeImage + 1}`} />
            <span className="product-detail-badge">{collection}</span>
          </div>

          {product.images.length > 1 && (
            <div className="product-thumbs" role="tablist" aria-label={`${copy.name} images`}>
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  role="tab"
                  aria-selected={index === activeImage}
                  aria-label={`Show image ${index + 1}`}
                  className={`product-thumb ${index === activeImage ? 'is-active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={resolveImage(image, 260)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <p className="eyebrow">{collection} · {product.year}</p>
          <h1>{copy.title}</h1>
          <p className="product-detail-subtitle">{copy.subtitle}</p>

          <div className="product-detail-buyline">
            <strong>{formatPrice(product.price, product.currency)}</strong>
            <span className={available ? 'stock is-available' : 'stock'}>{t(`avail.${product.availability}`)}</span>
          </div>

          <p className="product-detail-desc">{copy.description}</p>

          <div className="product-detail-actions">
            <div className="qty product-qty">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((value) => Math.min(99, value + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-primary" type="button" onClick={handleAdd} disabled={!available}>
              {t('product.add')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          {message && <p className="product-action-note">{message}</p>}

          <p className="product-detail-note">{t('product.checkoutNote')}</p>

          <dl className="product-specs-list">
            {copy.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>

          {copy.note && <p className="product-note">{copy.note}</p>}
        </div>
      </div>

      {product.detailImages && product.detailImages.length > 0 && (
        <section className="product-detail-gallery" aria-labelledby="detail-gallery-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t('product.inTheHand')}</p>
              <h2 id="detail-gallery-title">{t('product.detailTitle1')} <em>{t('product.detailTitle2')}</em></h2>
            </div>
          </div>
          <div className="detail-gallery-grid">
            {product.detailImages.map((image, index) => {
              const caption = detailCaptions?.[index] ?? `Detail ${index + 1}`
              return (
                <figure className="detail-gallery-item" key={image}>
                  <img src={resolveImage(image, 1000)} alt={`${copy.name} — ${caption}`} loading="lazy" />
                  <figcaption>{caption}</figcaption>
                </figure>
              )
            })}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="product-related">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t('product.relatedEyebrow')}</p>
              <h2>{t('product.relatedTitle1')} <em>{t('product.relatedTitle2')}</em></h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}
