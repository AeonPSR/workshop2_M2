"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export const ProductCard = ({ product }) => {
  const { isPro, getPrice, addToCart } = useApp();
  const price = getPrice(product);
  const outOfStock = product.stock !== undefined && product.stock <= 0;
  const lowStock = isPro && product.stock > 0 && product.stock <= 10;

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${product.id}`} className="block flex-1">
        <div
          className={cn(
            "image-zoom bg-secondary relative aspect-3/4 overflow-hidden rounded-sm",
            outOfStock && "grayscale",
          )}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className={cn(
                "object-cover transition-opacity",
                outOfStock && "opacity-20",
              )}
            />
          ) : (
            <div
              className={cn(
                "bg-muted h-full w-full",
                outOfStock && "opacity-20",
              )}
            />
          )}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-accent font-heading text-2xs tracking-wide-luxe border-accent bg-background/50 rotate-[-8deg] border px-3 py-1.5 backdrop-blur-sm md:text-xs">
                RÉSERVE ÉPUISÉE
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 flex-1 space-y-0.5">
          <p className="text-2xs tracking-wide-luxe text-muted-foreground uppercase">
            {product.category}
          </p>
          <h3 className="font-heading text-foreground group-hover:text-accent text-base leading-tight font-semibold transition-colors">
            {product.name}
          </h3>

          {/* Stock — shown only in pro mode */}
          {isPro ? (
            <div className="space-y-0.5 pt-0.5">
              <p
                className={cn(
                  "text-xs font-medium",
                  outOfStock || lowStock
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {outOfStock
                  ? "Stock épuisé"
                  : `Stock : ${product.stock} unité${product.stock > 1 ? "s" : ""}`}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground pt-0.5 text-xs">
              Vendu à l’unité
            </p>
          )}

          <div className="flex items-baseline gap-2 pt-1.5">
            <span className="font-heading text-foreground text-lg font-bold">
              {price.toFixed(2)}€
            </span>
            <span className="text-2xs text-muted-foreground">/ unité</span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => addToCart(product.id)}
        disabled={outOfStock}
        className={cn(
          "text-2xs tracking-wide-luxe ink-hover relative mt-3 w-full cursor-pointer border py-2.5 uppercase transition-all md:text-xs",
          outOfStock
            ? "border-border text-muted-foreground cursor-not-allowed opacity-50"
            : "border-foreground text-foreground hover:bg-foreground hover:text-background",
        )}
      >
        {outOfStock ? "Indisponible" : "Ajouter au panier"}
      </button>
    </div>
  );
};
