"use server";

import { getConnectedOdooClient } from "./odoo-client";

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL;

// Pricelist used for the "professionnel" (B2B) prices. The B2C "Particulier"
// pricelist has no rules, so its price is simply the product's list_price.
// TODO: when auth is wired, resolve the real pricelist from the logged-in
// partner's `property_product_pricelist` instead of this fixed id.
const B2B_PRICELIST_ID = 5; // "Revendeurs"

// Odoo product categories that are internal/accounting, not real rayons.
const INTERNAL_CATEGORIES = new Set([
  "Goods",
  "Services",
  "Expenses",
  "Deliveries",
  "Food",
  "All",
  "Saleable",
]);

function imageUrl(model, id) {
  if (model === "product.template") {
    // Route through our authenticated proxy so Odoo serves the real image.
    return `/api/product-image/${id}`;
  }
  // Partners (producers) are still served directly — confirmed public.
  return `${ODOO_URL}/web/image/${model}/${id}/image_512`;
}

/**
 * Live products from Odoo (`product.template`), with both B2C and B2B prices
 * resolved so the UI can switch on the pro toggle without refetching.
 */
export async function getProducts() {
  const odoo = await getConnectedOdooClient();

  const products = await odoo.execute_kw("product.template", "search_read", [
    [
      ["sale_ok", "=", true],
      ["list_price", ">", 0],
    ],
    ["id", "name", "list_price", "categ_id", "qty_available", "image_512"],
    0,
    500,
  ]);

  // Map product_tmpl_id -> fixed B2B price from the pricelist rules.
  const rules = await odoo.execute_kw("product.pricelist.item", "search_read", [
    [
      ["pricelist_id", "=", B2B_PRICELIST_ID],
      ["applied_on", "=", "1_product"],
      ["compute_price", "=", "fixed"],
    ],
    ["product_tmpl_id", "fixed_price"],
    0,
    1000,
  ]);
  const proPrice = {};
  for (const r of rules) {
    if (r.product_tmpl_id) proPrice[r.product_tmpl_id[0]] = r.fixed_price;
  }

  return products
    .filter((p) => !p.categ_id || !INTERNAL_CATEGORIES.has(p.categ_id[1]))
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.categ_id ? p.categ_id[1] : null,
      image_url: p.image_512 ? `/api/product-image/${p.id}` : null,
      price_particulier: p.list_price,
      price_pro: proPrice[p.id] ?? p.list_price,
      stock: p.qty_available,
    }))
    .sort((a, b) => {
      const aIn = a.stock > 0 ? 0 : 1;
      const bIn = b.stock > 0 ? 0 : 1;
      if (aIn !== bIn) return aIn - bIn;
      return a.name.localeCompare(b.name, "fr");
    });
}

/** Live rayon names from Odoo (`product.category`), internal ones removed. */
export async function getCategories() {
  const odoo = await getConnectedOdooClient();
  const cats = await odoo.execute_kw("product.category", "search_read", [
    [],
    ["name"],
    0,
    100,
  ]);
  return [
    ...new Set(
      cats.map((c) => c.name).filter((n) => !INTERNAL_CATEGORIES.has(n)),
    ),
  ];
}

/** Live producers for the homepage preview (`res.partner` companies). */
export async function getFeaturedProducers() {
  const odoo = await getConnectedOdooClient();
  const partners = await odoo.execute_kw("res.partner", "search_read", [
    [
      ["is_company", "=", true],
      ["name", "!=", false],
    ],
    ["id", "name", "city"],
    0,
    12,
  ]);
  return partners.map((p) => ({
    id: p.id,
    name: p.name,
    location: p.city || "France",
    image_url: imageUrl("res.partner", p.id),
  }));
}
