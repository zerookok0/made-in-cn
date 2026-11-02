export const ASSET_BASE =
  import.meta.env.VITE_ASSET_BASE ??
  'https://raw.githubusercontent.com/zerookok0/made-in-cn/main/public/images/'

export const asset = (file: string) => `${ASSET_BASE}${file}`
