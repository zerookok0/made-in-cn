import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { formatPrice } from '../data/products'
import { site } from '../data/site'
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
        aria-label="Close cart"
        tabIndex={isOpen ? 0 : -1}
      />
      <aside
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Shopping cart"
      >
        <header>
          <h2>Your cart {count > 0 ? `(${count})` : ''}</h2>
          <button className="icon-button" type="button" onClick={closeCart} aria-label="Close cart">
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
            <p>Your cart is empty.</p>
            <button className="btn btn-ghost btn-small" type="button" onClick={closeCart}>
              Keep exploring
            </button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((line) => (
                <div className="cart-line" key={line.key}>
                  <img src={line.image} alt={line.name} />
                  <div className="cart-line-copy">
                    <strong>{line.name}</strong>
                    <span>{line.variantLabel ?? formatPrice(line.price, line.currency)} each</span>
                    <span>{formatPrice(line.price * line.qty, line.currency)}</span>
                    <div className="qty">
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.qty - 1)}
                        disabled={line.qty <= 1}
                        aria-label={`Decrease ${line.name} quantity`}
                      >
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.qty + 1)}
                        disabled={line.qty >= 99}
                        aria-label={`Increase ${line.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button className="remove" type="button" onClick={() => removeItem(line.key)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Subtotal</span>
                <strong>{subtotalLabel}</strong>
              </div>
              <button className="btn btn-primary" type="button" onClick={handleCheckout}>
                Checkout
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </button>
              <p>
                {failed
                  ? `Checkout is not connected yet. Set VITE_WP_SITE_URL or email ${site.email}.`
                  : 'Secure checkout is handled by our WooCommerce store.'}
              </p>
            </div>
          </>
        )}
      </aside>
    </>,
    document.body,
  )
}
