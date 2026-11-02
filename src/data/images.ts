const RAW_BASE =
  'https://raw.githubusercontent.com/zerookok0/made-in-cn/main/public'

const ASSET_BASE = (
  (import.meta.env.VITE_ASSET_BASE as string | undefined)?.replace(/\/+$/, '') || RAW_BASE
)

export function resolveImage(image: string, _width = 1200): string {
  if (/^https?:\/\//i.test(image) || image.startsWith('//')) return image
  if (image.startsWith('./') || image.startsWith('../')) return image
  return `${ASSET_BASE}/${image.replace(/^\/+/, '')}`
}

export function srcSetFor(_image: string): string {
  return ''
}
