/**
 * Pure transforms between raw Odoo records and the app's data shapes.
 * Kept free of the Odoo client so they can be unit-tested in isolation.
 */

// Odoo product categories that are internal/accounting, not real rayons.
export const INTERNAL_CATEGORIES = new Set([
  "Goods",
  "Services",
  "Expenses",
  "Deliveries",
  "Food",
  "All",
  "Saleable",
]);

/**
 * Build a map of `product_tmpl_id -> fixed B2B price` from pricelist item rules.
 * @param {Array<{ product_tmpl_id?: [number, string], fixed_price?: number }>} rules
 * @returns {Record<number, number>}
 */
export function buildProPriceMap(rules = []) {
  const map = {};
  for (const r of rules) {
    if (r.product_tmpl_id) map[r.product_tmpl_id[0]] = r.fixed_price;
  }
  return map;
}

/**
 * Whether a raw product row belongs to a real rayon (not an internal category).
 * Products with no category are kept.
 */
export function isRealCategory(row) {
  return !row.categ_id || !INTERNAL_CATEGORIES.has(row.categ_id[1]);
}

/**
 * Map a raw Odoo `product.template` row into the app's product shape.
 * @param {object} row - raw Odoo record
 * @param {Record<number, number>} [proPriceMap]
 */
export function mapProduct(row, proPriceMap = {}) {
  return {
    id: row.id,
    name: row.name,
    // Odoo many2one comes back as [id, "label"] or false.
    category: row.categ_id ? row.categ_id[1] : null,
    // image_512 is falsy when the product has no uploaded image.
    image_url: row.image_512 ? `/api/product-image/${row.id}` : null,
    price_particulier: row.list_price,
    // Fall back to the public price when there is no dedicated B2B price.
    price_pro: proPriceMap[row.id] ?? row.list_price,
    stock: row.qty_available,
  };
}

/**
 * Reduce raw `product.category` rows to a unique list of real rayon names.
 * @param {Array<{ name: string }>} categories
 * @returns {string[]}
 */
export function toRayonNames(categories = []) {
  return [
    ...new Set(
      categories.map((c) => c.name).filter((n) => !INTERNAL_CATEGORIES.has(n)),
    ),
  ];
}
