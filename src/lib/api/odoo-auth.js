"use server";

import Odoo from "async-odoo-xmlrpc";
import { getConnectedOdooClient } from "@/lib/api/odoo-client";

export async function verifyOdooCredentials(login, password) {
  const client = new Odoo({
    url: process.env.ODOO_URL || process.env.NEXT_PUBLIC_ODOO_URL,
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

/**
 * Crée un nouveau compte Odoo pour un particulier (jamais une entreprise).
 * Retourne le même format que `verifyOdooCredentials`, ou
 * `{ error: "duplicate" }` si l'email est déjà utilisé.
 */
export async function createOdooAccount({ name, email, password }) {
  const odoo = await getConnectedOdooClient();

  const existing = await odoo.execute_kw("res.partner", "search", [
    [["email", "=", email]],
  ]);
  if (existing.length > 0) {
    return { error: "duplicate" };
  }

  // Le partenaire créé automatiquement par res.users est déjà un particulier
  // (is_company: false) par défaut — pas besoin de le forcer ici. On laisse
  // aussi Odoo assigner le groupe par défaut (le nom du champ groups_id
  // varie selon la version d'Odoo).
  await odoo.execute_kw("res.users", "create", [
    {
      name,
      login: email,
      email,
      password,
    },
  ]);

  return verifyOdooCredentials(email, password);
}
