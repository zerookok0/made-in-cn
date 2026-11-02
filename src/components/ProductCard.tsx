import type { CSSProperties } from 'react'
import { resolveImage } from '../data/images'
import { collections, formatPrice } from '../data/products'
import { useCart } from '../lib/cart'
import type { Product } from '../data/types'
import { AppLink } from './AppLink'

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const collectionLabel =
    collections.find((item) => item.id === product.collection)?.label ?? 'MADE IN CN'

  const handleAdd = () => {
    const result = addItem(product)
    if (result === 'added') openCart()
  }

  return (
    <article
      className="product-card"
      style={{ '--card-accent': product.accent ?? '#a33a2e' } as CSSProperties}
    >
      <AppLink href={`/collection/${product.slug}`} className="product-media-link" ariaLabel={product.name}>
        <div className="product-media">
          <img src={resolveImage(product.images[0], 900)} alt={`${product.name} by MADE IN CN`} loading="lazy" />
          <span className="product-tag">{product.badge ?? collectionLabel}</span>
        </div>
      </AppLink>

      <div className="product-body">
        <div>
          <p className="product-kicker">{collectionLabel}</p>
          <h3>
            <AppLink href={`/collection/${product.slug}`}>{product.name}</AppLink>
          </h3>
          <p>{product.subtitle}</p>
        </div>
        <div className="product-bottom">
          <strong>{formatPrice(product.price, product.currency)}</strong>
          <button className="btn btn-small btn-primary" type="button" onClick={handleAdd}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
