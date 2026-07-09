"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useProStatus } from "@/context/pro-context";
import { getPrice as resolvePrice } from "@/lib/pricing";
import {
  getProducts,
  getCategories,
  getFeaturedProducers,
} from "@/lib/api/products";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Source of truth for B2B/B2C is the header-controlled pro-context.
  const { isPro, pricelistId } = useProStatus();

  const [products, setProducts] = useState([]);
  const [producers, setProducers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [prods, cats, producs] = await Promise.all([
          getProducts(pricelistId),
          getCategories(),
          getFeaturedProducers(),
        ]);
        if (!active) return;
        setProducts(prods);
        setCategories(cats);
        setProducers(producs);
      } catch (err) {
        console.error("Failed to load Odoo data:", err);
        if (active) setError("Impossible de charger les données pour le moment.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [pricelistId]);

  const getPrice = (product) => resolvePrice(product, isPro);

  const addToCart = (productId) => {
    // TODO: wire to real cart/Odoo order logic.
    setCart((current) => [...current, productId]);
  };

  const value = {
    products,
    producers,
    categories,
    isPro,
    cart,
    loading,
    error,
    getPrice,
    addToCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
