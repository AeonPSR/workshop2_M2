// Logique panier pure, séparée d'AppContext pour être testable sans rendre
// de composant React. `cart` est toujours un tableau de { id: productId, qty }.

// Prix résolu selon le profil (B2B/B2C) — source unique dans lib/pricing.
export { getPrice } from "./pricing";

export function addItem(cart, products, productId, qty = 1) {
  const product = products.find((p) => p.id === productId);
  const stock = product?.stock ?? Infinity;
  if (stock <= 0) return cart;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    const newQty = Math.min(existing.qty + qty, stock);
    return cart.map((item) =>
      item.id === productId ? { ...item, qty: newQty } : item,
    );
  }
  return [...cart, { id: productId, qty: Math.min(qty, stock) }];
}

export function removeItem(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

export function setItemQty(cart, products, productId, qty) {
  if (qty <= 0) return removeItem(cart, productId);

  const product = products.find((p) => p.id === productId);
  const stock = product?.stock ?? Infinity;
  const clamped = Math.min(qty, stock);
  return cart.map((item) =>
    item.id === productId ? { ...item, qty: clamped } : item,
  );
}

// Cale les quantités sur le stock actuel et retire les lignes en rupture.
// Renvoie la même référence de tableau si rien n'a changé, pour permettre
// aux appelants (setState) d'éviter un re-render/persist inutile.
export function revalidateCart(cart, products) {
  if (products.length === 0) return cart;

  let changed = false;
  const next = [];
  for (const item of cart) {
    const product = products.find((p) => p.id === item.id);
    if (!product || product.stock <= 0) {
      changed = true;
      continue;
    }
    const clampedQty = Math.min(item.qty, product.stock);
    if (clampedQty !== item.qty) changed = true;
    if (clampedQty > 0) next.push({ ...item, qty: clampedQty });
  }
  return changed ? next : cart;
}

export function cartCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
