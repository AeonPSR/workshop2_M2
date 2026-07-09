"use server";

import { getConnectedOdooClient } from "./odoo-client";
import { sortByAvailability } from "@/lib/product-utils";
import {
  buildProPriceMap,
  isRealCategory,
  mapProduct,
  toRayonNames,
} from "@/lib/odoo-mapping";

const ODOO_URL = process.env.NEXT_PUBLIC_ODOO_URL;

// Pricelist used for the "professionnel" (B2B) prices. The B2C "Particulier"
// pricelist has no rules, so its price is simply the product's list_price.
// TODO: when auth is wired, resolve the real pricelist from the logged-in
// partner's `property_product_pricelist` instead of this fixed id.
const B2B_PRICELIST_ID = 5; // "Revendeurs"

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
  const proPrice = buildProPriceMap(rules);

  return sortByAvailability(
    products.filter(isRealCategory).map((p) => mapProduct(p, proPrice)),
  );
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
  return toRayonNames(cats);
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
