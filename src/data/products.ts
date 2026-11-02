import type { CategoryId, CollectionId, Product, SpecItem } from './types'
import { defaultProducts } from './content'

export const products: Product[] = defaultProducts

export const categories: { id: CategoryId; label: string }[] = [
  { id: 'lighting', label: 'Lighting' },
  { id: 'tea', label: 'Tea & ritual' },
  { id: 'gift', label: 'Gifts' },
]

export const collections: { id: CollectionId; label: string }[] = [
  { id: 'pokemon', label: 'Pokémon Artisan' },
  { id: 'heritage', label: 'Heritage' },
]

export const availabilityLabels: Record<Product['availability'], string> = {
  available: 'Available',
  'made-to-order': 'Made to order',
  'sold-out': 'Sold out',
  enquire: 'Enquire',
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function productDisplayTitle(product: Product): string {
  return product.headline ?? product.name
}

export function getRelated(product: Product, count = 3): Product[] {
  return products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      const score = (item: Product) =>
        (item.collection === product.collection ? 2 : 0) + (item.featured ? 1 : 0)
      return score(b) - score(a)
    })
    .slice(0, count)
}

export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function specsFor(product: Product, language: 'en' | 'vi'): SpecItem[] {
  if (language === 'vi' && product.translations?.vi?.specifications?.length) {
    return product.translations.vi.specifications
  }
  return product.specifications
}

export function productNameFor(product: Product, language: 'en' | 'vi'): string {
  if (language === 'vi' && product.translations?.vi?.name) return product.translations.vi.name
  return product.name
}
