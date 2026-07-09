// Static configuration for the storefront.

export const STORE = {
  street: "12 rue des Artisans",
  postalCode: "42610",
  city: "Saint-Romain-le-Puy",
  address: "12 rue des Artisans, 42610 Saint-Romain-le-Puy",
  phone: "01 23 45 67 89",
  email: "contact@pap.fr",
  // Retrait en magasin possible uniquement ces jours (0 = dimanche).
  pickupWeekdays: [1, 2],
};

// Forfait de livraison particulier/visiteur — offert pour les pros.
export const DELIVERY_FEE = 5.9;

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1200&auto=format&fit=crop",
  landscape: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop",
};

// Fallback images for category cards when no product image is available.
// Keys must match the Odoo product.category names exactly.
export const CATEGORY_FALLBACK_IMAGES = {
  "Bières":              "/images/homepage/categories_backup/bières.avif",
  "Boissons":            "/images/homepage/categories_backup/boisson.jpg",
  "Café":                "/images/homepage/categories_backup/café.webp",
  "Chips":               "/images/homepage/categories_backup/chips.jpg",
  "Chocolat":            "/images/homepage/categories_backup/chocolat.png",
  "Coloration végétale": "/images/homepage/categories_backup/coloration.jpg",
  "Cosmétique":          "/images/homepage/categories_backup/cosmétique.jpg",
  "Infusions":           "/images/homepage/categories_backup/infusions.webp",
  "Jus":                 "/images/homepage/categories_backup/jus.jpg",
  "Limonades":           "/images/homepage/categories_backup/limonades.jpg",
  "Nectar":              "/images/homepage/categories_backup/nectar.jpg",
  "Produits secs":       "/images/homepage/categories_backup/produits secs.webp",
  "Soupes":              "/images/homepage/categories_backup/soupes.jpg",
  "Vins":                "/images/homepage/categories_backup/vins.jpg",
  "Épicerie":            "/images/homepage/categories_backup/épicerie.webp",
};
