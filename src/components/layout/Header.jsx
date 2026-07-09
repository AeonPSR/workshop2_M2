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
      <header className="border-accent/50 bg-background/90 sticky top-0 z-40 border-b backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="bg-foreground ring-accent/20 flex items-center justify-center overflow-hidden ring-1">
              <Image
                src={pap}
                alt="Plateforme des Artisans Producteurs"
                className="h-auto max-w-24"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-heading text-foreground text-lg leading-none font-bold">
                Comptoir
              </div>
              <div className="text-2xs tracking-wide-luxe text-muted-foreground mt-0.5 uppercase">
                artisan
              </div>
            </div>
          </Link>
          <Searchbar />
          <ul className="hidden items-center gap-4 lg:flex">
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
                      "text-foreground hover:text-accent text-sm text-nowrap",
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
              className="text-foreground hover:text-accent relative flex items-center gap-1 text-sm transition"
            >
              <HugeiconsIcon icon={ShoppingBasket03Icon} />
              {cartCount > 0 && (
                <span className="bg-accent text-background absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
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
