import { useEffect, useRef, useState } from 'react'
import { useI18n, LOCALE_LABEL, LOCALE_SHORT, LOCALES, HTML_LANG } from '../i18n'

function Globe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5M12 3.5C9.8 5.9 8.7 8.8 8.7 12s1.1 6.1 3.3 8.5" />
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="m5 12 4.2 4.2L19 6.5" />
    </svg>
  )
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const choose = (next: (typeof LOCALES)[number]) => {
    setLocale(next)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div className="lang" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="lang__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('lang.switcherAria', { language: LOCALE_LABEL[locale] })}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe />
        <span className="lang__code" aria-hidden="true">{LOCALE_SHORT[locale]}</span>
        <span className={`lang__chevron ${open ? 'is-open' : ''}`} aria-hidden="true" />
      </button>

      <div className={`lang__panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <p className="lang__title">{t('lang.groupAria')}</p>
        <ul role="listbox" aria-label={t('lang.menuAria')}>
          {LOCALES.map((code) => {
            const active = code === locale
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={`lang__option ${active ? 'is-active' : ''}`}
                  lang={HTML_LANG[code]}
                  tabIndex={open ? 0 : -1}
                  onClick={() => choose(code)}
                >
                  <span className="lang__option-name">{LOCALE_LABEL[code]}</span>
                  <span className="lang__option-code">{LOCALE_SHORT[code]}</span>
                  {active && <span className="lang__check"><Check /></span>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
