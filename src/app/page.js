"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Leaf01Icon,
  TruckIcon,
  UserMultipleIcon,
  Award01Icon,
} from "@hugeicons/core-free-icons";
import { useApp } from "@/context/AppContext";
import { IMAGES, CATEGORY_FALLBACK_IMAGES } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const { products, producers, categories, getPrice } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Map each category to the first product image available for that category.
  const categoryImage = useMemo(() => {
    const map = {};
    for (const p of products) {
      if (p.category && p.image_url && !map[p.category]) {
        map[p.category] = p.image_url;
      }
    }
    return map;
  }, [products]);

  const featuredProducts = useMemo(() => {
    const ideal = products.filter((p) => p.stock > 0 && p.image_url);
    const pool = ideal.length >= 4 ? ideal : products;
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [products]);

  useEffect(() => {
    if (featuredProducts.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length, isPaused]);

  const featuredProducers = producers.slice(0, 3);
  const newProducts = products.slice(0, 8);

  return (
    <div>
      {/* Hero — Split screen */}
      <section className="relative">
        <div className="grid min-h-[70vh] grid-cols-1 lg:min-h-[88vh] lg:grid-cols-2">
          {/* Left: producer image */}
          <div className="relative order-2 min-h-[40vh] overflow-hidden lg:order-1 lg:min-h-0">
            <Image
              src={IMAGES.hero}
              alt="Producteur artisanal"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="from-foreground/30 absolute inset-0 bg-linear-to-t to-transparent" />
            <div className="absolute top-1/2 left-6 z-10 hidden -translate-y-1/2 lg:block">
              <span className="vertical-text text-background/50 text-2xs tracking-wide-luxe uppercase">
                Producteurs · France
              </span>
            </div>
          </div>

          {/* Right: content */}
          <div className="bg-background order-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:order-2 lg:px-16">
            <p className="text-2xs tracking-wide-luxe text-accent mb-4 uppercase">
              ◆ Bio Haut de Gamme
            </p>
            <h1 className="font-heading text-foreground mb-6 text-4xl leading-[1.05] font-extrabold md:text-5xl lg:text-6xl">
              L’excellence
              <br />
              artisanale,
              <br />
              <span className="text-accent">livrée.</span>
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md text-base leading-relaxed md:text-lg">
              Du producteur à votre table. Des produits bio d’exception,
              sélectionnés auprès des meilleurs artisans de France.
            </p>

            {/* Featured carousel */}
            {featuredProducts.length > 0 && (
              <div
                className="border-accent/40 bg-accent/5 mb-8 max-w-md rounded-sm border p-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xs tracking-wide-luxe text-accent font-semibold whitespace-nowrap uppercase">
                    ◆ Produit phare
                  </span>
                  <div className="bg-accent/30 h-px flex-1" />
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setCurrentSlide((prev) =>
                          prev === 0 ? featuredProducts.length - 1 : prev - 1,
                        )
                      }
                    >
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        className="text-foreground hover:text-accent h-5 w-5"
                      />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentSlide(
                          (prev) => (prev + 1) % featuredProducts.length,
                        )
                      }
                    >
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="text-foreground hover:text-accent h-5 w-5"
                      />
                    </button>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-sm">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="min-w-full">
                        <Link
                          href={`/product/${product.id}`}
                          className="group flex items-center gap-5"
                        >
                          <div className="image-zoom bg-secondary ring-accent/20 relative h-28 w-28 shrink-0 overflow-hidden rounded-sm ring-1 md:h-36 md:w-36">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="144px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="bg-muted h-full w-full" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-2xs text-muted-foreground truncate tracking-wide uppercase">
                              {product.category}
                            </p>
                            <h3 className="font-heading text-foreground group-hover:text-accent text-lg leading-tight font-bold transition-colors md:text-xl">
                              {product.name}
                            </h3>
                            <p className="text-accent font-heading mt-2 text-lg font-bold">
                              Dès {getPrice(product)?.toFixed(2)}€
                            </p>
                            <span className="text-foreground mt-2 inline-flex items-center gap-1 text-xs transition-all group-hover:gap-2">
                              Découvrir{" "}
                              <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                className="h-3.5 w-3.5"
                              />
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-center gap-1.5">
                  {featuredProducts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === currentSlide
                          ? "bg-accent w-8"
                          : "bg-accent/20 w-1.5",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalogue"
                className="bg-foreground text-background hover:bg-accent ink-hover relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm tracking-wide transition-colors"
              >
                Découvrir le catalogue
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
              </Link>
              <Link
                href="/producers"
                className="border-foreground text-foreground hover:bg-foreground hover:text-background inline-flex items-center justify-center gap-2 border px-6 py-3.5 text-sm tracking-wide transition-colors"
              >
                Nos producteurs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-accent/30 bg-secondary/20 border-y">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 md:gap-x-16 md:px-8">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Leaf01Icon} className="text-accent h-4 w-4" />
            <span className="text-foreground text-xs tracking-wide">
              Certifié Bio AB
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={UserMultipleIcon}
              className="text-accent h-4 w-4"
            />
            <span className="text-foreground text-xs tracking-wide">
              Producteurs sélectionnés
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={TruckIcon} className="text-accent h-4 w-4" />
            <span className="text-foreground text-xs tracking-wide">
              Livraison franco (pro)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Award01Icon} className="text-accent h-4 w-4" />
            <span className="text-foreground text-xs tracking-wide">
              Biocoop & La Vie Claire
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mb-10">
          <p className="text-2xs tracking-wide-luxe text-accent mb-2 uppercase">
            Rayons
          </p>
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            Explorez par catégorie
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat}
              href={`/catalogue?category=${encodeURIComponent(cat)}`}
              className="group bg-secondary/30 border-border hover:border-accent ink-hover relative flex aspect-square flex-col justify-end overflow-hidden rounded-sm border transition-all"
            >
              {categoryImage[cat] || CATEGORY_FALLBACK_IMAGES[cat] ? (
                <Image
                  src={categoryImage[cat] || CATEGORY_FALLBACK_IMAGES[cat]}
                  alt={cat}
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover object-center opacity-40 transition-opacity group-hover:opacity-60"
                />
              ) : null}
              <div className="relative z-10 p-5 md:p-6">
                <span className="text-2xs text-muted-foreground absolute top-3 right-3 font-mono">
                  0{i + 1}
                </span>
                <h3 className="font-heading text-foreground group-hover:text-accent text-sm leading-tight font-semibold transition-colors md:text-base">
                  {cat}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand presentation */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:gap-16 md:px-8">
          <div>
            <p className="text-2xs tracking-wide-luxe text-accent mb-4 uppercase">
              Notre Histoire
            </p>
            <h2 className="font-heading mb-6 text-3xl leading-tight font-bold md:text-4xl">
              Une plateforme née
              <br />
              de la passion du terroir
            </h2>
            <p className="text-background/60 mb-6 leading-relaxed">
              PAP est née d’une conviction simple : les meilleurs produits
              méritent les meilleurs circuits de distribution. Nous travaillons
              main dans la main avec des artisans producteurs d’exception pour
              porter leurs créations jusqu’aux enseignes et particuliers les
              plus exigeants.
            </p>
            <Link
              href="/contact"
              className="text-accent inline-flex items-center gap-2 text-sm tracking-wide transition-all hover:gap-3"
            >
              Découvrir notre histoire
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-sm">
            <Image
              src={IMAGES.landscape}
              alt="Paysage de terroir"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="from-foreground/30 absolute inset-0 bg-linear-to-t to-transparent" />
          </div>
        </div>
      </section>

      {/* Producer preview */}
      {featuredProducers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-2xs tracking-wide-luxe text-accent mb-2 uppercase">
                Producteurs
              </p>
              <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
                Nos artisans
              </h2>
            </div>
            <Link
              href="/producers"
              className="text-accent hidden text-sm tracking-wide underline-offset-4 hover:underline md:block"
            >
              Voir tous →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {featuredProducers.map((producer) => (
              <Link key={producer.id} href="/producers" className="group">
                <div className="image-zoom relative mb-3 aspect-3/4 overflow-hidden rounded-sm">
                  {producer.image_url ? (
                    <Image
                      src={producer.image_url}
                      alt={producer.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-muted h-full w-full" />
                  )}
                  <div className="from-foreground/70 absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
                  <div className="absolute right-4 bottom-4 left-4">
                    <p className="text-2xs text-background/70 mb-1 tracking-wide uppercase">
                      {producer.location}
                    </p>
                    <h3 className="font-heading text-background text-lg leading-tight font-semibold">
                      {producer.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Product grid */}
      {newProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-2xs tracking-wide-luxe text-accent mb-2 uppercase">
                Sélection
              </p>
              <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
                Nos produits
              </h2>
            </div>
            <Link
              href="/catalogue"
              className="text-accent hidden text-sm tracking-wide underline-offset-4 hover:underline md:block"
            >
              Tout le catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
