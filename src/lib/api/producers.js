"use server"
import { getConnectedOdooClient } from "./odoo-client";

export async function getProducers() {
  try {
    const odoo = await getConnectedOdooClient();

    const domain = [['supplier_rank', '>', 0]];
    
    const fields = ['id', 'name', 'email', 'address', 'x_description', 'is_company', 'image_512'];

    const providers = await odoo.execute_kw('res.partner', 'search_read', [domain, fields]);

    return providers.map((p) => {
      const imageUrl = p.image_512 
        ? `data:image/png;base64,${p.image_512}` 
        : null;

      return {
        id: p.id,
        name: p.name,
        email: p.email || "Non renseigné",
        address: p.address,
        isCompany: p.is_company,
        description: p.x_description || "Aucune description disponible",
        image: imageUrl 
      };
    });


  } catch (error) {
    console.error("Erreur lors de la récupération des producteurs :", error.message);
    throw error;
  }
}