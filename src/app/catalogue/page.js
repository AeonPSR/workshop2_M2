"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  SlidersHorizontalIcon,
  MultiplicationSignIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";

const LABEL_CLASS = "text-2xs tracking-wide-luxe text-muted-foreground uppercase";

export default function Catalogue() {
  return (
    <Suspense>
      <CatalogueInner />
    </Suspense>
  );
}

function CatalogueInner() {
  const { products = [], categories = [], isPro, getPrice } = useApp();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : [],
  );
  const [sortBy, setSortBy] = useState("default");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setSearch(q);
    const cat = searchParams.get("category");
    if (cat) setSelectedCategories([cat]);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (showInStockOnly && isPro) {
      result = result.filter((p) => p.stock > 0);
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    }

    return result;
  }, [products, search, selectedCategories, showInStockOnly, sortBy, getPrice]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const hasActiveFilters = selectedCategories.length > 0 || search || showInStockOnly;

  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setShowInStockOnly(false);
  };

  const sidebar = (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <p className={LABEL_CLASS}>Recherche</p>
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <p className={LABEL_CLASS}>Catégories</p>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <span
                className={cn(
                  "text-sm transition-colors",
                  selectedCategories.includes(cat)
                    ? "text-accent font-medium"
                    : "text-foreground group-hover:text-accent",
                )}
              >
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock filter — pro only */}
      {isPro && (
        <div className="p-4 bg-accent/5 rounded-sm border border-accent/20 space-y-3">
          <p className="text-2xs tracking-wide-luxe text-accent uppercase">
            Disponibilité Pro
          </p>
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
              checked={showInStockOnly}
              onCheckedChange={(checked) => setShowInStockOnly(!!checked)}
            />
            <span className="text-sm text-foreground group-hover:text-accent transition-colors">
              Stock disponible uniquement
            </span>
          </label>
        </div>
      )}

      {/* Sort */}
      <div className="space-y-2">
        <Label className={LABEL_CLASS}>Tri</Label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 bg-input/20 border border-input rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30"
        >
          <option value="default">Par défaut</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-accent hover:underline underline-offset-4"
        >
          <HugeiconsIcon icon={MultiplicationSignIcon} size={12} />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="border-b border-accent/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <p className="text-2xs tracking-wide-luxe text-accent uppercase mb-2">Catalogue</p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">
            Tous nos produits
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}
            {hasActiveFilters && " · filtres actifs"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-60 shrink-0">{sidebar}</aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters trigger */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Sheet>
                <SheetTrigger className="inline-flex items-center gap-2 px-4 py-2 border border-foreground text-foreground text-sm hover:bg-foreground hover:text-background transition-colors rounded-md">
                  <HugeiconsIcon icon={SlidersHorizontalIcon} size={14} />
                  Filtres
                  {selectedCategories.length > 0 && (
                    <span className="ml-1 rounded-full bg-accent text-background w-4 h-4 flex items-center justify-center text-2xs font-bold">
                      {selectedCategories.length}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side="left" className="p-6 overflow-y-auto">
                  <div className="mb-6">
                    <h3 className="font-heading font-bold text-foreground">Filtres</h3>
                  </div>
                  {sidebar}
                </SheetContent>
              </Sheet>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-accent hover:underline underline-offset-4"
                >
                  Tout réinitialiser
                </button>
              )}
            </div>

            {/* Active category chips */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/30 hover:bg-accent/20 transition-colors"
                  >
                    {cat}
                    <HugeiconsIcon icon={MultiplicationSignIcon} size={10} />
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {products.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-secondary border-t-accent rounded-full animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground mb-2">Aucun produit trouvé</p>
                <button
                  onClick={resetFilters}
                  className="text-sm text-accent hover:underline underline-offset-4"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
