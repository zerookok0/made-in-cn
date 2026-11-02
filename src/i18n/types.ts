/**
 * LOCALE TYPES
 * ------------------------------------------------------------------
 * `en` is the source of truth: it is built from the copy that already
 * ships on the site. Every other locale is typed as `Dict`, so a missing
 * key is a build error rather than a silent English leak at runtime.
 */

export type Locale = 'en' | 'vi'

export const LOCALES: Locale[] = ['en', 'vi']

/** Locale used when nothing else applies (and the crawler-safe default). */
export const DEFAULT_LOCALE: Locale = 'en'

/** BCP 47 tag written to <html lang>. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  vi: 'vi-VN',
}

/** Native name shown in the switcher. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
}

/** Short tag shown on the trigger button. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  vi: 'VI',
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value)
}

/**
 * Flat key dictionary. Keys are dotted namespaces ("home.hero.sub") so a
 * translator can read the file top to bottom without opening a component.
 */
export type Dict = Record<string, string>

export type DictKey = string
