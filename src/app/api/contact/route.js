import { NextResponse } from "next/server";
import { getConnectedOdooClient } from "@/lib/api/odoo-client";
import { validateContactInput } from "@/lib/contact";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Boundary validation (do not trust the client).
  const result = validateContactInput(body);
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  const { name, email, subject, message } = result.data;

  try {
    const odoo = await getConnectedOdooClient();

    // Creates a CRM lead from the contact form.
    // Verified against the live Odoo instance: crm.lead is accessible and the
    // fields below (name/contact_name/email_from/description) all exist.
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
