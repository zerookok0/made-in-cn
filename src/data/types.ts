export type Availability = 'available' | 'made-to-order' | 'sold-out' | 'enquire'

export type CategoryId = 'lighting' | 'tea' | 'gift'

export type CollectionId = 'pokemon' | 'heritage'

export interface SpecItem {
  label: string
  value: string
}

export interface Variant {
  id: string
  label: string
  purchaseUrl: string | null
  wooVariationId?: number
}

export interface ProductTranslation {
  name?: string
  headline?: string
  subtitle?: string
  description?: string
  specifications?: SpecItem[]
  note?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  headline?: string
  subtitle: string
  description: string
  seoTitle?: string
  seoDescription?: string
  note?: string
  price: number
  currency: string
  images: string[]
  detailImages?: string[]
  detailCaptions?: string[]
  detailCaptionsVi?: string[]
  category: CategoryId
  collection: CollectionId
  specifications: SpecItem[]
  purchaseUrl: string | null
  wooId?: number
  variants?: Variant[]
  featured: boolean
  availability: Availability
  year: string
  badge?: string
  accent?: string
  translations?: {
    vi?: ProductTranslation
  }
}

export interface LinkItem {
  label: string
  href: string
}

export interface SiteContent {
  brand: string
  brandCn: string
  tagline: string
  legalName: string
  email: string
  studio: string
  hours: string
  url: string
  currency: string
  social: LinkItem[]
  policies: LinkItem[]
  navigation: LinkItem[]
}

export interface CompareRow {
  label: string
  direct: string
  market: string
}

export interface HomeContent {
  hero: {
    kicker: string
    titleLine1: string
    titleLine2: string
    lead: string
    sub: string
    ctaPrimary: string
    ctaSecondary: string
  }
  maker: {
    eyebrow: string
    titleLine1: string
    titleLine2: string
    body: string
    cta: string
  }
  shop: {
    eyebrow: string
    title: string
    note: string
    cta: string
  }
  heritage: {
    eyebrow: string
    titleLine1: string
    titleLine2: string
    body: string
    cta: string
  }
  compare: {
    eyebrow: string
    title: string
    note: string
    rows: CompareRow[]
  }
  bundle: {
    eyebrow: string
    titleLine1: string
    titleLine2: string
    body: string
    cta: string
  }
  closing: {
    eyebrow: string
    titleLine1: string
    titleLine2: string
    body: string
    ctaPrimary: string
    ctaSecondary: string
  }
}

export interface ContentBundle {
  products: Product[]
  site: SiteContent
  home: HomeContent
}

export interface RepoConfig {
  owner: string
  repo: string
  branch: string
  token: string
}

export interface RepoFile {
  path: string
  base64: string
}

export interface CommitResult {
  sha: string
  url: string
}

export type AdminStatus =
  | { kind: 'idle'; message: string }
  | { kind: 'loading'; message: string }
  | { kind: 'saving'; message: string }
  | { kind: 'success'; message: string; url?: string }
  | { kind: 'error'; message: string }
