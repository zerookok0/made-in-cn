import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react'
import { defaultHome, defaultProducts, defaultSite } from '../data/content'
import { resolveImage } from '../data/images'
import { availabilityLabels, categories, collections, formatPrice } from '../data/products'
import type {
  AdminStatus,
  ContentBundle,
  HomeContent,
  LinkItem,
  Product,
  ProductTranslation,
  RepoConfig,
  SiteContent,
  SpecItem,
} from '../data/types'
import {
  commitFiles,
  fetchContentFile,
  GitHubError,
  toBase64,
  verifyRepo,
} from '../lib/admin/github'
import { formatBytes, prepareImage, type PreparedImage } from '../lib/admin/imageUpload'
import '../styles/admin.css'

const REPO_OWNER = 'zerookok0'
const REPO_NAME = 'made-in-cn'
const REPO_BRANCH = 'main'
const TOKEN_KEY = 'madeincn_admin_token'
const REMEMBER_KEY = 'madeincn_admin_remember'
const PRODUCTS_FILE = 'content/products.json'
const SITE_FILE = 'content/site.json'
const HOME_FILE = 'content/home.json'

function nextProductId(products: Product[]): string {
  const used = new Set(products.map((product) => product.id))
  const numbers = products
    .map((product) => /^mcn-(\d+)$/.exec(product.id)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number)
  let next = numbers.length ? Math.max(...numbers) + 1 : 1
  let id = `mcn-${String(next).padStart(2, '0')}`
  while (used.has(id)) {
    next += 1
    id = `mcn-${String(next).padStart(2, '0')}`
  }
  return id
}

function newProductSlug(products: Product[]): string {
  const base = `new-object-${Date.now().toString(36).slice(-5)}`
  let slug = base
  let suffix = 2
  while (products.some((product) => product.slug === slug)) {
    slug = `${base}-${suffix}`
    suffix += 1
  }
  return slug
}

function validateProducts(products: Product[]): string | null {
  const ids = new Set<string>()
  const slugs = new Set<string>()

  for (const product of products) {
    if (!product.id.trim()) return '有商品缺少 id。'
    if (!product.name.trim()) return `商品 ${product.id} 缺少名称。`
    if (!product.slug.trim()) return `商品「${product.name}」缺少 slug。`
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) {
      return `商品「${product.name}」的 slug 只能使用小写字母、数字和连字符。`
    }
    if (ids.has(product.id)) return `商品 id 重复：${product.id}`
    if (slugs.has(product.slug)) return `商品 slug 重复：${product.slug}`
    ids.add(product.id)
    slugs.add(product.slug)
  }

  return null
}

function readStoredToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function readRemembered(): boolean {
  try {
    return localStorage.getItem(REMEMBER_KEY) === '1'
  } catch {
    return false
  }
}

function buildConfig(token: string): RepoConfig {
  return { owner: REPO_OWNER, repo: REPO_NAME, branch: REPO_BRANCH, token }
}

function errorMessage(error: unknown): string {
  if (error instanceof GitHubError) return error.message
  if (error instanceof Error) return error.message
  return '操作失败，请重试。'
}

function parseProducts(text: string): Product[] {
  const parsed = JSON.parse(text) as { products?: Product[] } | Product[]
  const products = Array.isArray(parsed) ? parsed : parsed.products
  if (!Array.isArray(products)) throw new Error('products.json 格式不正确。')
  return products.map((product) => ({
    ...product,
    images: Array.isArray(product.images) ? product.images : [],
    detailImages: Array.isArray(product.detailImages) ? product.detailImages : undefined,
    specifications: Array.isArray(product.specifications) ? product.specifications : [],
  }))
}

function mergeSite(value: unknown): SiteContent {
  const remote = (value && typeof value === 'object' ? value : {}) as Partial<SiteContent>
  return {
    ...defaultSite,
    ...remote,
    social: Array.isArray(remote.social) ? remote.social : defaultSite.social,
    policies: Array.isArray(remote.policies) ? remote.policies : defaultSite.policies,
    navigation: Array.isArray(remote.navigation) ? remote.navigation : defaultSite.navigation,
  }
}

function section<T extends object>(base: T, value: unknown): T {
  return { ...base, ...((value && typeof value === 'object' ? value : {}) as Partial<T>) }
}

