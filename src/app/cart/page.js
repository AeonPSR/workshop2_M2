"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Remove01Icon,
  Delete02Icon,
  ShoppingBasket03Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const {
    cart,
    products,
    isPro,
    getPrice,
    removeFromCart,
    setCartQty,
    loading,
  } = useApp();

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);

  const total = lines.reduce(
    (sum, line) => sum + getPrice(line.product) * line.qty,
    0,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="border-secondary border-t-accent h-8 w-8 animate-spin rounded-full border-4" />
      </div>
    );
  }

  return (
    <div>
      {lines.length > 0 && (
        <div className="border-accent/30 border-b">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
            <p className="text-2xs tracking-wide-luxe text-accent mb-2 uppercase">
              Panier
            </p>
            <h1 className="font-heading text-foreground text-3xl font-bold md:text-5xl">
              Votre commande
            </h1>

            <p className="text-muted-foreground mt-2 text-sm">
              {lines.length} article{lines.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HugeiconsIcon
              icon={ShoppingBasket03Icon}
              size={40}
              className="text-muted-foreground mb-4"
            />
            <p className="font-heading mb-2 text-2xl font-bold md:text-3xl">
              Votre panier est vide
            </p>
            <p className="text-muted-foreground mb-6">
              Ajoutez des articles à votre panier pour continuer.
            </p>
            <Link href="/catalogue">
              <Button variant="default">
                Parcourir le catalogue{" "}
                <HugeiconsIcon icon={ArrowRight02Icon} />{" "}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Lines */}
            <div className="divide-border min-w-0 flex-1 divide-y">
              {lines.map(({ product, qty }) => {
                const price = getPrice(product);
                const atMax = qty >= product.stock;

                return (
                  <div key={product.id} className="flex gap-4 py-5">
                    <div className="bg-secondary relative h-24 w-20 shrink-0 overflow-hidden rounded-sm">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-muted h-full w-full" />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-2xs tracking-wide-luxe text-muted-foreground uppercase">
                            {product.category}
                          </p>
                          <h3 className="font-heading text-foreground truncate leading-tight font-semibold">
                            {product.name}
                          </h3>
                          {isPro && (
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              Stock : {product.stock} unité
                              {product.stock > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => removeFromCart(product.id)}
                          aria-label="Retirer l'article"
                          className="text-muted-foreground hover:text-destructive shrink-0 p-0.5 transition-colors hover:bg-transparent"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={18} />
                        </Button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="border-border flex items-center rounded-sm border">
                          <button
                            onClick={() => setCartQty(product.id, qty - 1)}
                            className="text-foreground hover:text-accent cursor-pointer p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Diminuer la quantité"
                          >
                            <HugeiconsIcon icon={Remove01Icon} size={14} />
                          </button>
                          <span className="text-foreground w-8 text-center text-sm font-medium">
                            {qty}
                          </span>
                          <button
                            onClick={() => setCartQty(product.id, qty + 1)}
                            disabled={atMax}
                            className="text-foreground hover:text-accent cursor-pointer p-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Augmenter la quantité"
                          >
                            <HugeiconsIcon icon={Add01Icon} size={14} />
                          </button>
                        </div>

                        <span className="font-heading text-foreground font-bold">
                          {(price * qty).toFixed(2)}€
                        </span>
                      </div>
                      {isPro && atMax && (
                        <p className="text-2xs text-destructive mt-1">
                          Quantité maximale disponible atteinte
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <aside className="shrink-0 lg:w-80">
              <div className="bg-secondary/50 sticky top-24 space-y-4 p-6">
                <h2 className="font-heading text-foreground text-lg font-bold">
                  Récapitulatif
                </h2>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="text-foreground font-medium">
                    {total.toFixed(2)}€
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-muted-foreground">
                    Calculée à la commande
                  </span>
                </div>
                <div className="border-border flex items-center justify-between border-t pt-4">
                  <span className="font-heading text-foreground font-bold">
                    Total
                  </span>
                  <span className="font-heading text-foreground text-lg font-bold">
                    {total.toFixed(2)}€
                  </span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full">Passer commande</Button>
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
