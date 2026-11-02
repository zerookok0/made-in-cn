import { AppLink } from '../components/AppLink'
import { useI18n } from '../i18n'
import { useDocumentMeta } from '../lib/router'

export function NotFoundPage() {
  const { t } = useI18n()
  useDocumentMeta(`${t('notfound.title')} — MADE IN CN`)

  return (
    <section className="missing-page">
      <p className="eyebrow">{t('notfound.eyebrow')}</p>
      <h1>{t('notfound.title')}</h1>
      <p>{t('notfound.body')}</p>
      <div className="missing-actions">
        <AppLink className="btn btn-primary" href="/shop">{t('notfound.shop')}</AppLink>
        <AppLink className="btn btn-ghost" href="/">{t('notfound.home')}</AppLink>
      </div>
    </section>
  )
}
