import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Truck, Users, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { IMAGES, CATEGORIES } from '@/lib/constants';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const { products, producers } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.featured);
  }, [products]);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const featuredProducers = producers.slice(0, 3);
  const newProducts = products.slice(0, 8);

  return (
    <div>
      {/* Hero — Split screen */}
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] lg:min-h-[88vh]">
          {/* Left: producer image */}
          <div className="relative overflow-hidden order-2 lg:order-1 min-h-[40vh] lg:min-h-0">
            <img src={IMAGES.hero} alt="Producteur PAP" className="w-full h-full object-cover absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/30 to-transparent" />
            <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 z-10">
              <span className="vertical-text text-bone/50 text-[10px] tracking-wide-luxe uppercase">
                Producteurs · France
              </span>
            </div>
          </div>

          {/* Right: content */}
          <div className="bg-bone flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 order-1 lg:order-2">
            <p className="text-[10px] tracking-wide-luxe text-gold uppercase mb-4">◆ Bio Haut de Gamme</p>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-obsidian leading-[1.05] mb-6">
              L'excellence<br />artisanale,<br /><span className="text-gold">livrée.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md mb-8 leading-relaxed">
              Du producteur à votre table. Des produits bio d'exception, sélectionnés auprès des meilleurs artisans de France.
            </p>

            {/* Featured carousel */}
            {featuredProducts.length > 0 && (
              <div className="mb-8 max-w-md border border-gold/40 rounded-sm p-4 bg-gold/5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] tracking-wide-luxe text-gold uppercase whitespace-nowrap font-semibold">◆ Produit phare</span>
                  <div className="flex-1 h-px bg-gold/30" />
                  <div className="flex gap-1">
                    <button onClick={() => setCurrentSlide(prev => prev === 0 ? featuredProducts.length - 1 : prev - 1)}>
                      <ChevronLeft className="w-5 h-5 text-obsidian hover:text-gold" />
                    </button>
                    <button onClick={() => setCurrentSlide(prev => (prev + 1) % featuredProducts.length)}>
                      <ChevronRight className="w-5 h-5 text-obsidian hover:text-gold" />
                    </button>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-sm">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {featuredProducts.map(product => (
                      <div key={product.id} className="min-w-full">
                        <Link to={`/produit/${product.id}`} className="flex items-center gap-5 group">
                          <div className="w-28 h-28 md:w-36 md:h-36 rounded-sm overflow-hidden shrink-0 image-zoom bg-secondary ring-1 ring-gold/20">
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] tracking-wide text-muted-foreground uppercase truncate">{product.category}</p>
                            <h3 className="font-heading font-bold text-obsidian group-hover:text-gold transition-colors text-lg md:text-xl leading-tight">{product.name}</h3>
                            <p className="text-lg text-gold font-heading font-bold mt-2">Dès {product.price_particulier?.toFixed(2)}€</p>
                            <span className="inline-flex items-center gap-1 text-xs text-obsidian mt-2 group-hover:gap-2 transition-all">
                              Découvrir <ArrowRight className="w-3.5 h-3.5" />
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
                      className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-gold' : 'w-1.5 bg-gold/20'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/catalogue" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-obsidian text-bone text-sm tracking-wide hover:bg-gold transition-colors ink-hover relative">
                Découvrir le catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/producteurs" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-obsidian text-obsidian text-sm tracking-wide hover:bg-obsidian hover:text-bone transition-colors">
                Nos producteurs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y gold-rule bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-16">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-gold" />
            <span className="text-xs tracking-wide text-obsidian">Certifié Bio AB</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-xs tracking-wide text-obsidian">Producteurs sélectionnés</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gold" />
            <span className="text-xs tracking-wide text-obsidian">Livraison franco (pro)</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gold" />
            <span className="text-xs tracking-wide text-obsidian">Biocoop & La Vie Claire</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="mb-10">
          <p className="text-[10px] tracking-wide-luxe text-gold uppercase mb-2">Rayons</p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-obsidian">Explorez par catégorie</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat}
              to={`/catalogue?category=${encodeURIComponent(cat)}`}
              className="group relative aspect-square bg-secondary/30 rounded-sm border border-border hover:border-gold transition-all p-5 md:p-6 flex flex-col justify-end ink-hover"
            >
              <span className="absolute top-3 right-3 text-[10px] text-muted-foreground font-mono">0{i+1}</span>
              <h3 className="font-heading font-semibold text-obsidian group-hover:text-gold transition-colors text-sm md:text-base leading-tight">{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand presentation */}
      <section className="bg-obsidian text-bone py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="text-[10px] tracking-wide-luxe text-gold uppercase mb-4">Notre Histoire</p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6 leading-tight">
              Une plateforme née<br />de la passion du terroir
            </h2>
            <p className="text-bone/60 leading-relaxed mb-6">
              PAP est née d'une conviction simple : les meilleurs produits méritent les meilleurs circuits de distribution. Nous travaillons main dans la main avec des artisans producteurs d'exception pour porter leurs créations jusqu'aux enseignes et particuliers les plus exigeants.
            </p>
            <Link to="/histoire" className="inline-flex items-center gap-2 text-gold text-sm tracking-wide hover:gap-3 transition-all">
              Découvrir notre histoire
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
            <img src={IMAGES.landscape} alt="Paysage Vercors" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Producer preview */}
      {featuredProducers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-wide-luxe text-gold uppercase mb-2">Producteurs</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-obsidian">Nos artisans</h2>
            </div>
            <Link to="/producteurs" className="text-sm text-gold tracking-wide hover:underline underline-offset-4 hidden md:block">
              Voir tous →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {featuredProducers.map(producer => (
              <Link key={producer.id} to="/producteurs" className="group">
                <div className="image-zoom relative aspect-[3/4] rounded-sm overflow-hidden mb-3">
                  <img src={producer.image_url} alt={producer.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] tracking-wide text-bone/70 uppercase mb-1">{producer.location}</p>
                    <h3 className="font-heading font-semibold text-bone text-lg leading-tight">{producer.name}</h3>
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
              <p className="text-[10px] tracking-wide-luxe text-gold uppercase mb-2">Sélection</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-obsidian">Nos produits</h2>
            </div>
            <Link to="/catalogue" className="text-sm text-gold tracking-wide hover:underline underline-offset-4 hidden md:block">
              Tout le catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}