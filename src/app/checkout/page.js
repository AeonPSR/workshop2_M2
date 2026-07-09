"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useProStatus } from "@/context/pro-context";
import { placeOrder } from "@/app/actions/checkout";
import { STORE, DELIVERY_FEE } from "@/lib/constants";
import { nextPickupDates, toISODate, formatPickupDate } from "@/lib/pickup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const LABEL_CLASS =
  "text-2xs tracking-wide-luxe text-muted-foreground uppercase";

export default function CheckoutPage() {
  const { cart, products, getPrice, clearCart, loading } = useApp();
  const { isPro, name: sessionName } = useProStatus();

  const pickupDates = useMemo(() => nextPickupDates(), []);

  const [method, setMethod] = useState("delivery");
  const [address, setAddress] = useState({
    street: "",
    postalCode: "",
    city: "",
  });
  const [pickupDate, setPickupDate] = useState(toISODate(pickupDates[0]));
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardHolder: "",
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const subtotal = lines.reduce(
    (sum, line) => sum + getPrice(line.product) * line.qty,
    0,
  );
  const effectiveMethod = isPro ? "delivery" : method;
  const deliveryFee =
    !isPro && effectiveMethod === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const loggedIn = !!sessionName;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await placeOrder({
        cart,
        fulfillment: isPro
          ? { method: "delivery" }
          : method === "pickup"
            ? { method: "pickup", pickupDate }
            : { method: "delivery", address },
        contact: loggedIn ? undefined : contact,
        payment,
      });

      if (result.success) {
        clearCart();
        setConfirmation(result);
      } else {
        setError(result.error);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="border-secondary border-t-accent h-8 w-8 animate-spin rounded-full border-4" />
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-2xs tracking-wide-luxe text-accent mb-2 uppercase">
          Commande confirmée
        </p>
        <h1 className="font-heading text-foreground mb-4 text-3xl font-bold">
          Merci !
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Votre commande{" "}
          <span className="text-foreground font-medium">
            {confirmation.orderName}
          </span>{" "}
          a bien été enregistrée.
        </p>
        <Link href="/catalogue">
          <Button variant="outline">Continuer mes achats</Button>
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground mb-4">Votre panier est vide.</p>
        <Link href="/catalogue">
          <Button variant="outline">Découvrir le catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="border-accent/30 border-b">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <p className="text-2xs tracking-wide-luxe text-accent mb-2 uppercase">
            Commande
          </p>
          <h1 className="font-heading text-foreground text-3xl font-bold md:text-5xl">
            Finaliser ma commande
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl px-4 py-8 md:px-8"
      >
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-10">
            {/* Fulfillment */}
            <section className="space-y-4">
              <h2 className="font-heading text-foreground text-lg font-bold">
                Livraison
              </h2>

              {isPro ? (
                <p className="text-muted-foreground text-sm">
                  Livraison offerte, associée à votre compte professionnel.
                </p>
              ) : (
                <>
                  <RadioGroup
                    value={method}
                    onValueChange={setMethod}
                    className="gap-3"
                  >
                    <label className="border-border flex cursor-pointer items-center gap-3 rounded-sm border p-4">
                      <RadioGroupItem value="delivery" />
                      <span className="text-foreground flex-1 text-sm">
                        Livraison à domicile
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {DELIVERY_FEE.toFixed(2)}€
                      </span>
                    </label>
                    <label className="border-border flex cursor-pointer items-center gap-3 rounded-sm border p-4">
                      <RadioGroupItem value="pickup" />
                      <span className="text-foreground flex-1 text-sm">
                        Retrait en magasin
                      </span>
                      <span className="text-muted-foreground text-sm">
                        Gratuit
                      </span>
                    </label>
                  </RadioGroup>

                  {method === "delivery" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1 sm:col-span-2">
                        <Label className={LABEL_CLASS}>Adresse</Label>
                        <Input
                          required
                          value={address.street}
                          onChange={(e) =>
                            setAddress((a) => ({
                              ...a,
                              street: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className={LABEL_CLASS}>Code postal</Label>
                        <Input
                          required
                          value={address.postalCode}
                          onChange={(e) =>
                            setAddress((a) => ({
                              ...a,
                              postalCode: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className={LABEL_CLASS}>Ville</Label>
                        <Input
                          required
                          value={address.city}
                          onChange={(e) =>
                            setAddress((a) => ({ ...a, city: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  {method === "pickup" && (
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm">
                        {STORE.address}. Ouvert le lundi et le mardi.
                      </p>
                      <RadioGroup
                        value={pickupDate}
                        onValueChange={setPickupDate}
                        className="gap-2"
                      >
                        {pickupDates.map((date) => {
                          const iso = toISODate(date);
                          return (
                            <label
                              key={iso}
                              className="border-border flex cursor-pointer items-center gap-3 rounded-sm border p-3"
                            >
                              <RadioGroupItem value={iso} />
                              <span className="text-foreground text-sm capitalize">
                                {formatPickupDate(date)}
                              </span>
                            </label>
                          );
                        })}
                      </RadioGroup>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Contact */}
            {!loggedIn && (
              <section className="space-y-4">
                <h2 className="font-heading text-foreground text-lg font-bold">
                  Coordonnées
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className={LABEL_CLASS}>Nom</Label>
                    <Input
                      required
                      value={contact.name}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className={LABEL_CLASS}>Email</Label>
                    <Input
                      type="email"
                      required
                      value={contact.email}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, email: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className={LABEL_CLASS}>Téléphone</Label>
                    <Input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </section>
            )}
            {loggedIn && (
              <p className="text-muted-foreground text-sm">
                Commande associée à votre compte :{" "}
                <span className="text-foreground">{sessionName}</span>
              </p>
            )}

            {/* Fake payment */}
            <section className="space-y-4">
              <h2 className="font-heading text-foreground text-lg font-bold">
                Paiement
              </h2>
              <p className="text-muted-foreground text-xs">
                Paiement de test — aucune donnée bancaire réelle n'est traitée.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <Label className={LABEL_CLASS}>Titulaire de la carte</Label>
                  <Input
                    required
                    value={payment.cardHolder}
                    onChange={(e) =>
                      setPayment((p) => ({ ...p, cardHolder: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className={LABEL_CLASS}>Numéro de carte</Label>
                  <Input
                    required
                    placeholder="4242 4242 4242 4242"
                    value={payment.cardNumber}
                    onChange={(e) =>
                      setPayment((p) => ({ ...p, cardNumber: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className={LABEL_CLASS}>Expiration (MM/AA)</Label>
                  <Input
                    required
                    placeholder="12/29"
                    value={payment.expiry}
                    onChange={(e) =>
                      setPayment((p) => ({ ...p, expiry: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className={LABEL_CLASS}>CVC</Label>
                  <Input
                    required
                    placeholder="123"
                    value={payment.cvc}
                    onChange={(e) =>
                      setPayment((p) => ({ ...p, cvc: e.target.value }))
                    }
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="shrink-0 lg:w-80">
            <div className="bg-secondary/50 sticky top-24 space-y-4 p-6">
              <h2 className="font-heading text-foreground text-lg font-bold">
                Récapitulatif
              </h2>
              <ul className="space-y-1.5 text-sm">
                {lines.map(({ product, qty }) => (
                  <li key={product.id} className="flex justify-between gap-2">
                    <span className="text-muted-foreground truncate">
                      {qty} × {product.name}
                    </span>
                    <span className="text-foreground shrink-0">
                      {(getPrice(product) * qty).toFixed(2)}€
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-border space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="text-foreground">
                    {subtotal.toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-foreground">
                    {deliveryFee > 0 ? `${deliveryFee.toFixed(2)}€` : "Offerte"}
                  </span>
                </div>
              </div>
              <div className="border-border flex items-center justify-between border-t pt-4">
                <span className="font-heading text-foreground font-bold">
                  Total
                </span>
                <span className="font-heading text-foreground text-lg font-bold">
                  {total.toFixed(2)}€
                </span>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Validation…" : "Confirmer et payer"}
              </Button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
