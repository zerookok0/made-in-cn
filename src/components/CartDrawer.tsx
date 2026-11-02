import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatPrice, productNameFor, products } from '../data/products'
import { site } from '../data/site'
import { useI18n } from '../i18n'
import { useCart } from '../lib/cart'
import { useEscape, useScrollLock } from '../lib/router'
import { checkout } from '../lib/wordpress'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function CartDrawer() {
  const { locale, t } = useI18n()
  const { lines, isOpen, closeCart, count, subtotalLabel, setQty, removeItem } = useCart()
  const [failed, setFailed] = useState(false)

  useScrollLock(isOpen)
  useEscape(isOpen, closeCart)

  useEffect(() => {
    if (!isOpen) setFailed(false)
  }, [isOpen])

  const handleCheckout = () => {
    setFailed(false)
    const ok = checkout(
      lines.map((line) => ({
        id: line.wooId,
        qty: line.qty,
        variationId: line.variationId,
      })),
    )
    if (!ok) setFailed(true)
  }

  return createPortal(
    <>
      <button
        className={`cart-overlay ${isOpen ? 'is-open' : ''}`}
        type="button"
        onClick={closeCart}
        aria-label={t('cart.close')}
        tabIndex={isOpen ? 0 : -1}
      />
      <aside
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label={t('cart.title')}
      >
        <header>
          <h2>{t('cart.title')} {count > 0 ? `(${count})` : ''}</h2>
          <button className="icon-button" type="button" onClick={closeCart} aria-label={t('cart.close')}>
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M5 8h14l-1.2 11H6.2L5 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </span>
            <p>{t('cart.empty')}</p>
            <button className="btn btn-ghost btn-small" type="button" onClick={closeCart}>
              {t('cart.browse')}
            </button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((line) => {
                const product = products.find((item) => item.slug === line.slug)
                const name = product ? productNameFor(product, locale) : line.name
                return (
                  <div className="cart-line" key={line.key}>
                    <img src={line.image} alt={name} />
                    <div className="cart-line-copy">
                      <strong>{name}</strong>
                      <span>{line.variantLabel ?? formatPrice(line.price, line.currency)} {t('cart.each')}</span>
                      <span>{formatPrice(line.price * line.qty, line.currency)}</span>
                      <div className="qty">
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          disabled={line.qty <= 1}
                          aria-label={t('cart.decrease', { name })}
                        >
                          −
                        </button>
                        <span>{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          disabled={line.qty >= 99}
                          aria-label={t('cart.increase', { name })}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button className="remove" type="button" onClick={() => removeItem(line.key)} aria-label={t('cart.removeAria', { name })}>
                      {t('cart.remove')}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>{t('cart.subtotal')}</span>
                <strong>{subtotalLabel}</strong>
              </div>
              <button className="btn btn-primary" type="button" onClick={handleCheckout}>
                {t('cart.checkout')}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </button>
              <p>{failed ? t('cart.notConnected', { email: site.email }) : t('cart.secure')}</p>
            </div>
          </>
        )}
      </aside>
    </>,
    document.body,
  )
}
