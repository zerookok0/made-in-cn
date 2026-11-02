export type Currency = 'USD' | 'VND'

export type Language = 'en' | 'vi'

export interface Product {
  id: string
  name: string
  subtitle: string
  price: number
  currency: Currency
  image: string
  accent: string
}

export interface ProductImage {
  full: string
  thumb: string
  alt: string
}

export interface SpecRow {
  label: string
  value: string
}

export interface ProductCopy {
  eyebrow: string
  title: string
  subtitle: string
  specs: SpecRow[]
  description: string[]
  note: string
}

export interface DetailedProduct extends Product {
  badge: string
  gallery: ProductImage[]
  copy: Record<Language, ProductCopy>
}
