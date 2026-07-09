"use server";

import { getConnectedOdooClient } from "./odoo-client";
import { sortByAvailability } from "@/lib/product-utils";
import {
  buildProPriceMap,
  isRealCategory,
  mapProduct,
  toRayonNames,
} from "@/lib/odoo-mapping";

const ODOO_URL = process.env.ODOO_URL || process.env.NEXT_PUBLIC_ODOO_URL;

function imageUrl(model, id) {
  if (model === "product.template") {
    // Route through our authenticated proxy so Odoo serves the real image.
    return `/api/product-image/${id}`;
  }
  // Partners (producers) are still served directly — confirmed public.
  return `${ODOO_URL}/web/image/${model}/${id}/image_512`;
}

/**
 * Live products from Odoo (`product.template`). `price_pro` is resolved from
 * the given pricelist (the logged-in partner's `property_product_pricelist`);
 * pass `null` for anonymous/particulier visitors to skip that lookup.
 */
export async function getProducts(pricelistId) {
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

  // Map product_tmpl_id -> fixed price from the partner's pricelist rules.
  let proPrice = {};
  if (pricelistId) {
    const rules = await odoo.execute_kw("product.pricelist.item", "search_read", [
      [
        ["pricelist_id", "=", pricelistId],
        ["applied_on", "=", "1_product"],
        ["compute_price", "=", "fixed"],
      ],
      ["product_tmpl_id", "fixed_price"],
      0,
      1000,
    ]);
    proPrice = buildProPriceMap(rules);
  }

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


export async function getProductById(productId, pricelistId) {
  try {
    const odoo = await getConnectedOdooClient();

    const products = await odoo.execute_kw("product.template", "search_read", [
      [
        ["id", "=", parseInt(productId)],
        ["sale_ok", "=", true],
      ],
      ["id", "name", "list_price", "categ_id", "qty_available", "image_512"],
    ]);

    if (!products || products.length === 0) {
      return null;
    }

    const p = products[0];

    let proPriceValue = p.list_price;

    if (pricelistId) {
      const rules = await odoo.execute_kw("product.pricelist.item", "search_read", [
        [
          ["pricelist_id", "=", pricelistId],
          ["applied_on", "=", "1_product"],
          ["compute_price", "=", "fixed"],
          ["product_tmpl_id", "=", p.id],
        ],
        ["fixed_price"],
      ]);

      if (rules && rules.length > 0) {
        proPriceValue = rules[0].fixed_price;
      }
    }
    const categoryName = Array.isArray(p.categ_id) ? p.categ_id[1] : "Non classé";

    const imageUrl = p.image_512
      ? `data:image/png;base64,${p.image_512}`
      : null;

    return {
      category: categoryName,
      id: p.id,
      image_url: imageUrl,
      name: p.name,
      price_particulier: p.list_price,
      price_pro: proPriceValue,
      stock: p.qty_available || 0
    };

  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${productId}:`, error.message);
    throw error;
  }
}