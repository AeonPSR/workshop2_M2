import {
  buildProPriceMap,
  isRealCategory,
  mapProduct,
  toRayonNames,
} from '@/lib/odoo-mapping'

describe('buildProPriceMap', () => {
  it('maps product_tmpl_id to fixed_price', () => {
    const rules = [
      { product_tmpl_id: [92, 'Soupe'], fixed_price: 3.53 },
      { product_tmpl_id: [79, 'Autre'], fixed_price: 3.99 },
    ]
    expect(buildProPriceMap(rules)).toEqual({ 92: 3.53, 79: 3.99 })
  })

  it('ignores rules without a product_tmpl_id', () => {
    const rules = [
      { product_tmpl_id: false, fixed_price: 5 },
      { product_tmpl_id: [1, 'X'], fixed_price: 2 },
    ]
    expect(buildProPriceMap(rules)).toEqual({ 1: 2 })
  })

  it('returns an empty map for no rules', () => {
    expect(buildProPriceMap()).toEqual({})
  })
})

describe('isRealCategory', () => {
  it('keeps products in a real category', () => {
    expect(isRealCategory({ categ_id: [24, 'Vins'] })).toBe(true)
  })

  it('keeps products with no category', () => {
    expect(isRealCategory({ categ_id: false })).toBe(true)
  })

  it('drops products in an internal category', () => {
    expect(isRealCategory({ categ_id: [1, 'Services'] })).toBe(false)
    expect(isRealCategory({ categ_id: [2, 'Expenses'] })).toBe(false)
  })
})

describe('mapProduct', () => {
  const row = {
    id: 14,
    name: 'Altitude 300',
    categ_id: [24, 'Vins'],
    list_price: 17.82,
    qty_available: 15,
    image_512: 'BASE64DATA',
  }

  it('maps a full row to the app shape', () => {
    expect(mapProduct(row, { 14: 12.5 })).toEqual({
      id: 14,
      name: 'Altitude 300',
      category: 'Vins',
      image_url: '/api/product-image/14',
      price_particulier: 17.82,
      price_pro: 12.5,
      stock: 15,
    })
  })

  it('sets category to null when categ_id is false', () => {
    expect(mapProduct({ ...row, categ_id: false }).category).toBeNull()
  })

  it('sets image_url to null when there is no image', () => {
    expect(mapProduct({ ...row, image_512: false }).image_url).toBeNull()
  })

  it('falls back to list_price when no pro price exists', () => {
    expect(mapProduct(row, {}).price_pro).toBe(17.82)
  })

  it('uses the pro price when present in the map', () => {
    expect(mapProduct(row, { 14: 9.9 }).price_pro).toBe(9.9)
  })
})

describe('toRayonNames', () => {
  it('returns unique names with internal categories removed', () => {
    const cats = [
      { name: 'Vins' },
      { name: 'Services' },
      { name: 'Vins' },
      { name: 'Goods' },
      { name: 'Jus' },
    ]
    expect(toRayonNames(cats)).toEqual(['Vins', 'Jus'])
  })

  it('returns an empty array for no categories', () => {
    expect(toRayonNames()).toEqual([])
  })
})
