import { getPrice } from "./pricing";

/**
 * Sort products: available (stock > 0) first, then unavailable,
 * each group ordered alphabetically by name (French collation).
 *
 * @param {Array} products
 * @returns {Array} a new, sorted array
 */
export function sortByAvailability(products) {
  return [...products].sort((a, b) => {
    const aIn = a.stock > 0 ? 0 : 1;
    const bIn = b.stock > 0 ? 0 : 1;
    if (aIn !== bIn) return aIn - bIn;
    return (a.name ?? "").localeCompare(b.name ?? "", "fr");
  });
}

/**
 * Filter and sort products for the catalogue view.
 *
 * @param {Array} products
 * @param {object} options
 * @param {string} [options.search] - matches product name or category (case-insensitive)
 * @param {string[]} [options.categories] - keep only products in these categories
 * @param {boolean} [options.inStockOnly] - only applied in pro mode
 * @param {"default"|"price-asc"|"price-desc"} [options.sortBy]
 * @param {boolean} [options.isPro]
 * @returns {Array} a new, filtered/sorted array
 */
export function filterProducts(
  products,
  {
    search = "",
    categories = [],
    inStockOnly = false,
    sortBy = "default",
    isPro = false,
  } = {},
) {
  let result = [...products];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  }

  if (categories.length > 0) {
    result = result.filter((p) => categories.includes(p.category));
  }

  // Stock filtering is a pro-only feature.
  if (inStockOnly && isPro) {
    result = result.filter((p) => p.stock > 0);
  }

  if (sortBy === "price-asc") {
    result.sort((a, b) => getPrice(a, isPro) - getPrice(b, isPro));
  } else if (sortBy === "price-desc") {
    result.sort((a, b) => getPrice(b, isPro) - getPrice(a, isPro));
  }

  return result;
}
