/**
 * Resolve the price a customer sees for a product.
 *
 * B2C ("particulier") uses `price_particulier`.
 * B2B ("pro") uses `price_pro`, falling back to `price_particulier`
 * when the product has no dedicated pro price.
 *
 * @param {{ price_particulier?: number, price_pro?: number }} product
 * @param {boolean} isPro
 * @returns {number | undefined}
 */
export function getPrice(product, isPro) {
  if (!product) return undefined;
  return isPro
    ? (product.price_pro ?? product.price_particulier)
    : product.price_particulier;
}
