/**
 * LOCALE RESOLUTION
 * ------------------------------------------------------------------
 * Everything that decides "which language is this visitor reading"
 * lives here, so no component has to know about cookies or geo lookups.
 *
 * Precedence, highest first:
 *   1. manual choice   — localStorage `preferred-locale`, then cookie
 *   2. IP country      — cached 7 days, resolved once, never re-decided
 *   3. navigator.language
 *   4. DEFAULT_LOCALE
 *
 * A manual choice is never overwritten: once it exists, IP detection is
 * not even called.
 */

import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '../i18n/types'

/** Public cookie name. NEXT_LOCALE is the common convention on WP setups. */
export const LOCALE_COOKIE = 'NEXT_LOCALE'

/**
 * Records that geo has already been decided for this visitor, so the
 * lookup is not repeated on every page load and cannot loop. It says
 * nothing about which language is active — only that a decision was made.
 */
export const GEO_COOKIE_SETTLED = 'GEO_SETTLED'

const STORAGE_KEY = 'preferred-locale'
const GEO_CACHE_KEY = 'geo-country'
const GEO_CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days
const GEO_TIMEOUT = 3000 // 3 seconds, per spec
const GEO_ENDPOINT = 'https://ipapi.co/country/'

/* ------------------------------------------------------------------ */
/* Cookie helpers                                                      */
/* ------------------------------------------------------------------ */

export function readCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

function writeCookie(name: string, value: string, days = 365): void {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    const base = `path=/; expires=${expires}; SameSite=Lax`
    // Written both at the app root and at the subdirectory the bundle sits in,
    // so a WordPress install at /site/ still receives the cookie.
    document.cookie = `${name}=${encodeURIComponent(value)}; ${base}`
  } catch {
    /* cookies may be blocked — localStorage still carries the choice */
  }
}

/* ------------------------------------------------------------------ */
/* Manual choice                                                       */
/* ------------------------------------------------------------------ */

/** Reads a visitor's explicit choice. null means they never made one. */
export function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    /* private mode */
  }

  const cookie = readCookie(LOCALE_COOKIE)
  return isLocale(cookie) ? cookie : null
}

/** Persists a manual choice to both localStorage and the cookie. */
export function persistLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* private mode — the cookie below still carries it */
  }
  writeCookie(LOCALE_COOKIE, locale)
}

/* ------------------------------------------------------------------ */
/* IP detection                                                        */
/* ------------------------------------------------------------------ */

interface GeoCache {
  country: string
  at: number
}

function readGeoCache(): string | null {
  try {
    const raw = window.localStorage.getItem(GEO_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GeoCache
    if (!parsed || typeof parsed.country !== 'string') return null
    if (Date.now() - parsed.at > GEO_CACHE_TTL) return null
    return parsed.country
  } catch {
    return null
  }
}

function writeGeoCache(country: string): void {
  try {
    const payload: GeoCache = { country, at: Date.now() }
    window.localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* storage full or blocked — the cookie below still helps */
  }
}

/** Maps a country code to a locale. Only VN differs from the default. */
export function countryToLocale(country: string | null | undefined): Locale {
  if (!country) return DEFAULT_LOCALE
  return country.trim().toUpperCase() === 'VN' ? 'vi' : DEFAULT_LOCALE
}

/**
 * Resolves the visitor's country with a hard 3s timeout.
 * Returns null on any failure — callers fall back silently, and no
 * exception ever reaches the console.
 */
export async function detectCountry(): Promise<string | null> {
  const cached = readGeoCache()
  if (cached) return cached

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), GEO_TIMEOUT)

  try {
    const res = await fetch(GEO_ENDPOINT, {
      signal: controller.signal,
      headers: { Accept: 'text/plain' },
      credentials: 'omit',
    })

    if (!res.ok) return null

    const text = (await res.text()).trim()
    // ipapi.co/country/ returns a bare two-letter code, e.g. "VN".
    const country = /^[A-Za-z]{2}$/.test(text) ? text.toUpperCase() : null

    if (country) writeGeoCache(country)
    return country
  } catch {
    // Abort, network error, CORS, offline: all collapse to "unknown".
    return null
  } finally {
    window.clearTimeout(timer)
  }
}

/* ------------------------------------------------------------------ */
/* Browser hint                                                        */
/* ------------------------------------------------------------------ */

function browserLocale(): Locale | null {
  try {
    const candidates = [navigator.language, ...(navigator.languages ?? [])]
    for (const tag of candidates) {
      const short = tag?.slice(0, 2).toLowerCase()
      const match = LOCALES.find((l) => l === short)
      if (match) return match
    }
  } catch {
    /* not available */
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Public resolver                                                     */
/* ------------------------------------------------------------------ */

export interface ResolvedLocale {
  locale: Locale
  /** True when nothing was stored — i.e. this came from geo or browser. */
  auto: boolean
}

/**
 * Synchronous resolution for the first paint.
 * Reads only what is already on disk: a manual choice, or a browser hint.
 * IP detection is asynchronous and runs after mount (see resolveByGeo).
 */
export function resolveInitialLocale(): ResolvedLocale {
  const stored = readStoredLocale()
  if (stored) return { locale: stored, auto: false }

  const hint = browserLocale()
  return { locale: hint ?? DEFAULT_LOCALE, auto: hint !== null }
}

/**
 * Async resolver for a first visit with no stored choice.
 *
 * Returns null when the visitor already has a preference, and also when the
 * lookup itself fails. A failed lookup must not be mistaken for "this visitor
 * is not in Vietnam" — that would overwrite a perfectly good browser-language
 * hint with the default. Failure therefore means "no opinion", and whatever the
 * synchronous pass already decided simply stays in place.
 *
 * Whatever the outcome, the attempt is recorded so the visitor is asked about
 * their country once, not on every page view. That record is what makes repeat
 * requests and redirect loops impossible.
 */
export async function resolveByGeo(): Promise<ResolvedLocale | null> {
  if (readStoredLocale()) return null

  let country: string | null = null
  try {
    country = await detectCountry()
  } catch {
    /* detectCountry already swallows everything; belt and braces. */
    country = null
  }

  /* Mark the question as asked even when it could not be answered. */
  writeCookie(GEO_COOKIE_SETTLED, '1', 30)

  /* No country means no opinion: leave the current locale untouched. */
  if (!country) return null

  const locale = countryToLocale(country)
  writeCookie(LOCALE_COOKIE, locale, 7)

  return { locale, auto: true }
}
