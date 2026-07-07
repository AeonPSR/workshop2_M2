"use client";

import { createContext, useContext, useState } from "react";

// TODO: replace this mock data layer with the real Odoo API integration.
// The shape below is the contract the UI expects — keep it in sync with
// whatever the Odoo product/producer models return.

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Miel de Lavande",
    category: "Épicerie sucrée",
    image_url: null,
    featured: true,
    price_particulier: 12.5,
    price_pro: 9.8,
    stock: 42,
    conditionnement: "Pot 250g",
    unites_par_carton: 12,
  },
  {
    id: 2,
    name: "Huile d'Olive Vierge",
    category: "Épicerie salée",
    image_url: null,
    featured: true,
    price_particulier: 18.9,
    price_pro: 15.2,
    stock: 8,
    conditionnement: "Bouteille 500ml",
    unites_par_carton: 6,
  },
  {
    id: 3,
    name: "Confiture de Figues",
    category: "Épicerie sucrée",
    image_url: null,
    featured: false,
    price_particulier: 7.9,
    price_pro: 5.9,
    stock: 0,
    conditionnement: "Pot 200g",
    unites_par_carton: 12,
  },
  {
    id: 4,
    name: "Fromage de Chèvre Affiné",
    category: "Crèmerie",
    image_url: null,
    featured: false,
    price_particulier: 9.5,
    price_pro: 7.2,
    stock: 24,
    conditionnement: "Pièce 180g",
    unites_par_carton: 8,
  },
];

const MOCK_PRODUCERS = [
  { id: 1, name: "Ferme du Vercors", location: "Drôme", image_url: null },
  { id: 2, name: "Domaine des Oliviers", location: "Provence", image_url: null },
  { id: 3, name: "Rucher des Cévennes", location: "Gard", image_url: null },
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products] = useState(MOCK_PRODUCTS);
  const [producers] = useState(MOCK_PRODUCERS);
  const [isPro] = useState(false);
  const [cart, setCart] = useState([]);

  const getPrice = (product) =>
    isPro ? product.price_pro ?? product.price_particulier : product.price_particulier;

  const addToCart = (productId) => {
    // TODO: wire to real cart/Odoo order logic.
    setCart((current) => [...current, productId]);
  };

  const value = { products, producers, isPro, cart, getPrice, addToCart };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
