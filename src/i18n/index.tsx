/**
 * i18n RUNTIME
 * ------------------------------------------------------------------
 * Deliberately small: no dependency, no context waterfall, no ICU.
 *
 *  - Dictionaries are flat maps of dotted keys → strings.
 *  - `t()` does `{placeholders}` interpolation and falls back through
 *    vi → en. A missing key in development logs once, not per render.
 *  - The <html lang> attribute is kept in sync here, so every page
 *    updates it without extra wiring.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import en from './locales/en'
import vi from './locales/vi'
import { DEFAULT_LOCALE, HTML_LANG, isLocale, type Dict, type Locale } from './types'
import { readStoredLocale, persistLocale } from '../lib/locale'

export { LOCALES, LOCALE_LABEL, LOCALE_SHORT, HTML_LANG, DEFAULT_LOCALE } from './types'
export type { Locale } from './types'

const DICTS: Record<Locale, Dict> = { en, vi }

/** Fallback chain per locale. vi → en (source of truth). */
const FALLBACK: Record<Locale, Locale[]> = {
  en: ['en'],
  vi: ['vi', 'en'],
}

const isDev = import.meta.env.DEV

/** Keys already reported, so one gap does not flood the console. */
const warned = new Set<string>()

export type TFn = (key: string, vars?: Record<string, string | number>) => string

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  )
}

function resolve(locale: Locale, key: string): string | undefined {
  for (const candidate of FALLBACK[locale]) {
    const value = DICTS[candidate][key]
    if (typeof value === 'string' && value !== '') return value
  }
  return undefined
}

interface I18nValue {
  locale: Locale
  setLocale: (next: Locale) => void
  t: TFn
  /** True when the active locale came from IP/browser, not a manual choice. */
  isAuto: boolean
}

const I18nContext = createContext<I18nValue | null>(null)

interface I18nProviderProps {
  children: ReactNode
  /** Locale resolved before first paint (cookie → IP → browser → default). */
  initialLocale?: Locale
  autoDetected?: boolean
}

export function I18nProvider({ children, initialLocale, autoDetected = false }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (isLocale(initialLocale)) return initialLocale
    const stored = readStoredLocale()
    return stored ?? DEFAULT_LOCALE
  })

  /** True while the visitor has not picked a language by hand. */
  const [isAuto, setIsAuto] = useState(autoDetected)

  /**
   * Once the visitor has chosen a language themselves, nothing automatic may
   * overwrite it — not a later IP result, not a re-render.
   */
  const userChosen = useRef(false)

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return
    userChosen.current = true
    setLocaleState(next)
    setIsAuto(false)
    persistLocale(next)
  }, [])

  /*
   * IP detection resolves after mount and lifts a new locale into this prop.
   * A `useState` initialiser runs only once, so without this effect the geo
   * result would be received and then silently ignored. It is skipped entirely
   * for a visitor who has already chosen a language.
   */
  useEffect(() => {
    if (userChosen.current) return
    if (!isLocale(initialLocale)) return
    setLocaleState((current) => (current === initialLocale ? current : initialLocale))
  }, [initialLocale])

  /* Keep the document in step with the active locale. */
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale]
    document.documentElement.dataset.locale = locale
  }, [locale])

  const t = useCallback<TFn>(
    (key, vars) => {
      const value = resolve(locale, key)

      if (value === undefined) {
        if (isDev && !warned.has(`${locale}:${key}`)) {
          warned.add(`${locale}:${key}`)
          console.warn(`[i18n] missing key "${key}" for locale "${locale}"`)
        }
        return key
      }

      return interpolate(value, vars)
    },
    [locale],
  )

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, t, isAuto }),
    [locale, setLocale, t, isAuto],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

/** Shorthand for components that only need the translator. */
export function useT(): TFn {
  return useI18n().t
}
