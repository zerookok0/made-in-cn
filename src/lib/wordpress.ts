const WP_SITE = ((import.meta.env.VITE_WP_SITE_URL as string | undefined) ?? '').replace(/\/+$/, '')
const SRC = 'made-in-cn'

export const isWordPressConfigured = Boolean(WP_SITE)

export interface WordPressCartItem {
  id: number
  qty: number
  variationId?: number
}

export function cartQuery(items: WordPressCartItem[]): string {
  return items
    .filter(
      (item) =>
        Number.isInteger(item.id) &&
        item.id > 0 &&
        Number.isInteger(item.qty) &&
        item.qty > 0 &&
        (item.variationId === undefined || Number.isInteger(item.variationId)),
    )
    .map((item) => `${item.id}:${item.qty}${item.variationId ? `:${item.variationId}` : ''}`)
    .join(',')
}

export function checkout(items: WordPressCartItem[]): boolean {
  const pairs = cartQuery(items)
  if (!WP_SITE || !pairs) return false

  window.location.href = `${WP_SITE}/?bolt_cart=${encodeURIComponent(pairs)}&src=${encodeURIComponent(SRC)}`
  return true
}
