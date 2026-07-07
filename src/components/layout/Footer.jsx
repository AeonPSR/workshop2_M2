"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import pap from "../../../public/pap.webp";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/products" },
  { label: "Producteurs", href: "/producers" },
  { label: "Notre histoire", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="text-background/70 bg-foreground  px-4 md:px-8 pb-10 pt-16 md:pt-24 mt-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-w-7xl gap-10 w-full mx-auto">
        <div className="sm:col-span-2">
          <Image
            src={pap}
            alt="Plateforme des Artisans Producteurs"
            className="max-w-40 h-auto"
          />

          <p className="text-sm max-w-md mt-2.5">
            La plateforme qui relie les artisans producteurs français aux
            clients exigeants.
          </p>
        </div>
        <div>
          <h4 className="text-2xs tracking-wide-luxe text-accent uppercase mb-4">
            navigation
          </h4>
          <ul className="flex flex-col gap-2.5">
            {navigationItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm hover:text-accent transition-colors",
                      isActive && "text-accent",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h4 className="text-2xs tracking-wide-luxe text-accent uppercase mb-4">
            contact
          </h4>
          <ul className="flex flex-col gap-2.5">
            <li className="flex items-start gap-2 text-sm">
              <HugeiconsIcon
                icon={Location01Icon}
                size={18}
                absoluteStrokeWidth
                className="shrink-0 mt-0.5"
              />
              12 rue des Artisans, 75011 Paris
            </li>
            <li className="flex items-center gap-2 text-sm">
              <HugeiconsIcon icon={Call02Icon} size={18} absoluteStrokeWidth />
              01 23 45 67 89
            </li>
            <li className="flex items-center gap-2 text-sm">
              <HugeiconsIcon icon={Mail01Icon} size={18} absoluteStrokeWidth />
              contact@pap.fr
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 md:mt-20 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50 text-center">
        <p>
          © 2026 PAP — Plateforme des Artisans Producteurs. Tous droits
          réservés.
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-4">
          <li>
            <Link
              href="/mentions-legales"
              className={cn(
                "hover:text-accent transition-colors",
                pathname === "/mentions-legales" && "text-accent",
              )}
            >
              Mentions légales
            </Link>
          </li>
          <li>
            <Link
              href="/cgv"
              className={cn(
                "hover:text-accent transition-colors",
                pathname === "/cgv" && "text-accent",
              )}
            >
              CGV
            </Link>
          </li>
          <li>
            <Link
              href="/confidentialite"
              className={cn(
                "hover:text-accent transition-colors",
                pathname === "/confidentialite" && "text-accent",
              )}
            >
              Confidentialité
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
