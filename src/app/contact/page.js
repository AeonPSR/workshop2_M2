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
const LABEL_CLASS = "text-2xs tracking-wide-luxe text-muted-foreground uppercase";

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
      <div className="border-b border-accent/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <p className="text-2xs tracking-wide-luxe text-accent uppercase mb-2">Contact</p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground">Parlons ensemble</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Une question, une demande de partenariat, une envie de découvrir nos producteurs ? Écrivez-nous.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <Label htmlFor="name" className={LABEL_CLASS}>Nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange("name")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className={LABEL_CLASS}>Email</Label>
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
                <Label htmlFor="subject" className={LABEL_CLASS}>Sujet</Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange("subject")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="message" className={LABEL_CLASS}>Message</Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange("message")}
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}

              <Button
                type="submit"
                disabled={sending || sent}
                className={cn(
                  "tracking-wide-luxe uppercase ink-hover relative",
                  sent && "bg-green-700 border-green-700 text-white hover:bg-green-700",
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
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-secondary/30 rounded-sm p-6">
              <h3 className="font-heading font-bold text-foreground mb-4">Coordonnées</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={Mail01Icon} size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xs tracking-wide text-muted-foreground uppercase">Email</p>
                    <p className="text-sm text-foreground">contact@pap-france.fr</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={Call02Icon} size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xs tracking-wide text-muted-foreground uppercase">Téléphone</p>
                    <p className="text-sm text-foreground">04 75 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={Location01Icon} size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xs tracking-wide text-muted-foreground uppercase">Adresse</p>
                    <p className="text-sm text-foreground">Z.A. Artisanale<br />26000 Valence</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-foreground text-background rounded-sm p-6">
              <h3 className="font-heading font-bold text-background mb-2">Espace professionnel</h3>
              <p className="text-sm text-background/60 mb-4">
                Comptes pro créés en back-office. Tarifs dédiés, stocks en temps réel, livraison franco.
              </p>
              <Link href="/pro" className="text-accent text-sm tracking-wide hover:underline underline-offset-4">
                Accéder à l’espace pro →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
