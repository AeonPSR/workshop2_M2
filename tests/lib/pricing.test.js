import { getPrice } from '@/lib/pricing'

describe('getPrice', () => {
  const product = { price_particulier: 10, price_pro: 7 }

  it('returns the particulier price for B2C (isPro = false)', () => {
    expect(getPrice(product, false)).toBe(10)
  })

  it('returns the pro price for B2B (isPro = true)', () => {
    expect(getPrice(product, true)).toBe(7)
  })

  it('falls back to particulier price when pro price is missing', () => {
    expect(getPrice({ price_particulier: 12 }, true)).toBe(12)
  })

  it('falls back to particulier price when pro price is null', () => {
    expect(getPrice({ price_particulier: 12, price_pro: null }, true)).toBe(12)
  })

  it('uses a pro price of 0 (does not fall back on falsy zero)', () => {
    expect(getPrice({ price_particulier: 12, price_pro: 0 }, true)).toBe(0)
  })

  it('returns undefined for a missing product', () => {
    expect(getPrice(undefined, false)).toBeUndefined()
    expect(getPrice(null, true)).toBeUndefined()
  })
})
