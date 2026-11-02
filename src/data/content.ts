import productsJson from '../../content/products.json'
import siteJson from '../../content/site.json'
import homeJson from '../../content/home.json'
import type { HomeContent, Product, SiteContent } from './types'

export const defaultProducts = productsJson.products as Product[]
export const defaultSite = siteJson as SiteContent
export const defaultHome = homeJson as HomeContent
