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
import { STORE } from "@/lib/constants";

const navigationItems = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/catalogue" },
  { label: "Producteurs", href: "/producers" },
  { label: "Notre histoire", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="bg-foreground text-background/70 mt-auto px-4 pt-16 pb-10 md:px-8 md:pt-24">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <Image
            src={pap}
            alt="Plateforme des Artisans Producteurs"
            className="h-auto max-w-40"
          />

          <p className="mt-2.5 max-w-md text-sm">
            La plateforme qui relie les artisans producteurs français aux
            clients exigeants.
          </p>
        </div>
        <div>
          <h4 className="text-2xs tracking-wide-luxe text-accent mb-4 uppercase">
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
                      "hover:text-accent text-sm transition-colors",
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
          <h4 className="text-2xs tracking-wide-luxe text-accent mb-4 uppercase">
            contact
          </h4>
          <ul className="flex flex-col gap-2.5">
            <li className="flex items-start gap-2 text-sm">
              <HugeiconsIcon
                icon={Location01Icon}
                size={18}
                absoluteStrokeWidth
                className="mt-0.5 shrink-0"
              />
              {STORE.address}
            </li>
            <li className="flex items-center gap-2 text-sm">
              <HugeiconsIcon icon={Call02Icon} size={18} absoluteStrokeWidth />
              {STORE.phone}
            </li>
            <li className="flex items-center gap-2 text-sm">
              <HugeiconsIcon icon={Mail01Icon} size={18} absoluteStrokeWidth />
              {STORE.email}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-background/10 text-background/50 mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t pt-8 text-center text-xs md:mt-20 md:flex-row">
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
