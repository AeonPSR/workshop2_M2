// lib/odoo-client.js
import Odoo from 'async-odoo-xmlrpc';

let odooClient = null;
let isConnected = false;

export async function getConnectedOdooClient() {
  // Construct lazily so importing this module doesn't require env vars to be
  // present (e.g. during `next build`, where they are undefined).
  if (!odooClient) {
    odooClient = new Odoo({
      url: process.env.NEXT_PUBLIC_ODOO_URL,
      db: process.env.ODOO_DB,
      username: process.env.ODOO_USERNAME,
      password: process.env.ODOO_API_KEY
    });
  }

  if (!isConnected) {
    console.log("🔌 Connexion initiale à Odoo...");
    await odooClient.connect();
    isConnected = true;
  }
  return odooClient;
}
