import { useEffect, useMemo, useState } from 'react'
import { AppLink } from '../components/AppLink'
import { ProductCard } from '../components/ProductCard'
import { categories, categoryLabel, collectionLabel, collections, products } from '../data/products'
import type { CategoryId, CollectionId } from '../data/types'
import { useI18n } from '../i18n'
import { useDocumentMeta, useRoute } from '../lib/router'

type CollectionFilter = 'all' | CollectionId
type CategoryFilter = 'all' | CategoryId

export function ShopPage() {
  const route = useRoute()
  const { locale, t } = useI18n()
  const [collection, setCollection] = useState<CollectionFilter>('all')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const requested = route.query.get('collection')
    if (requested === 'pokemon' || requested === 'heritage') setCollection(requested)
    else if (route.path === '/shop') setCollection('all')
  }, [route.path, route.query])

  useDocumentMeta(t('meta.shopTitle'), t('meta.shopDesc'))

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCollection = collection === 'all' || product.collection === collection
      const matchesCategory = category === 'all' || product.category === category
      const matchesQuery =
        !normalized ||
        `${product.name} ${product.subtitle} ${product.description}`.toLowerCase().includes(normalized)
      return matchesCollection && matchesCategory && matchesQuery
    })
  }, [category, collection, query])

  return (
    <div className="shop-page">
      <div className="shop-head">
        <p className="eyebrow">{t('shop.eyebrow')}</p>
        <h1>
          {t('shop.title1')} <em>{t('shop.title2')}</em>
        </h1>
        <p>{t('shop.lede')}</p>
      </div>

      <div className="shop-toolbar">
        <label className="shop-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
          </svg>
          <input
            type="search"
            placeholder={t('shop.search')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={t('shop.search')}
          />
        </label>
        <span className="shop-count">
          {t(filtered.length === 1 ? 'shop.count' : 'shop.countPlural', { count: filtered.length })}
        </span>
      </div>

      <div className="shop-filters">
        <div className="filter-group" role="group" aria-label="Collection">
          <button type="button" className={collection === 'all' ? 'is-active' : ''} onClick={() => setCollection('all')}>
            {t('shop.all')}
          </button>
          {collections.map((item) => (
            <button
              key={item.id}
              type="button"
              className={collection === item.id ? 'is-active' : ''}
              onClick={() => setCollection(item.id)}
            >
              {collectionLabel(item.id, locale)}
            </button>
          ))}
        </div>
        <div className="filter-group" role="group" aria-label="Category">
          <button type="button" className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')}>
            {t('shop.everyObject')}
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={category === item.id ? 'is-active' : ''}
              onClick={() => setCategory(item.id)}
            >
              {categoryLabel(item.id, locale)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="shop-empty">
          <h2>{t('shop.emptyTitle')}</h2>
          <p>{t('shop.emptyBody')}</p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              setQuery('')
              setCategory('all')
              setCollection('all')
            }}
          >
            {t('shop.emptyCta')}
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="shop-back">
        <AppLink className="btn btn-ghost btn-small" href="/">{t('shop.backHome')}</AppLink>
      </div>
    </div>
  )
}
