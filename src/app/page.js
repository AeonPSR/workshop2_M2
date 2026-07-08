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
    // No "featured" flag in Odoo — show a random selection.
    return [...products].sort(() => Math.random() - 0.5).slice(0, 4);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] lg:min-h-[88vh]">
          {/* Left: producer image */}
          <div className="relative overflow-hidden order-2 lg:order-1 min-h-[40vh] lg:min-h-0">
            <Image
              src={IMAGES.hero}
              alt="Producteur artisanal"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 z-10">
              <span className="vertical-text text-background/50 text-2xs tracking-wide-luxe uppercase">
                Producteurs · France
              </span>
            </div>
          </div>

          {/* Right: content */}
          <div className="bg-background flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 order-1 lg:order-2">
            <p className="text-2xs tracking-wide-luxe text-accent uppercase mb-4">◆ Bio Haut de Gamme</p>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.05] mb-6">
              L’excellence<br />artisanale,<br /><span className="text-accent">livrée.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mb-8 leading-relaxed">
              Du producteur à votre table. Des produits bio d’exception, sélectionnés auprès des meilleurs artisans de France.
            </p>

            {/* Featured carousel */}
            {featuredProducts.length > 0 && (
              <div
                className="mb-8 max-w-md border border-accent/40 rounded-sm p-4 bg-accent/5"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xs tracking-wide-luxe text-accent uppercase whitespace-nowrap font-semibold">◆ Produit phare</span>
                  <div className="flex-1 h-px bg-accent/30" />
                  <div className="flex gap-1">
                    <button onClick={() => setCurrentSlide((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1))}>
                      <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5 text-foreground hover:text-accent" />
                    </button>
                    <button onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)}>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 text-foreground hover:text-accent" />
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
                        <Link href="#" className="flex items-center gap-5 group">
                          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-sm overflow-hidden shrink-0 image-zoom bg-secondary ring-1 ring-accent/20">
                            {product.image_url ? (
                              <Image src={product.image_url} alt={product.name} fill sizes="144px" className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-muted" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-2xs tracking-wide text-muted-foreground uppercase truncate">{product.category}</p>
                            <h3 className="font-heading font-bold text-foreground group-hover:text-accent transition-colors text-lg md:text-xl leading-tight">{product.name}</h3>
                            <p className="text-lg text-accent font-heading font-bold mt-2">Dès {getPrice(product)?.toFixed(2)}€</p>
                            <span className="inline-flex items-center gap-1 text-xs text-foreground mt-2 group-hover:gap-2 transition-all">
                              Découvrir <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5 justify-center mt-4">
                  {featuredProducts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={cn("h-1.5 rounded-full transition-all", i === currentSlide ? "w-8 bg-accent" : "w-1.5 bg-accent/20")}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="#" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background text-sm tracking-wide hover:bg-accent transition-colors ink-hover relative">
                Découvrir le catalogue
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
              </Link>
              <Link href="#" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-foreground text-foreground text-sm tracking-wide hover:bg-foreground hover:text-background transition-colors">
                Nos producteurs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-accent/30 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-16">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Leaf01Icon} className="w-4 h-4 text-accent" />
            <span className="text-xs tracking-wide text-foreground">Certifié Bio AB</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={UserMultipleIcon} className="w-4 h-4 text-accent" />
            <span className="text-xs tracking-wide text-foreground">Producteurs sélectionnés</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={TruckIcon} className="w-4 h-4 text-accent" />
            <span className="text-xs tracking-wide text-foreground">Livraison franco (pro)</span>
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Award01Icon} className="w-4 h-4 text-accent" />
            <span className="text-xs tracking-wide text-foreground">Biocoop & La Vie Claire</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="mb-10">
          <p className="text-2xs tracking-wide-luxe text-accent uppercase mb-2">Rayons</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">Explorez par catégorie</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat}
              href={`/catalogue?category=${encodeURIComponent(cat)}`}
              className="group relative aspect-square bg-secondary/30 rounded-sm border border-border hover:border-accent transition-all overflow-hidden flex flex-col justify-end ink-hover"
            >
              {categoryImage[cat] || CATEGORY_FALLBACK_IMAGES[cat] ? (
                <Image
                  src={categoryImage[cat] || CATEGORY_FALLBACK_IMAGES[cat]}
                  alt={cat}
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover object-center opacity-40 group-hover:opacity-60 transition-opacity"
                />
              ) : null}
              <div className="relative z-10 p-5 md:p-6">
                <span className="absolute top-3 right-3 text-2xs text-muted-foreground font-mono">0{i + 1}</span>
                <h3 className="font-heading font-semibold text-foreground group-hover:text-accent transition-colors text-sm md:text-base leading-tight">{cat}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand presentation */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="text-2xs tracking-wide-luxe text-accent uppercase mb-4">Notre Histoire</p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6 leading-tight">
              Une plateforme née<br />de la passion du terroir
            </h2>
            <p className="text-background/60 leading-relaxed mb-6">
              PAP est née d’une conviction simple : les meilleurs produits méritent les meilleurs circuits de distribution. Nous travaillons main dans la main avec des artisans producteurs d’exception pour porter leurs créations jusqu’aux enseignes et particuliers les plus exigeants.
            </p>
            <Link href="#" className="inline-flex items-center gap-2 text-accent text-sm tracking-wide hover:gap-3 transition-all">
              Découvrir notre histoire
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
            <Image
              src={IMAGES.landscape}
              alt="Paysage de terroir"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Producer preview */}
      {featuredProducers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-2xs tracking-wide-luxe text-accent uppercase mb-2">Producteurs</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">Nos artisans</h2>
            </div>
            <Link href="#" className="text-sm text-accent tracking-wide hover:underline underline-offset-4 hidden md:block">
              Voir tous →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {featuredProducers.map((producer) => (
              <Link key={producer.id} href="#" className="group">
                <div className="image-zoom relative aspect-[3/4] rounded-sm overflow-hidden mb-3">
                  {producer.image_url ? (
                    <Image src={producer.image_url} alt={producer.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-2xs tracking-wide text-background/70 uppercase mb-1">{producer.location}</p>
                    <h3 className="font-heading font-semibold text-background text-lg leading-tight">{producer.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Product grid */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-2xs tracking-wide-luxe text-accent uppercase mb-2">Sélection</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">Nos produits</h2>
            </div>
            <Link href="#" className="text-sm text-accent tracking-wide hover:underline underline-offset-4 hidden md:block">
              Tout le catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
