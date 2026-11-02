import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export interface Route {
  path: string
  query: URLSearchParams
}

const RouteContext = createContext<Route>({ path: '/', query: new URLSearchParams() })

const ROUTER_MODE: 'hash' | 'history' =
  (import.meta.env.VITE_ROUTER as string | undefined) === 'history' ? 'history' : 'hash'

function readLocation(): Route {
  if (ROUTER_MODE === 'hash') {
    const raw = window.location.hash.replace(/^#/, '') || '/'
    const [pathname, search = ''] = raw.split('?')
    return {
      path: (pathname || '/').replace(/\/+$/, '') || '/',
      query: new URLSearchParams(search),
    }
  }

  const { pathname, search } = window.location
  const path = pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/'
  return { path, query: new URLSearchParams(search) }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(readLocation)

  useEffect(() => {
    const onChange = () => setRoute(readLocation())
    window.addEventListener('popstate', onChange)
    window.addEventListener('hashchange', onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('hashchange', onChange)
    }
  }, [])

  return <RouteContext.Provider value={route}>{children}</RouteContext.Provider>
}

export function useRoute(): Route {
  return useContext(RouteContext)
}

export function toHref(href: string): string {
  if (ROUTER_MODE === 'hash') return href.startsWith('#') ? href : `#${href}`
  return href
}

export function navigate(href: string, opts: { replace?: boolean } = {}) {
  try {
    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) {
      window.location.href = href
      return
    }
  } catch {
    window.location.href = href
    return
  }

  const target = ROUTER_MODE === 'hash' ? `#${href}` : href

  if (opts.replace) window.history.replaceState({}, '', target)
  else window.history.pushState({}, '', target)

  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}

export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, onEscape])
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    if (description) setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    if (description) setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    if (description) setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
  }, [title, description])
}
