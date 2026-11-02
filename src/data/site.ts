import { defaultSite } from './content'

const STORE_URL = ((import.meta.env.VITE_WP_SITE_URL as string | undefined) ?? '').replace(/\/+$/, '')

export const site = {
  ...defaultSite,
  shopBaseUrl: STORE_URL,
  autoDerivePurchaseUrl: true,
}

export const navigation = defaultSite.navigation
