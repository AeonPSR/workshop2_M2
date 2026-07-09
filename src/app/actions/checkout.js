"use server";

import { verifySession } from "@/lib/dal";
import { getProducts } from "@/lib/api/products";
import {
  findOrCreateGuestPartner,
  resolveProductVariantIds,
  createConfirmedOrder,
} from "@/lib/api/orders";
import { STORE, DELIVERY_FEE } from "@/lib/constants";
import { isValidPickupDate } from "@/lib/pickup";

export async function placeOrder(payload) {
  const { cart, fulfillment, contact, payment } = payload ?? {};

  if (!Array.isArray(cart) || cart.length === 0) {
    return { success: false, error: "Le panier est vide." };
  }
  if (
    !payment?.cardNumber?.replace(/\s/g, "").match(/^\d{16}$/) ||
    !payment?.expiry?.match(/^\d{2}\/\d{2}$/) ||
    !payment?.cvc?.match(/^\d{3}$/) ||
    !payment?.cardHolder?.trim()
  ) {
    return { success: false, error: "Informations de paiement invalides." };
  }

  const session = await verifySession();
  const isPro = !!session?.isPro;

  // Fulfillment — the pro flow never has a choice: always free delivery.
  let method = "delivery";
  let deliveryFee = 0;
  let note;

  if (isPro) {
    note = "Livraison offerte (compte professionnel).";
  } else {
    method = fulfillment?.method;
    if (method === "pickup") {
      if (!isValidPickupDate(fulfillment?.pickupDate)) {
        return {
          success: false,
          error: "Date de retrait invalide (lundi ou mardi uniquement).",
        };
      }
      const formatted = new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date(`${fulfillment.pickupDate}T00:00:00`));
      note = `Retrait en magasin le ${formatted} — ${STORE.address}.`;
    } else if (method === "delivery") {
      const address = fulfillment?.address;
      if (!address?.street?.trim() || !address?.postalCode?.trim() || !address?.city?.trim()) {
        return { success: false, error: "Adresse de livraison incomplète." };
      }
      deliveryFee = DELIVERY_FEE;
      note = `Livraison à ${address.street}, ${address.postalCode} ${address.city} — frais affichés : ${DELIVERY_FEE.toFixed(2)}€ (non facturés sur cette commande test).`;
    } else {
      return { success: false, error: "Mode de livraison invalide." };
    }
  }

  // Resolve partner.
  let partnerId = session?.partnerId ?? null;
  if (!partnerId) {
    if (!contact?.name?.trim() || !contact?.email?.trim()) {
      return { success: false, error: "Coordonnées incomplètes." };
    }
    try {
      partnerId = await findOrCreateGuestPartner({
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone?.trim() || false,
      });
    } catch (err) {
      console.error("Guest partner resolution failed:", err);
      return { success: false, error: "Impossible de traiter vos coordonnées." };
    }
  }

  // Revalidate stock/pricing server-side — never trust the client cart.
  let products;
  try {
    products = await getProducts(session?.pricelistId ?? null);
  } catch (err) {
    console.error("Failed to fetch products for checkout:", err);
    return { success: false, error: "Service indisponible. Réessayez plus tard." };
  }

  const unavailable = [];
  const validLines = [];
  for (const item of cart) {
    const product = products.find((p) => p.id === item.id);
    if (!product || product.stock < item.qty) {
      unavailable.push(product?.name ?? `Produit #${item.id}`);
      continue;
    }
    validLines.push({
      id: product.id,
      qty: item.qty,
      price_unit: isPro ? (product.price_pro ?? product.price_particulier) : product.price_particulier,
    });
  }

  if (unavailable.length > 0) {
    return {
      success: false,
      error: `Stock insuffisant pour : ${unavailable.join(", ")}. Retournez au panier pour ajuster.`,
    };
  }

  try {
    const variantMap = await resolveProductVariantIds(validLines.map((l) => l.id));
    const orderLines = validLines.map((l) => ({
      product_id: variantMap[l.id],
      qty: l.qty,
      price_unit: l.price_unit,
    }));

    if (orderLines.some((l) => !l.product_id)) {
      return { success: false, error: "Un article n'a pas pu être résolu. Réessayez." };
    }

    const order = await createConfirmedOrder({
      partnerId,
      pricelistId: isPro ? session.pricelistId : null,
      orderLines,
      note,
    });

    return { success: true, orderName: order.name, deliveryFee, method };
  } catch (err) {
    console.error("Order creation failed:", err);
    return { success: false, error: "Impossible de créer la commande. Réessayez plus tard." };
  }
}
