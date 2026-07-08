import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function ProductCard({ product }) {
  const { isPro, getPrice, addToCart } = useApp();
  const price = getPrice(product);
  const outOfStock = product.stock !== undefined && product.stock <= 0;
  const lowStock = isPro && product.stock > 0 && product.stock <= 10;

  return (
    <div className="group relative flex flex-col">
      <Link to={`/produit/${product.id}`} className="block flex-1">
        <div className={`image-zoom relative aspect-[3/4] bg-secondary overflow-hidden rounded-sm ${outOfStock ? 'grayscale' : ''}`}>
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity ${outOfStock ? 'opacity-20' : ''}`}
          />
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gold font-heading text-[10px] md:xs tracking-wide-luxe rotate-[-8deg] border border-gold px-3 py-1.5 bg-bone/50 backdrop-blur-sm">
                RÉSERVE ÉPUISÉE
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-0.5 flex-1">
          <p className="text-[10px] tracking-wide-luxe text-muted-foreground uppercase">{product.category}</p>
          <h3 className="font-heading font-semibold text-obsidian text-base leading-tight group-hover:text-gold transition-colors">
            {product.name}
          </h3>

          {/* Conditionnement / Stock — differs by profile */}
          {isPro ? (
            <div className="pt-0.5 space-y-0.5">
              {product.conditionnement && (
                <p className="text-xs text-muted-foreground">{product.conditionnement}</p>
              )}
              <p className={`text-xs font-medium ${outOfStock ? 'text-destructive' : lowStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                {outOfStock ? 'Stock épuisé' : `Stock : ${product.stock} unité${product.stock > 1 ? 's' : ''}`}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground pt-0.5">Vendu à l'unité</p>
          )}

          <div className="flex items-baseline gap-2 pt-1.5">
            <span className="font-heading text-lg font-bold text-obsidian">{price.toFixed(2)}€</span>
            {isPro && product.unites_par_carton ? (
              <span className="text-[10px] text-muted-foreground">/ carton de {product.unites_par_carton}</span>
            ) : (
              <span className="text-[10px] text-muted-foreground">/ unité</span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={() => addToCart(product.id)}
        disabled={outOfStock}
        className={`mt-3 w-full py-2.5 text-[10px] md:xs tracking-wide-luxe uppercase border transition-all ink-hover relative ${
          outOfStock
            ? 'border-border text-muted-foreground cursor-not-allowed opacity-50'
            : 'border-obsidian text-obsidian hover:bg-obsidian hover:text-bone'
        }`}
      >
        {outOfStock ? 'Indisponible' : 'Ajouter au panier'}
      </button>
    </div>
  );
}