"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  SentIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const INITIAL = { name: "", email: "", subject: "", message: "" };
const LABEL_CLASS =
  "text-2xs tracking-wide-luxe text-muted-foreground uppercase";

export default function Contact() {
  const [formData, setFormData] = useState(INITIAL);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field) => (e) =>
    setFormData((current) => ({ ...current, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "L’envoi a échoué.");
      }
      setStatus("sent");
      setFormData(INITIAL);
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const sending = status === "sending";
  const sent = status === "sent";

  return (
    <div>
      {/* Header */}
      <div className="border-accent/30 border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <p className="text-2xs tracking-wide-luxe text-accent mb-2 uppercase">
            Contact
          </p>
          <h1 className="font-heading text-foreground text-3xl font-bold md:text-5xl">
            Parlons ensemble
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Une question, une demande de partenariat, une envie de découvrir nos
            producteurs ? Écrivez-nous.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="name" className={LABEL_CLASS}>
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange("name")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className={LABEL_CLASS}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange("email")}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="subject" className={LABEL_CLASS}>
                  Sujet
                </Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange("subject")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message" className={LABEL_CLASS}>
                  Message
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange("message")}
                />
              </div>

              {status === "error" && (
                <p className="text-destructive text-sm">{errorMsg}</p>
              )}

              <Button
                type="submit"
                disabled={sending || sent}
                className={cn(
                  "tracking-wide-luxe ink-hover relative uppercase",
                  sent &&
                    "border-green-700 bg-green-700 text-white hover:bg-green-700",
                )}
              >
                {sent ? (
                  <>
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
                    Message envoyé
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={SentIcon} size={16} />
                    {sending ? "Envoi…" : "Envoyer le message"}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-secondary/30 rounded-sm p-6">
              <h3 className="font-heading text-foreground mb-4 font-bold">
                Coordonnées
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={16}
                      className="text-accent"
                    />
                  </div>
                  <div>
                    <p className="text-2xs text-muted-foreground tracking-wide uppercase">
                      Email
                    </p>
                    <p className="text-foreground text-sm">
                      contact@pap-france.fr
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <HugeiconsIcon
                      icon={Call02Icon}
                      size={16}
                      className="text-accent"
                    />
                  </div>
                  <div>
                    <p className="text-2xs text-muted-foreground tracking-wide uppercase">
                      Téléphone
                    </p>
                    <p className="text-foreground text-sm">04 75 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={16}
                      className="text-accent"
                    />
                  </div>
                  <div>
                    <p className="text-2xs text-muted-foreground tracking-wide uppercase">
                      Adresse
                    </p>
                    <p className="text-foreground text-sm">
                      Z.A. Artisanale
                      <br />
                      26000 Valence
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-foreground text-background rounded-sm p-6">
              <h3 className="font-heading text-background mb-2 font-bold">
                Espace professionnel
              </h3>
              <p className="text-background/60 mb-4 text-sm">
                Comptes pro créés en back-office. Tarifs dédiés, stocks en temps
                réel, livraison franco.
              </p>
              <Link
                href="/login?type=pro"
                className="text-accent text-sm tracking-wide underline-offset-4 hover:underline"
              >
                Accéder à l’espace pro →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
