"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Logout01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProStatus } from "@/context/pro-context";
import { logout } from "@/app/actions/auth";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

const menuItems = [
  { label: "Accueil", href: "/" },
  { label: "Produits", href: "/catalogue" },
  { label: "Producteurs", href: "/producers" },
  { label: "Notre histoire", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const MobileMenu = () => {
  const pathname = usePathname();
  const { isConnected } = useProStatus();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            className="text-foreground rounded-md lg:hidden"
          />
        }
      >
        <HugeiconsIcon icon={Menu01Icon} size={18} />
        <span className="sr-only">Ouvrir le menu</span>
      </SheetTrigger>
      <SheetContent side="right" className={"h-screen min-h-0"}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ul className="flex flex-col gap-1 px-6">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <SheetClose
                  render={<Link href={item.href} />}
                  nativeButton={false}
                  className={cn(
                    "text-foreground hover:text-accent block py-2 text-sm",
                    isActive && "text-accent",
                  )}
                >
                  {item.label}
                </SheetClose>
              </li>
            );
          })}
        </ul>
        {isConnected && (
          <SheetFooter>
            <form action={logout} className="w-full">
              <SheetClose
                render={
                  <Button
                    type="submit"
                    variant="ghost"
                    className="hover:text-accent w-full gap-2 transition"
                  />
                }
              >
                Déconnexion
                <HugeiconsIcon icon={Logout01Icon} size={18} />
              </SheetClose>
            </form>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
