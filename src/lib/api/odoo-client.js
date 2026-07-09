// lib/odoo-client.js
import Odoo from 'async-odoo-xmlrpc';

let odooClient = null;
let isConnected = false;

export async function getConnectedOdooClient() {
  // Construct lazily so importing this module doesn't require env vars to be
  // present (e.g. during `next build`, where they are undefined).
  if (!odooClient) {
    // Read the URL at runtime (not a build-time inlined NEXT_PUBLIC_ var) so a
    // build produced without the var doesn't silently fall back to localhost.
    const url = process.env.ODOO_URL || process.env.NEXT_PUBLIC_ODOO_URL;
    if (!url) {
      throw new Error("Odoo URL is not configured (set ODOO_URL).");
    }
    odooClient = new Odoo({
      url,
      db: process.env.ODOO_DB,
      username: process.env.ODOO_USERNAME,
      password: process.env.ODOO_API_KEY
    });
  }

  if (!isConnected) {
    console.log("🔌 Connexion initiale à Odoo...");
    try {
      await odooClient.connect();
      isConnected = true;
    } catch (err) {
      // Don't keep a half-initialised client around on failure.
      odooClient = null;
      throw err;
    }
  }
  return odooClient;
}
