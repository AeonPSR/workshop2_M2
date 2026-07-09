"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { useApp } from "@/context/AppContext";

const MAX_RESULTS = 5;

export const Searchbar = () => {
  const { products = [], getPrice } = useApp();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setQuery("");
    setIsOpen(false);
  }

  const allMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name?.toLowerCase().includes(q));
  }, [products, query]);

  const results = allMatches.slice(0, MAX_RESULTS);
  const hasMore = allMatches.length > MAX_RESULTS;

  const closeAndReset = () => {
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <InputGroup className="rounded-full">
        <InputGroupAddon>
          <HugeiconsIcon icon={Search01Icon} size={16} />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Rechercher un produit..."
          className="py-1 placeholder:text-sm placeholder:text-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.trim().length > 0);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
        />
      </InputGroup>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 flex flex-col gap-1 rounded-lg bg-popover p-2 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10">
          {results.length === 0 ? (
            <p className="px-2 py-3 text-center text-muted-foreground">
              Aucun produit trouvé
            </p>
          ) : (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={closeAndReset}
                  className="flex items-center gap-3 rounded-md p-1.5 hover:bg-accent/10"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-muted">
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {product.name}
                    </p>
                    {product.category && (
                      <p className="truncate text-2xs uppercase tracking-wide-luxe text-muted-foreground">
                        {product.category}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-heading font-semibold text-foreground">
                    {getPrice(product).toFixed(2)}€
                  </span>
                </Link>
              ))}
              {hasMore && (
                <Link
                  href={`/catalogue?q=${encodeURIComponent(query.trim())}`}
                  onClick={closeAndReset}
                  className="rounded-md px-2 py-2 text-center font-medium text-accent hover:underline"
                >
                  Voir tous les résultats
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
