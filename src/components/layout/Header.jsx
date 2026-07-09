"use client";

import { ProBanner } from "./ProBanner";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import pap from "../../../public/pap.webp";
import { Searchbar } from "./Searchbar";
import { MobileMenu } from "./MobileMenu";
import { ShoppingBasket03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

const menuItems = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/catalogue" },
  { label: "Producteurs", href: "/producers" },
  { label: "Notre histoire", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Header = () => {
  const pathname = usePathname();
  const { cartCount } = useApp();

  return (
    <>
      <ProBanner />
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-accent/50 bg-background/70">
        <nav className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="overflow-hidden bg-foreground flex items-center justify-center ring-1 ring-accent/20">
              <Image
                src={pap}
                alt="Plateforme des Artisans Producteurs"
                className="max-w-24 h-auto"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-foreground text-lg leading-none">
                Plateforme
              </div>
              <div className="text-2xs tracking-wide-luxe text-muted-foreground uppercase mt-0.5">
                Artisans Producteurs
              </div>
            </div>
          </Link>
          <Searchbar />
          <ul className="hidden lg:flex items-center gap-4">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm text-foreground hover:text-accent text-nowrap",
                      isActive && "text-accent",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex space-x-2">
            <Link
              href="/cart"
              className="relative flex items-center gap-1 text-sm text-foreground transition hover:text-accent"
            >
              <HugeiconsIcon icon={ShoppingBasket03Icon} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-background">
                  {cartCount}
                </span>
              )}
            </Link>
            <MobileMenu />
          </div>
        </nav>
      </header>
    </>
  );
};
