"use server";

import { getConnectedOdooClient } from "./odoo-client";

/**
 * Reuse an existing `res.partner` matching the given email, or create a new
 * one. Used for guest checkout (visitors/particuliers without an account).
 */
export async function findOrCreateGuestPartner({ name, email, phone }) {
  const odoo = await getConnectedOdooClient();

  const existing = await odoo.execute_kw("res.partner", "search_read", [
    [["email", "=", email]],
    ["id"],
    0,
    1,
  ]);
  if (existing.length > 0) return existing[0].id;

  const id = await odoo.execute_kw("res.partner", "create", [
    {
      name,
      email,
      phone,
      company_type: "person",
    },
  ]);
  return id;
}

/**
 * Maps `product.template` ids to their `product.product` (variant) id —
 * `sale.order.line` needs the latter. Assumes no product has variants
 * (one product.product per template), which holds for this catalog.
 */
export async function resolveProductVariantIds(templateIds) {
  const odoo = await getConnectedOdooClient();
  const variants = await odoo.execute_kw("product.product", "search_read", [
    [["product_tmpl_id", "in", templateIds]],
    ["id", "product_tmpl_id"],
    0,
    templateIds.length,
  ]);

  const map = {};
  for (const v of variants) {
    const tmplId = v.product_tmpl_id[0];
    if (!(tmplId in map)) map[tmplId] = v.id;
  }
  return map;
}

/**
 * Creates a `sale.order` and immediately confirms it (moves it out of
 * "draft"/quotation into a real, stock-affecting sale).
 */
export async function createConfirmedOrder({
  partnerId,
  pricelistId,
  orderLines,
  note,
}) {
  const odoo = await getConnectedOdooClient();

  const orderId = await odoo.execute_kw("sale.order", "create", [
    {
      partner_id: partnerId,
      ...(pricelistId ? { pricelist_id: pricelistId } : {}),
      note,
      order_line: orderLines.map((line) => [
        0,
        0,
        {
          product_id: line.product_id,
          product_uom_qty: line.qty,
          price_unit: line.price_unit,
        },
      ]),
    },
  ]);

  await odoo.execute_kw("sale.order", "action_confirm", [[orderId]]);

  const [order] = await odoo.execute_kw("sale.order", "read", [
    [orderId],
    ["name"],
  ]);

  return { id: orderId, name: order.name };
}
