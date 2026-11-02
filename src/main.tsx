import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n'
import { RouterProvider } from './lib/router'
import {
  GEO_COOKIE_SETTLED,
  readCookie,
  resolveByGeo,
  resolveInitialLocale,
  type ResolvedLocale,
} from './lib/locale'
import './styles.css'

let geoAttempt: Promise<ResolvedLocale | null> | null = null

function resolveGeoOnce(): Promise<ResolvedLocale | null> {
  if (!geoAttempt) geoAttempt = resolveByGeo()
  return geoAttempt
}

function Root() {
  const [initial] = useState(() => resolveInitialLocale())
  const [{ locale, auto }, setResolution] = useState<ResolvedLocale>(initial)

  useEffect(() => {
    if (readCookie(GEO_COOKIE_SETTLED)) return
    let cancelled = false

    resolveGeoOnce()
      .then((resolved) => {
        if (cancelled || !resolved) return
        setResolution((current) =>
          current.locale === resolved.locale && current.auto === resolved.auto ? current : resolved,
        )
      })
      .catch(() => {
        /* Detection is best-effort; keep the synchronous locale. */
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <I18nProvider initialLocale={locale} autoDetected={auto}>
      <RouterProvider>
        <App />
      </RouterProvider>
    </I18nProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
