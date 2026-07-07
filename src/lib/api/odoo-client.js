// lib/odoo-client.js
import Odoo from 'async-odoo-xmlrpc';

const odooClient = new Odoo({
  url: process.env.NEXT_PUBLIC_ODOO_URL,
  db: process.env.ODOO_DB,
  username: process.env.ODOO_USERNAME,
  password: process.env.ODOO_API_KEY
});

let isConnected = false;

export async function getConnectedOdooClient() {
  if (!isConnected) {
    console.log("🔌 Connexion initiale à Odoo...");
    await odooClient.connect();
    isConnected = true;
  }
  return odooClient;
}
