"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useProStatus } from "@/context/pro-context";
import { logout } from "@/app/actions/auth";

export const ProBanner = () => {
  const { isPro, name } = useProStatus();
  const isLoggedIn = Boolean(name);

  if (isLoggedIn && isPro) {
    return (
      <div className="bg-foreground text-accent grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 text-sm">
        <div />
        <div className="tracking-wide-luxe flex items-center justify-center gap-3 text-xs md:gap-6">
          <span className="text-accent tracking-wide-luxe font-medium">
            ◆ MODE PROFESSIONNEL
          </span>
          <span className="text-background/50 hidden md:inline">|</span>
          <span className="text-background/80 hidden md:inline">{name}</span>
          <span className="text-background/50 hidden md:inline">|</span>
          <Button
            variant="link"
            className="text-accent hover:text-accent font-light tracking-widest"
            onClick={() => logout()}
          >
            Se déconnecter
          </Button>
        </div>
        <div />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="bg-foreground text-accent grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 text-sm">
        <div />
        <div className="flex items-center justify-center gap-4 text-xs tracking-widest">
          <span className="text-primary/80">Bonjour, {name}</span>
          <span className="text-background/50">|</span>
          <Button
            variant="link"
            className="text-accent hover:text-accent tracking-luxe px-0"
            onClick={() => logout()}
          >
            Déconnexion
          </Button>
        </div>
        <div />
      </div>
    );
  }

  return (
    <div className="bg-foreground text-accent grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3 text-sm">
      <div />
      <div className="tracking-wide-luxe flex items-center justify-center gap-3 text-xs md:gap-6">
        <Link
          href="/login?type=particulier"
          className="text-accent transition-opacity hover:opacity-70"
        >
          ESPACE PARTICULIER
        </Link>
        <span className="text-background/50 hidden md:inline">|</span>
        <Link
          href="/login?type=pro"
          className="text-accent transition-opacity hover:opacity-70"
        >
          ESPACE PROFESSIONNEL
        </Link>
      </div>
      <div />
    </div>
  );
};
