import { bytesToBase64 } from './github'

export interface PreparedImage {
  /** Public site path, e.g. /images/uploads/chun-abc.jpg */
  publicPath: string
  /** Repo path, e.g. public/images/uploads/chun-abc.jpg */
  repoPath: string
  base64: string
  previewUrl: string
  bytes: number
  width: number
  height: number
}

const MAX_DIMENSION = 1800
const MAX_BYTES = 3_000_000

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 48) || 'image'
  )
}

export async function prepareImage(file: File, baseName: string): Promise<PreparedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('请选择 JPG、PNG 或 WebP 图片。')
  }

  if (file.size > 25 * 1024 * 1024) {
    throw new Error('图片超过 25MB，请先压缩。')
  }

  let bitmap: ImageBitmap

  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('浏览器无法读取这张图片，请改用 JPG / PNG / WebP。')
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  if (!context) {
    bitmap.close()
    throw new Error('浏览器不支持图片处理。')
  }

  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const keepPng = file.type === 'image/png'
  const mime = keepPng ? 'image/png' : 'image/jpeg'
  const extension = keepPng ? 'png' : 'jpg'

  let quality = 0.86
  let blob: Blob | null = null

  for (let attempt = 0; attempt < 4; attempt += 1) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), mime, quality)
    })

    if (blob && blob.size <= MAX_BYTES) break
    quality -= 0.12
  }

  if (!blob) {
    throw new Error('图片处理失败，请换一张试试。')
  }

  if (blob.size > MAX_BYTES) {
    throw new Error('压缩后仍然超过 3MB，请换一张更小的图片。')
  }

  const buffer = new Uint8Array(await blob.arrayBuffer())
  const name = `${slugify(baseName)}-${Date.now().toString(36)}.${extension}`

  return {
    publicPath: `/images/uploads/${name}`,
    repoPath: `public/images/uploads/${name}`,
    base64: bytesToBase64(buffer),
    previewUrl: URL.createObjectURL(blob),
    bytes: blob.size,
    width,
    height,
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
