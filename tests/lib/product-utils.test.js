import { sortByAvailability, filterProducts } from '@/lib/product-utils'

const P = (over = {}) => ({
  id: over.id ?? 1,
  name: over.name ?? 'Produit',
  category: over.category ?? 'Vins',
  stock: 'stock' in over ? over.stock : 5,
  price_particulier: over.price_particulier ?? 10,
  price_pro: over.price_pro ?? 8,
})

describe('sortByAvailability', () => {
  it('puts in-stock products before out-of-stock ones', () => {
    const list = [
      P({ id: 1, name: 'Zeste', stock: 0 }),
      P({ id: 2, name: 'Abricot', stock: 3 }),
    ]
    const sorted = sortByAvailability(list)
    expect(sorted.map((p) => p.id)).toEqual([2, 1])
  })

  it('sorts alphabetically (French) within each availability group', () => {
    const list = [
      P({ id: 1, name: 'Banane', stock: 5 }),
      P({ id: 2, name: 'Abricot', stock: 5 }),
      P({ id: 3, name: 'Fraise', stock: 0 }),
      P({ id: 4, name: 'Cassis', stock: 0 }),
    ]
    expect(sortByAvailability(list).map((p) => p.name)).toEqual([
      'Abricot',
      'Banane',
      'Cassis',
      'Fraise',
    ])
  })

  it('treats stock of 0 and null as unavailable', () => {
    const list = [
      P({ id: 1, name: 'A', stock: null }),
      P({ id: 2, name: 'B', stock: 2 }),
      P({ id: 3, name: 'C', stock: 0 }),
    ]
    expect(sortByAvailability(list)[0].id).toBe(2)
  })

  it('does not mutate the original array', () => {
    const list = [P({ id: 1, stock: 0 }), P({ id: 2, stock: 5 })]
    const copy = [...list]
    sortByAvailability(list)
    expect(list).toEqual(copy)
  })
})

describe('filterProducts', () => {
  const products = [
    P({ id: 1, name: 'Vin rouge', category: 'Vins', stock: 5, price_particulier: 20, price_pro: 15 }),
    P({ id: 2, name: 'Jus de pomme', category: 'Jus', stock: 0, price_particulier: 3, price_pro: 2 }),
    P({ id: 3, name: 'Soupe de tomate', category: 'Soupes', stock: 8, price_particulier: 5, price_pro: 4 }),
  ]

  it('returns all products with no options', () => {
    expect(filterProducts(products)).toHaveLength(3)
  })

  it('filters by search on name (case-insensitive)', () => {
    const r = filterProducts(products, { search: 'VIN' })
    expect(r.map((p) => p.id)).toEqual([1])
  })

  it('filters by search on category', () => {
    const r = filterProducts(products, { search: 'soupes' })
    expect(r.map((p) => p.id)).toEqual([3])
  })

  it('filters by selected categories', () => {
    const r = filterProducts(products, { categories: ['Vins', 'Jus'] })
    expect(r.map((p) => p.id).sort()).toEqual([1, 2])
  })

  it('applies in-stock filter only in pro mode', () => {
    expect(filterProducts(products, { inStockOnly: true, isPro: false })).toHaveLength(3)
    expect(filterProducts(products, { inStockOnly: true, isPro: true })).toHaveLength(2)
  })

  it('sorts by ascending price using the B2C price', () => {
    const r = filterProducts(products, { sortBy: 'price-asc', isPro: false })
    expect(r.map((p) => p.id)).toEqual([2, 3, 1])
  })

  it('sorts by ascending price using the pro price when isPro', () => {
    const r = filterProducts(products, { sortBy: 'price-asc', isPro: true })
    expect(r.map((p) => p.price_pro)).toEqual([2, 4, 15])
  })

  it('sorts by descending price', () => {
    const r = filterProducts(products, { sortBy: 'price-desc', isPro: false })
    expect(r.map((p) => p.id)).toEqual([1, 3, 2])
  })

  it('does not mutate the original array', () => {
    const copy = [...products]
    filterProducts(products, { sortBy: 'price-desc' })
    expect(products).toEqual(copy)
  })
})
