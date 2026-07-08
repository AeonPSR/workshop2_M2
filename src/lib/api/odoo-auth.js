"use server";

import Odoo from "async-odoo-xmlrpc";
import { getConnectedOdooClient } from "@/lib/api/odoo-client";

export async function verifyOdooCredentials(login, password) {
  const client = new Odoo({
    url: process.env.NEXT_PUBLIC_ODOO_URL,
    db: process.env.ODOO_DB,
    username: login,
    password,
  });

  let uid;
  try {
    uid = await client.connect(); // rejette si identifiants invalides
  } catch {
    return null;
  }
  if (!uid) return null;

  const odoo = await getConnectedOdooClient();

  const [user] = await odoo.execute_kw("res.users", "read", [
    [uid],
    ["partner_id"],
  ]);
  const partnerId = user.partner_id[0];

  const [partner] = await odoo.execute_kw("res.partner", "read", [
    [partnerId],
    ["is_company", "name", "property_product_pricelist"],
  ]);

  const pricelistId = partner.property_product_pricelist
    ? partner.property_product_pricelist[0]
    : null;

  return {
    uid,
    partnerId,
    name: partner.name,
    isPro: partner.is_company,
    pricelistId,
  };
}
