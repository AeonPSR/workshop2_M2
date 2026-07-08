import { NextResponse } from "next/server";
import { getConnectedOdooClient } from "@/lib/api/odoo-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const subject = String(body?.subject ?? "").trim();
  const message = String(body?.message ?? "").trim();

  // Boundary validation (do not trust the client).
  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Tous les champs sont requis." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Adresse email invalide." },
      { status: 400 },
    );
  }

  try {
    const odoo = await getConnectedOdooClient();

    // Creates a CRM lead from the contact form.
    // TODO: confirm the model ('crm.lead' requires the CRM module) and field
    // names against the real Odoo instance once access is available.
    const leadId = await odoo.execute_kw("crm.lead", "create", [
      {
        name: subject,
        contact_name: name,
        email_from: email,
        description: message,
      },
    ]);

    return NextResponse.json({ ok: true, leadId });
  } catch (error) {
    console.error("Odoo contact lead creation failed:", error);
    // Never leak internal/Odoo error details to the client.
    return NextResponse.json(
      { error: "L’envoi a échoué. Veuillez réessayer plus tard." },
      { status: 502 },
    );
  }
}
