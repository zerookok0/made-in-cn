import { AppLink } from '../components/AppLink'
import { useDocumentMeta } from '../lib/router'

export function NotFoundPage() {
  useDocumentMeta('Page not found — MADE IN CN')

  return (
    <section className="missing-page">
      <p className="eyebrow">404</p>
      <h1>This page is not in the edit.</h1>
      <p>The link may be old, or the object may have moved on.</p>
      <div className="missing-actions">
        <AppLink className="btn btn-primary" href="/shop">Browse the shop</AppLink>
        <AppLink className="btn btn-ghost" href="/">Back home</AppLink>
      </div>
    </section>
  )
}