function mergeHome(value: unknown): HomeContent {
  const remote = (value && typeof value === 'object' ? value : {}) as Partial<HomeContent>
  return {
    hero: section(defaultHome.hero, remote.hero),
    maker: section(defaultHome.maker, remote.maker),
    shop: section(defaultHome.shop, remote.shop),
    heritage: section(defaultHome.heritage, remote.heritage),
    compare: {
      ...section(defaultHome.compare, remote.compare),
      rows: Array.isArray(remote.compare?.rows) ? remote.compare.rows : defaultHome.compare.rows,
    },
    bundle: section(defaultHome.bundle, remote.bundle),
    closing: section(defaultHome.closing, remote.closing),
  }
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
  hint,
  readOnly = false,
}: {
  label: string
  value: string | number
  onChange?: (value: string) => void
  multiline?: boolean
  type?: string
  hint?: string
  readOnly?: boolean
}) {
  return (
    <label className="admin__field">
      <span className="admin__label">{label}</span>
      {multiline ? (
        <textarea
          className="admin__input admin__textarea"
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          rows={4}
        />
      ) : (
        <input
          className="admin__input"
          value={value}
          type={type}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}
      {hint && <span className="admin__hint">{hint}</span>}
    </label>
  )
}

function LinkListEditor({
  label,
  items,
  onChange,
}: {
  label: string
  items: LinkItem[]
  onChange: (items: LinkItem[]) => void
}) {
  return (
    <div className="admin__stack">
      <div className="admin__section-head">
        <h3>{label}</h3>
        <button type="button" className="admin__button admin__button--small" onClick={() => onChange([...items, { label: '', href: '' }])}>
          + 添加
        </button>
      </div>
      {items.map((item, index) => (
        <div className="admin__row" key={index}>
          <input
            className="admin__input"
            value={item.label}
            placeholder="显示名称"
            onChange={(event) =>
              onChange(items.map((entry, entryIndex) => (entryIndex === index ? { ...entry, label: event.target.value } : entry)))
            }
          />
          <input
            className="admin__input"
            value={item.href}
            placeholder="链接，例如 /shop"
            onChange={(event) =>
              onChange(items.map((entry, entryIndex) => (entryIndex === index ? { ...entry, href: event.target.value } : entry)))
            }
          />
          <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => onChange(items.filter((_, entryIndex) => entryIndex !== index))}>
            删除
          </button>
        </div>
      ))}
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin__card">
      <h2 className="admin__card-title">{title}</h2>
      {children}
    </section>
  )
}

