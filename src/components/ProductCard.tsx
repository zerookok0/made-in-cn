import type { CSSProperties } from 'react'
import { resolveImage } from '../data/images'
import { formatPrice, productNameFor, productSubtitleFor } from '../data/products'
import { useI18n } from '../i18n'
import { useCart } from '../lib/cart'
import type { Product } from '../data/types'
import { AppLink } from './AppLink'

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useI18n()
  const { addItem, openCart } = useCart()
  const collectionLabel = t(`collection.${product.collection}`)
  const canBuy = Boolean(product.wooId) && product.availability !== 'enquire' && product.price > 0

  const handleAdd = () => {
    const result = addItem(product)
    if (result === 'added') openCart()
  }

  return (
    <article
      className="product-card"
      style={{ '--card-accent': product.accent ?? '#a33a2e' } as CSSProperties}
    >
      <AppLink href={`/collection/${product.slug}`} className="product-media-link" ariaLabel={productNameFor(product, locale)}>
        <div className="product-media">
          <img src={resolveImage(product.images[0], 900)} alt={`${productNameFor(product, locale)} by MADE IN CN`} loading="lazy" />
          <span className="product-tag">{collectionLabel}</span>
        </div>
      </AppLink>

      <div className="product-body">
        <div>
          <p className="product-kicker">{collectionLabel}</p>
          <h3>
            <AppLink href={`/collection/${product.slug}`}>{productNameFor(product, locale)}</AppLink>
          </h3>
          <p>{productSubtitleFor(product, locale)}</p>
        </div>
        <div className="product-bottom">
          <strong>{product.price > 0 ? formatPrice(product.price, product.currency) : t('product.priceOnRequest')}</strong>
          {canBuy ? (
            <button className="btn btn-small btn-primary" type="button" onClick={handleAdd}>
              {t('common.addToCart')}
            </button>
          ) : (
            <AppLink className="btn btn-small btn-ghost" href={`/collection/${product.slug}`}>
              {t('product.viewDetails')}
            </AppLink>
          )}
        </div>
      </div>
    </article>
  )
}
