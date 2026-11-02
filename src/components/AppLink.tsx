import type { MouseEvent, ReactNode } from 'react'
import { navigate, toHref } from '../lib/router'

interface AppLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  ariaLabel?: string
  external?: boolean
  title?: string
}

export function AppLink({
  href,
  children,
  className,
  onClick,
  ariaLabel,
  external,
  title,
}: AppLinkProps) {
  const isExternal =
    external ||
    /^https?:\/\//i.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')

  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isExternal) {
      onClick?.()
      return
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    onClick?.()
    navigate(href)
  }

  return (
    <a
      href={isExternal ? href : toHref(href)}
      className={className}
      onClick={handle}
      aria-label={ariaLabel}
      title={title}
      {...(isExternal && href.startsWith('http')
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      {children}
    </a>
  )
}