export default function Admin() {
  const [token, setToken] = useState(readStoredToken)
  const [rememberToken, setRememberToken] = useState(readRemembered)
  const [showToken, setShowToken] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState<ContentBundle | null>(null)
  const [tab, setTab] = useState<'products' | 'site' | 'home'>('products')
  const [selectedId, setSelectedId] = useState('')
  const [pendingImages, setPendingImages] = useState<Record<string, PreparedImage>>({})
  const [dirty, setDirty] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newImageValue, setNewImageValue] = useState('')
  const [newDetailImageValue, setNewDetailImageValue] = useState('')
  const [status, setStatus] = useState<AdminStatus>({ kind: 'idle', message: '' })
  const bootstrapped = useRef(false)
  const selected = content?.products.find((product) => product.id === selectedId) ?? null
  const selectedTranslation = selected?.translations?.vi

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Content Studio — MADE IN CN'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      document.title = previousTitle
      meta.remove()
    }
  }, [])

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const connect = useCallback(async (rawToken: string) => {
    const clean = rawToken.trim()
    if (!clean) {
      setError('请先填写 GitHub Token。')
      return
    }

    setBusy(true)
    setError('')
    setStatus({ kind: 'loading', message: '正在连接 GitHub 并读取内容…' })

    try {
      const config = buildConfig(clean)
      const repo = await verifyRepo(config)
      const [productsFile, siteFile, homeFile] = await Promise.all([
        fetchContentFile(config, PRODUCTS_FILE),
        fetchContentFile(config, SITE_FILE),
        fetchContentFile(config, HOME_FILE),
      ])

      const products = productsFile ? parseProducts(productsFile.text) : defaultProducts
      const site = siteFile ? mergeSite(JSON.parse(siteFile.text)) : defaultSite
      const home = homeFile ? mergeHome(JSON.parse(homeFile.text)) : defaultHome

      setContent({ products, site, home })
      setSelectedId(products[0]?.id ?? '')
      setToken(clean)
      setAuthed(true)
      setDirty(false)
      setStatus({
        kind: repo.canPush ? 'success' : 'error',
        message: repo.canPush
          ? `已连接 ${repo.fullName}。`
          : '已连接，但这个 Token 没有写入权限。',
      })
    } catch (err) {
      setAuthed(false)
      setContent(null)
      setError(errorMessage(err))
      setStatus({ kind: 'error', message: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true
    if (token) void connect(token)
  }, [connect, token])

  const persistToken = (value: string, remember: boolean) => {
    try {
      if (remember) {
        localStorage.setItem(TOKEN_KEY, value)
        sessionStorage.removeItem(TOKEN_KEY)
        localStorage.setItem(REMEMBER_KEY, '1')
      } else {
        sessionStorage.setItem(TOKEN_KEY, value)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REMEMBER_KEY)
      }
    } catch {
      /* storage can be blocked */
    }
  }

  const handleLogin = (event: FormEvent) => {
    event.preventDefault()
    persistToken(token, rememberToken)
    void connect(token)
  }

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REMEMBER_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
    } catch {
      /* ignore */
    }
    setToken('')
    setAuthed(false)
    setContent(null)
    setPendingImages({})
    setDirty(false)
    setStatus({ kind: 'idle', message: '' })
  }

  const markDirty = () => {
    setDirty(true)
    if (status.kind === 'success' || status.kind === 'error') setStatus({ kind: 'idle', message: '' })
  }

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setContent((prev) =>
      prev
        ? { ...prev, products: prev.products.map((product) => (product.id === id ? { ...product, ...patch } : product)) }
        : prev,
    )
    markDirty()
  }

  const updateSelected = (patch: Partial<Product>) => {
    if (selected) updateProduct(selected.id, patch)
  }

  const updateTranslation = (patch: Partial<ProductTranslation>) => {
    if (!selected) return
    const vi = { ...selected.translations?.vi, ...patch }
    updateSelected({ translations: { ...selected.translations, vi } })
  }

  const addProduct = () => {
    if (!content) return
    const id = nextProductId(content.products)
    const product: Product = {
      id,
      slug: newProductSlug(content.products),
      name: 'New object',
      subtitle: '',
      description: '',
      price: 0,
      currency: content.site.currency || 'USD',
      images: [],
      category: 'gift',
      collection: 'heritage',
      specifications: [],
      purchaseUrl: null,
      featured: false,
      availability: 'available',
      year: new Date().getFullYear().toString(),
      badge: '',
      accent: '#a33a2e',
    }
    setContent((prev) => (prev ? { ...prev, products: [...prev.products, product] } : prev))
    setSelectedId(id)
    setNewImageValue('')
    setNewDetailImageValue('')
    setTab('products')
    markDirty()
    setStatus({ kind: 'idle', message: '新商品已加入草稿，填写信息后点击「保存并发布」。' })
  }

  const removeProduct = (product: Product) => {
    if (!content) return
    if (!window.confirm(`删除「${product.name}」？保存并发布后才会生效。`)) return
    const index = content.products.findIndex((entry) => entry.id === product.id)
    const products = content.products.filter((entry) => entry.id !== product.id)
    setContent((prev) => (prev ? { ...prev, products } : prev))
    setSelectedId(products[Math.min(index, products.length - 1)]?.id ?? '')
    markDirty()
    setStatus({ kind: 'idle', message: '商品已从草稿移除，保存并发布后生效。' })
  }

  const updateSpec = (index: number, field: keyof SpecItem, value: string) => {
    if (!selected) return
    const specifications = selected.specifications.map((spec, specIndex) =>
      specIndex === index ? { ...spec, [field]: value } : spec,
    )
    updateSelected({ specifications })
  }

  const updateSite = (patch: Partial<SiteContent>) => {
    setContent((prev) => (prev ? { ...prev, site: { ...prev.site, ...patch } } : prev))
    markDirty()
  }

  const updateHome = <K extends keyof HomeContent>(key: K, patch: Partial<HomeContent[K]>) => {
    setContent((prev) => {
      if (!prev) return prev
      return { ...prev, home: { ...prev.home, [key]: { ...prev.home[key], ...patch } } }
    })
    markDirty()
  }

  const handleImages = async (
    event: ChangeEvent<HTMLInputElement>,
    product: Product,
    field: 'images' | 'detailImages',
  ) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return

    setUploading(true)
    setStatus({ kind: 'loading', message: `正在处理 ${files.length} 张图片…` })

    try {
      const prepared: PreparedImage[] = []
      for (const file of files) prepared.push(await prepareImage(file, product.slug))
      setPendingImages((prev) => ({
        ...prev,
        ...Object.fromEntries(prepared.map((image) => [image.publicPath, image])),
      }))
      updateProduct(product.id, {
        [field]: [...(product[field] ?? []), ...prepared.map((image) => image.publicPath)],
      })
      setStatus({ kind: 'success', message: `已处理 ${prepared.length} 张图片，保存并发布后上传到 GitHub。` })
    } catch (err) {
      setStatus({ kind: 'error', message: errorMessage(err) })
    } finally {
      setUploading(false)
    }
  }

  const moveImage = (product: Product, field: 'images' | 'detailImages', index: number, direction: -1 | 1) => {
    const list = product[field] ?? []
    const target = index + direction
    if (target < 0 || target >= list.length) return
    const next = [...list]
    ;[next[index], next[target]] = [next[target], next[index]]
    updateProduct(product.id, { [field]: next })
  }

  const removeImage = (product: Product, field: 'images' | 'detailImages', index: number) => {
    updateProduct(product.id, { [field]: (product[field] ?? []).filter((_, imageIndex) => imageIndex !== index) })
  }

  const addImageUrl = (product: Product, field: 'images' | 'detailImages', value: string) => {
    const clean = value.trim()
    if (!clean) return
    updateProduct(product.id, { [field]: [...(product[field] ?? []), clean] })
  }

  const handleSave = async () => {
    if (!content) return
    const problem = validateProducts(content.products)
    if (problem) {
      setStatus({ kind: 'error', message: problem })
      return
    }

    setStatus({ kind: 'saving', message: '正在提交到 GitHub…' })
    const files = [
      { path: PRODUCTS_FILE, base64: toBase64(JSON.stringify({ products: content.products }, null, 2) + '\n') },
      { path: SITE_FILE, base64: toBase64(JSON.stringify(content.site, null, 2) + '\n') },
      { path: HOME_FILE, base64: toBase64(JSON.stringify(content.home, null, 2) + '\n') },
      ...Object.values(pendingImages).map((image) => ({ path: image.repoPath, base64: image.base64 })),
    ]

    try {
      const result = await commitFiles(buildConfig(token), 'Update content from MADE IN CN studio', files)
      setDirty(false)
      setPendingImages({})
      setStatus({ kind: 'success', message: '已提交到 GitHub。Cloudflare Pages 或重新部署后会自动更新。', url: result.url })
    } catch (err) {
      setStatus({ kind: 'error', message: errorMessage(err) })
    }
  }

  if (!authed) {
    return (
      <div className="admin admin--login">
        <div className="admin__login-card">
          <p className="admin__eyebrow">MADE IN CN · CONTENT STUDIO</p>
          <h1>内容后台</h1>
          <p className="admin__lead">
            用 GitHub Token 登录。商品、站点信息和首页文案会直接提交到仓库，Cloudflare Pages 可自动重新部署。图片无需经过 bolt.diy 上传。
          </p>

          <form onSubmit={handleLogin} className="admin__login-form">
            <label className="admin__field">
              <span className="admin__label">GitHub Fine-grained Token</span>
              <div className="admin__token-row">
                <input
                  className="admin__input"
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  placeholder="github_pat_..."
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => setShowToken((value) => !value)}>
                  {showToken ? '隐藏' : '显示'}
                </button>
              </div>
            </label>

            <label className="admin__check">
              <input type="checkbox" checked={rememberToken} onChange={(event) => setRememberToken(event.target.checked)} />
              在这台设备上记住 Token
            </label>

            <button type="submit" className="admin__button admin__button--primary admin__button--wide" disabled={busy}>
              {busy ? '连接中…' : '连接并进入后台'}
            </button>

            {error && <p className="admin__error">{error}</p>}
          </form>

          <div className="admin__help">
            <p>仓库：<code>{REPO_OWNER}/{REPO_NAME}</code> · 分支 <code>{REPO_BRANCH}</code></p>
            <p>Token 需要该仓库的 <strong>Contents: Read and write</strong> 权限。</p>
            <p>Token 只保存在当前浏览器，上传图片和发布内容直接请求 api.github.com。</p>
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return <div className="admin admin--login"><p>正在加载内容…</p></div>
  }

  return (
    <div className="admin">
      <header className="admin__bar">
        <div>
          <p className="admin__eyebrow">MADE IN CN · CONTENT STUDIO</p>
          <h1>内容后台</h1>
        </div>
        <div className="admin__bar-actions">
          <a className="admin__button admin__button--ghost" href="#/" target="_blank" rel="noreferrer">打开站点</a>
          <button type="button" className="admin__button admin__button--ghost" onClick={logout}>退出</button>
          <button type="button" className="admin__button admin__button--primary" onClick={handleSave} disabled={status.kind === 'saving' || uploading}>
            {status.kind === 'saving' ? '提交中…' : dirty ? '保存并发布 *' : '保存并发布'}
          </button>
        </div>
      </header>

      {status.message && (
        <div className={`admin__status admin__status--${status.kind}`}>
          <span>{status.message}</span>
          {'url' in status && status.url && <a href={status.url} target="_blank" rel="noreferrer">查看提交</a>}
        </div>
      )}

      <div className="admin__layout">
        <aside className="admin__sidebar">
          <div className="admin__tabs">
            <button type="button" className={tab === 'products' ? 'is-active' : ''} onClick={() => setTab('products')}>商品</button>
            <button type="button" className={tab === 'site' ? 'is-active' : ''} onClick={() => setTab('site')}>站点</button>
            <button type="button" className={tab === 'home' ? 'is-active' : ''} onClick={() => setTab('home')}>首页文案</button>
          </div>

          {tab === 'products' && (
            <>
              <button type="button" className="admin__button admin__button--primary admin__button--wide" onClick={addProduct}>+ 新建商品</button>
              <nav className="admin__product-list" aria-label="商品列表">
                {content.products.map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    className={product.id === selectedId ? 'is-active' : ''}
                    onClick={() => {
                      setSelectedId(product.id)
                      setNewImageValue('')
                      setNewDetailImageValue('')
                    }}
                  >
                    <span>{product.name}</span>
                    <small>{product.slug} · {formatPrice(product.price, product.currency)}</small>
                  </button>
                ))}
              </nav>
            </>
          )}
        </aside>

        <main className="admin__main">
          {tab === 'products' && selected && (
            <>
              <Section title="商品信息">
                <div className="admin__grid admin__grid--two">
                  <Field label="商品 ID" value={selected.id} readOnly hint="用于购物车与后台识别" />
                  <Field label="Slug" value={selected.slug} onChange={(value) => updateSelected({ slug: value })} hint="只能使用小写字母、数字和连字符" />
                  <Field label="名称" value={selected.name} onChange={(value) => updateSelected({ name: value })} />
                  <Field label="完整标题" value={selected.headline ?? ''} onChange={(value) => updateSelected({ headline: value })} />
                  <Field label="副标题" value={selected.subtitle} onChange={(value) => updateSelected({ subtitle: value })} />
                  <Field label="价格" type="number" value={selected.price} onChange={(value) => updateSelected({ price: Number(value) || 0 })} />
                  <Field label="币种" value={selected.currency} onChange={(value) => updateSelected({ currency: value.toUpperCase() })} />
                  <Field label="年份" value={selected.year} onChange={(value) => updateSelected({ year: value })} />
                  <Field label="徽标" value={selected.badge ?? ''} onChange={(value) => updateSelected({ badge: value })} />
                  <Field label="强调色" value={selected.accent ?? ''} onChange={(value) => updateSelected({ accent: value })} />
                  <label className="admin__field">
                    <span className="admin__label">分类</span>
                    <select className="admin__input" value={selected.category} onChange={(event) => updateSelected({ category: event.target.value as Product['category'] })}>
                      {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                    </select>
                  </label>
                  <label className="admin__field">
                    <span className="admin__label">系列</span>
                    <select className="admin__input" value={selected.collection} onChange={(event) => updateSelected({ collection: event.target.value as Product['collection'] })}>
                      {collections.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                    </select>
                  </label>
                  <label className="admin__field">
                    <span className="admin__label">状态</span>
                    <select className="admin__input" value={selected.availability} onChange={(event) => updateSelected({ availability: event.target.value as Product['availability'] })}>
                      {Object.entries(availabilityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <label className="admin__check admin__check--inline">
                    <input type="checkbox" checked={selected.featured} onChange={(event) => updateSelected({ featured: event.target.checked })} />
                    首页推荐
                  </label>
                </div>
                <Field label="描述" value={selected.description} multiline onChange={(value) => updateSelected({ description: value })} />
                <Field label="补充说明" value={selected.note ?? ''} multiline onChange={(value) => updateSelected({ note: value })} />
                <div className="admin__grid admin__grid--two">
                  <Field label="SEO 标题" value={selected.seoTitle ?? ''} onChange={(value) => updateSelected({ seoTitle: value })} />
                  <Field label="SEO 描述" value={selected.seoDescription ?? ''} onChange={(value) => updateSelected({ seoDescription: value })} />
                </div>
              </Section>

              <Section title="商品主图">
                <p className="admin__hint">上传后提交到 <code>public/images/uploads/</code>；也可以直接填写已经存在的图片路径。</p>
                <div className="admin__image-grid">
                  {selected.images.map((image, index) => (
                    <div className="admin__image" key={`${image}-${index}`}>
                      <img src={pendingImages[image]?.previewUrl ?? resolveImage(image, 480)} alt="" loading="lazy" />
                      <div className="admin__image-body">
                        <input className="admin__input admin__input--small" value={image} readOnly={Boolean(pendingImages[image])} onChange={(event) => updateSelected({ images: selected.images.map((entry, imageIndex) => imageIndex === index ? event.target.value : entry) })} />
                        {pendingImages[image] && <span className="admin__badge">待提交 · {formatBytes(pendingImages[image].bytes)}</span>}
                        <div className="admin__image-actions">
                          <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => moveImage(selected, 'images', index, -1)} disabled={index === 0}>上移</button>
                          <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => moveImage(selected, 'images', index, 1)} disabled={index === selected.images.length - 1}>下移</button>
                          <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => removeImage(selected, 'images', index)}>删除</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="admin__add-image">
                  <input className="admin__input" value={newImageValue} onChange={(event) => setNewImageValue(event.target.value)} placeholder="/images/products/... 或图片 URL" />
                  <button type="button" className="admin__button admin__button--ghost" onClick={() => { addImageUrl(selected, 'images', newImageValue); setNewImageValue('') }}>添加路径</button>
                  <label className="admin__button admin__button--primary admin__upload">
                    <input type="file" accept="image/*" multiple disabled={uploading} onChange={(event) => void handleImages(event, selected, 'images')} />
                    {uploading ? '处理中…' : '上传图片'}
                  </label>
                </div>
              </Section>

              <Section title="场景 / 细节图">
                <p className="admin__hint">商品页下方的生活方式图库。可与主图重复，也可以单独上传。</p>
                <div className="admin__image-grid">
                  {(selected.detailImages ?? []).map((image, index) => (
                    <div className="admin__image" key={`${image}-detail-${index}`}>
                      <img src={pendingImages[image]?.previewUrl ?? resolveImage(image, 480)} alt="" loading="lazy" />
                      <div className="admin__image-body">
                        <input className="admin__input admin__input--small" value={image} readOnly={Boolean(pendingImages[image])} onChange={(event) => updateSelected({ detailImages: (selected.detailImages ?? []).map((entry, imageIndex) => imageIndex === index ? event.target.value : entry) })} />
                        <div className="admin__image-actions">
                          <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => moveImage(selected, 'detailImages', index, -1)} disabled={index === 0}>上移</button>
                          <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => moveImage(selected, 'detailImages', index, 1)} disabled={index === (selected.detailImages?.length ?? 0) - 1}>下移</button>
                          <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => removeImage(selected, 'detailImages', index)}>删除</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="admin__add-image">
                  <input className="admin__input" value={newDetailImageValue} onChange={(event) => setNewDetailImageValue(event.target.value)} placeholder="/images/products/... 或图片 URL" />
                  <button type="button" className="admin__button admin__button--ghost" onClick={() => { addImageUrl(selected, 'detailImages', newDetailImageValue); setNewDetailImageValue('') }}>添加路径</button>
                  <label className="admin__button admin__button--primary admin__upload">
                    <input type="file" accept="image/*" multiple disabled={uploading} onChange={(event) => void handleImages(event, selected, 'detailImages')} />
                    {uploading ? '处理中…' : '上传图片'}
                  </label>
                </div>
              </Section>

              <Section title="规格">
                <div className="admin__stack">
                  {selected.specifications.map((spec, index) => (
                    <div className="admin__row" key={index}>
                      <input className="admin__input" value={spec.label} placeholder="名称，例如 尺寸" onChange={(event) => updateSpec(index, 'label', event.target.value)} />
                      <input className="admin__input" value={spec.value} placeholder="值，例如 12.4 cm" onChange={(event) => updateSpec(index, 'value', event.target.value)} />
                      <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => updateSelected({ specifications: selected.specifications.filter((_, specIndex) => specIndex !== index) })}>删除</button>
                    </div>
                  ))}
                  <button type="button" className="admin__button admin__button--small" onClick={() => updateSelected({ specifications: [...selected.specifications, { label: '', value: '' }] })}>+ 添加规格</button>
                </div>
              </Section>

              <Section title="越南语内容">
                <p className="admin__hint">只影响该商品的 VI 版本；留空则自动使用英文内容。</p>
                <div className="admin__grid admin__grid--two">
                  <Field label="VI 名称" value={selectedTranslation?.name ?? ''} onChange={(value) => updateTranslation({ name: value })} />
                  <Field label="VI 副标题" value={selectedTranslation?.subtitle ?? ''} onChange={(value) => updateTranslation({ subtitle: value })} />
                  <Field label="VI 完整标题" value={selectedTranslation?.headline ?? ''} onChange={(value) => updateTranslation({ headline: value })} />
                </div>
                <Field label="VI 描述" value={selectedTranslation?.description ?? ''} multiline onChange={(value) => updateTranslation({ description: value })} />
                <Field label="VI 补充说明" value={selectedTranslation?.note ?? ''} multiline onChange={(value) => updateTranslation({ note: value })} />
              </Section>

              <Section title="购买信息">
                <div className="admin__grid admin__grid--two">
                  <Field label="购买链接" value={selected.purchaseUrl ?? ''} onChange={(value) => updateSelected({ purchaseUrl: value || null })} hint="留空则由 WooCommerce ID 处理" />
                  <Field label="WooCommerce 商品 ID" type="number" value={selected.wooId ?? ''} onChange={(value) => updateSelected({ wooId: value ? Number(value) : undefined })} />
                </div>
              </Section>

              <Section title="删除商品">
                <p className="admin__hint">删除后需要保存并发布才会从仓库移除。</p>
                <button type="button" className="admin__button admin__button--danger" onClick={() => removeProduct(selected)}>删除「{selected.name}」</button>
              </Section>
            </>
          )}

          {tab === 'site' && (
            <>
              <Section title="品牌与联系">
                <div className="admin__grid admin__grid--two">
                  <Field label="品牌名" value={content.site.brand} onChange={(value) => updateSite({ brand: value })} />
                  <Field label="中文品牌名" value={content.site.brandCn} onChange={(value) => updateSite({ brandCn: value })} />
                  <Field label="Tagline" value={content.site.tagline} onChange={(value) => updateSite({ tagline: value })} />
                  <Field label="主体名称" value={content.site.legalName} onChange={(value) => updateSite({ legalName: value })} />
                  <Field label="邮箱" value={content.site.email} onChange={(value) => updateSite({ email: value })} />
                  <Field label="工作室地点" value={content.site.studio} onChange={(value) => updateSite({ studio: value })} />
                  <Field label="营业时间" value={content.site.hours} onChange={(value) => updateSite({ hours: value })} />
                  <Field label="站点 URL" value={content.site.url} onChange={(value) => updateSite({ url: value })} />
                  <Field label="默认币种" value={content.site.currency} onChange={(value) => updateSite({ currency: value.toUpperCase() })} />
                </div>
              </Section>
              <Section title="社交链接">
                <LinkListEditor label="Social" items={content.site.social} onChange={(social) => updateSite({ social })} />
              </Section>
              <Section title="条款与政策">
                <LinkListEditor label="Policies" items={content.site.policies} onChange={(policies) => updateSite({ policies })} />
              </Section>
              <Section title="导航">
                <LinkListEditor label="Navigation" items={content.site.navigation} onChange={(navigation) => updateSite({ navigation })} />
              </Section>
            </>
          )}

          {tab === 'home' && (
            <>
              <Section title="首页 Hero">
                <div className="admin__grid admin__grid--two">
                  <Field label="小标签" value={content.home.hero.kicker} onChange={(value) => updateHome('hero', { kicker: value })} />
                  <Field label="第一行标题" value={content.home.hero.titleLine1} onChange={(value) => updateHome('hero', { titleLine1: value })} />
                  <Field label="强调标题" value={content.home.hero.titleLine2} onChange={(value) => updateHome('hero', { titleLine2: value })} />
                  <Field label="主按钮" value={content.home.hero.ctaPrimary} onChange={(value) => updateHome('hero', { ctaPrimary: value })} />
                  <Field label="次按钮" value={content.home.hero.ctaSecondary} onChange={(value) => updateHome('hero', { ctaSecondary: value })} />
                </div>
                <Field label="主文案" value={content.home.hero.lead} multiline onChange={(value) => updateHome('hero', { lead: value })} />
                <Field label="副文案" value={content.home.hero.sub} multiline onChange={(value) => updateHome('hero', { sub: value })} />
              </Section>

              <Section title="Maker 区块">
                <div className="admin__grid admin__grid--two">
                  <Field label="小标签" value={content.home.maker.eyebrow} onChange={(value) => updateHome('maker', { eyebrow: value })} />
                  <Field label="第一行标题" value={content.home.maker.titleLine1} onChange={(value) => updateHome('maker', { titleLine1: value })} />
                  <Field label="强调标题" value={content.home.maker.titleLine2} onChange={(value) => updateHome('maker', { titleLine2: value })} />
                  <Field label="按钮文字" value={content.home.maker.cta} onChange={(value) => updateHome('maker', { cta: value })} />
                </div>
                <Field label="正文" value={content.home.maker.body} multiline onChange={(value) => updateHome('maker', { body: value })} />
              </Section>

              <Section title="Shop 区块">
                <div className="admin__grid admin__grid--two">
                  <Field label="小标签" value={content.home.shop.eyebrow} onChange={(value) => updateHome('shop', { eyebrow: value })} />
                  <Field label="标题" value={content.home.shop.title} onChange={(value) => updateHome('shop', { title: value })} />
                  <Field label="按钮" value={content.home.shop.cta} onChange={(value) => updateHome('shop', { cta: value })} />
                </div>
                <Field label="说明" value={content.home.shop.note} multiline onChange={(value) => updateHome('shop', { note: value })} />
              </Section>

              <Section title="Heritage 区块">
                <div className="admin__grid admin__grid--two">
                  <Field label="小标签" value={content.home.heritage.eyebrow} onChange={(value) => updateHome('heritage', { eyebrow: value })} />
                  <Field label="第一行标题" value={content.home.heritage.titleLine1} onChange={(value) => updateHome('heritage', { titleLine1: value })} />
                  <Field label="强调标题" value={content.home.heritage.titleLine2} onChange={(value) => updateHome('heritage', { titleLine2: value })} />
                  <Field label="按钮" value={content.home.heritage.cta} onChange={(value) => updateHome('heritage', { cta: value })} />
                </div>
                <Field label="正文" value={content.home.heritage.body} multiline onChange={(value) => updateHome('heritage', { body: value })} />
              </Section>

              <Section title="Compare 区块">
                <div className="admin__grid admin__grid--two">
                  <Field label="小标签" value={content.home.compare.eyebrow} onChange={(value) => updateHome('compare', { eyebrow: value })} />
                  <Field label="标题" value={content.home.compare.title} onChange={(value) => updateHome('compare', { title: value })} />
                  <Field label="说明" value={content.home.compare.note} onChange={(value) => updateHome('compare', { note: value })} />
                </div>
                <div className="admin__stack">
                  {content.home.compare.rows.map((row, index) => (
                    <div className="admin__row" key={index}>
                      <input className="admin__input" value={row.label} placeholder="对比项" onChange={(event) => updateHome('compare', { rows: content.home.compare.rows.map((entry, rowIndex) => rowIndex === index ? { ...entry, label: event.target.value } : entry) })} />
                      <input className="admin__input" value={row.direct} placeholder="MADE IN CN" onChange={(event) => updateHome('compare', { rows: content.home.compare.rows.map((entry, rowIndex) => rowIndex === index ? { ...entry, direct: event.target.value } : entry) })} />
                      <input className="admin__input" value={row.market} placeholder="Marketplace" onChange={(event) => updateHome('compare', { rows: content.home.compare.rows.map((entry, rowIndex) => rowIndex === index ? { ...entry, market: event.target.value } : entry) })} />
                      <button type="button" className="admin__button admin__button--ghost admin__button--small" onClick={() => updateHome('compare', { rows: content.home.compare.rows.filter((_, rowIndex) => rowIndex !== index) })}>删除</button>
                    </div>
                  ))}
                  <button type="button" className="admin__button admin__button--small" onClick={() => updateHome('compare', { rows: [...content.home.compare.rows, { label: '', direct: '', market: '' }] })}>+ 添加对比项</button>
                </div>
              </Section>

              <Section title="Bundle 区块">
                <div className="admin__grid admin__grid--two">
                  <Field label="小标签" value={content.home.bundle.eyebrow} onChange={(value) => updateHome('bundle', { eyebrow: value })} />
                  <Field label="第一行标题" value={content.home.bundle.titleLine1} onChange={(value) => updateHome('bundle', { titleLine1: value })} />
                  <Field label="强调标题" value={content.home.bundle.titleLine2} onChange={(value) => updateHome('bundle', { titleLine2: value })} />
                  <Field label="按钮" value={content.home.bundle.cta} onChange={(value) => updateHome('bundle', { cta: value })} />
                </div>
                <Field label="正文" value={content.home.bundle.body} multiline onChange={(value) => updateHome('bundle', { body: value })} />
              </Section>

              <Section title="Closing 区块">
                <div className="admin__grid admin__grid--two">
                  <Field label="小标签" value={content.home.closing.eyebrow} onChange={(value) => updateHome('closing', { eyebrow: value })} />
                  <Field label="第一行标题" value={content.home.closing.titleLine1} onChange={(value) => updateHome('closing', { titleLine1: value })} />
                  <Field label="强调标题" value={content.home.closing.titleLine2} onChange={(value) => updateHome('closing', { titleLine2: value })} />
                  <Field label="主按钮" value={content.home.closing.ctaPrimary} onChange={(value) => updateHome('closing', { ctaPrimary: value })} />
                  <Field label="次按钮" value={content.home.closing.ctaSecondary} onChange={(value) => updateHome('closing', { ctaSecondary: value })} />
                </div>
                <Field label="正文" value={content.home.closing.body} multiline onChange={(value) => updateHome('closing', { body: value })} />
              </Section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
