import { useEffect, useRef, useState } from 'react'
import { asset } from './lib/asset'
import { money } from './lib/money'
import type { DetailedProduct, Language, Product } from './types'

interface ProductDetailProps {
  product: DetailedProduct
  onClose: () => void
  onAdd: (product: Product) => void
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
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

export default function ProductDetail({ product, onClose, onAdd }: ProductDetailProps) {
  const [language, setLanguage] = useState<Language>(() =>
    typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('vi') ? 'vi' : 'en',
  )
  const [activeImage, setActiveImage] = useState(0)
  const closeButton = useRef<HTMLButtonElement>(null)
  const copy = product.copy[language]
  const image = product.gallery[activeImage] ?? product.gallery[0]

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <>
      <button className="pd-overlay" type="button" onClick={onClose} aria-label="Close product details" />

      <article className="pd" role="dialog" aria-modal="true" aria-labelledby="pd-title">
        <header className="pd-topbar">
          <span>
            MADE IN CN <i>/</i> HERITAGE
          </span>
          <button
            ref={closeButton}
            className="icon-button pd-close"
            type="button"
            onClick={onClose}
            aria-label="Close product details"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="pd-grid">
          <div className="pd-gallery">
            <div className="pd-main">
              <img src={asset(image.full)} alt={image.alt} />
              <span className="pd-main-badge">Handmade · ID {product.id}</span>
            </div>

            <div className="pd-thumbs" role="group" aria-label="Product images">
              {product.gallery.map((item, index) => (
                <button
                  className={`pd-thumb${index === activeImage ? ' is-active' : ''}`}
                  type="button"
                  key={item.full}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={index === activeImage}
                >
                  <img src={asset(item.thumb)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div className="pd-copy">
            <div className="pd-topline">
              <p className="eyebrow">{copy.eyebrow}</p>
              <div className="lang-switch" role="group" aria-label="Product language">
                <button
                  type="button"
                  className={language === 'en' ? 'is-active' : ''}
                  onClick={() => setLanguage('en')}
                  aria-pressed={language === 'en'}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={language === 'vi' ? 'is-active' : ''}
                  onClick={() => setLanguage('vi')}
                  aria-pressed={language === 'vi'}
                >
                  VI
                </button>
              </div>
            </div>

            <h2 id="pd-title">{copy.title}</h2>
            <p className="pd-subtitle">{copy.subtitle}</p>

            <div className="pd-price">
              <strong>{money(product.price, product.currency)}</strong>
              <span>Product ID {product.id}</span>
            </div>

            <div className="pd-perks">
              <span>Made in China</span>
              <span>Gift box & certificate</span>
              <span>Hand-finished</span>
            </div>

            <div className="pd-actions">
              <button className="btn btn-primary" type="button" onClick={() => onAdd(product)}>
                Add to cart <Arrow />
              </button>
              <a className="btn btn-ghost" href="#shop" onClick={onClose}>
                Continue browsing
              </a>
            </div>

            <dl className="pd-specs">
              {copy.specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="pd-description">
              <h3>{language === 'en' ? 'The craft' : 'Câu chuyện chế tác'}</h3>
              {copy.description.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <p className="pd-note">{copy.note}</p>
          </div>
        </div>
      </article>
    </>
  )
}
