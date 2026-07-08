const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate and normalize a contact form submission.
 * @param {unknown} body - Parsed request body.
 * @returns {{ valid: boolean, error?: string, data?: { name: string, email: string, subject: string, message: string } }}
 */
export function validateContactInput(body) {
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const subject = String(body?.subject ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !subject || !message) {
    return { valid: false, error: "Tous les champs sont requis." };
  }
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "Adresse email invalide." };
  }

  return { valid: true, data: { name, email, subject, message } };
}
