"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useProStatus } from "@/context/pro-context";

const userProfile = {
  name: "Biocoop",
};
export const ProBanner = () => {
  const { isPro, setIsPro } = useProStatus();

  return (
    <div className="bg-foreground grid grid-cols-[1fr_auto_1fr] items-center py-1 px-4 text-sm text-accent">
      <div />
      {isPro ? (
        <div className="flex items-center justify-center gap-3 md:gap-6 text-xs tracking-wide-luxe">
          <span className="text-accent tracking-wide-luxe font-medium">
            ◆ MODE PROFESSIONNEL
          </span>
          <span className="hidden md:inline text-background/50">|</span>
          <span className="text-background/80 hidden md:inline">
            {userProfile.name ? userProfile.name : "Nom de l'entreprise"}
          </span>
          <span className="text-background/50 hidden md:inline">|</span>
          <Button
            variant="link"
            className="text-accent hover:text-accent tracking-widest font-light"
            onClick={() => setIsPro(false)}
          >
            Quitter l'espace pro
          </Button>
        </div>
      ) : (
        <Link
          href="#"
          className="text-xs md:xs tracking-wide-luxe text-accent hover:opacity-70 transition-opacity"
        >
          ACCÈS PROFESSIONNEL
        </Link>
      )}
      <Field className="flex items-center w-fit justify-self-end">
        <FieldLabel className="text-xs text-accent tracking-wide-luxe">
          Mode pro
        </FieldLabel>
        <Switch checked={isPro} onCheckedChange={setIsPro} className="ml-4" />
      </Field>
    </div>
  );
};
