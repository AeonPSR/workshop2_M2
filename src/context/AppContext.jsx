"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useProStatus } from "@/context/pro-context";
import { getPrice as resolvePrice } from "@/lib/pricing";
import {
  getProducts,
  getCategories,
  getFeaturedProducers,
} from "@/lib/api/products";
import {
  addItem,
  removeItem,
  setItemQty,
  revalidateCart,
  cartCount as countCartItems,
} from "@/lib/cart";

const AppContext = createContext(null);
const CART_STORAGE_KEY = "pap-cart";

export function AppProvider({ children }) {
  // Source of truth for B2B/B2C is the header-controlled pro-context.
  const { isPro, pricelistId } = useProStatus();

  const [products, setProducts] = useState([]);
  const [producers, setProducers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Cart entries: { id: productId, qty: number }
  const [cart, setCart] = useState([]);

  // Load persisted cart once on mount (after hydration, to avoid SSR mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch {
      // Ignore malformed/inaccessible storage.
    }
  }, []);

  // Persist cart on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore write failures (e.g. storage disabled).
    }
  }, [cart]);

  // Revalidate cart against current stock whenever products refresh —
  // clamp quantities to available stock and drop lines that sold out.
  useEffect(() => {
    setCart((current) => revalidateCart(current, products));
  }, [products]);

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

  const addToCart = (productId, qty = 1) => {
    setCart((current) => addItem(current, products, productId, qty));
  };

  const removeFromCart = (productId) => {
    setCart((current) => removeItem(current, productId));
  };

  const setCartQty = (productId, qty) => {
    setCart((current) => setItemQty(current, products, productId, qty));
  };

  const clearCart = () => setCart([]);

  const cartCount = countCartItems(cart);

  const value = {
    products,
    producers,
    categories,
    isPro,
    cart,
    cartCount,
    loading,
    error,
    getPrice,
    addToCart,
    removeFromCart,
    setCartQty,
    clearCart,
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
