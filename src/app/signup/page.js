"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";

const LABEL_CLASS =
  "text-2xs tracking-wide-luxe text-muted-foreground uppercase";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="flex flex-col items-center space-y-2">
        <p className="text-accent tracking-wide-luxe text-2xs uppercase">
          Espace Particulier
        </p>
        <h1 className="font-heading text-foreground mb-8 text-4xl font-bold">
          Créer mon compte
        </h1>
      </div>

      <form action={action} className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="name" className={LABEL_CLASS}>
            Nom complet
          </Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email" className={LABEL_CLASS}>
            Email
          </Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password" className={LABEL_CLASS}>
            Mot de passe
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
          />
        </div>

        {state?.error && (
          <p className="text-destructive text-sm">{state.error}</p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="tracking-wide-luxe w-full gap-4 uppercase"
        >
          <HugeiconsIcon icon={UserAdd01Icon} />
          {pending ? "Création…" : "Créer mon compte"}
        </Button>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Déjà inscrit ?{" "}
        <Link href="/login" className="text-accent underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
