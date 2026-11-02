import type { Currency } from '../types'

export function money(value: number, currency: Currency = 'USD') {
  if (currency === 'VND') {
    return `${value.toLocaleString('vi-VN')} ₫`
  }

  return `$${value.toFixed(0)}`
}
