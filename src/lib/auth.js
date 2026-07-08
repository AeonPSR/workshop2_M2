const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginInput(body) {
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return { valid: false, error: "Tous les champs sont requis." };
  }
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "Adresse email invalide." };
  }

  return { valid: true, data: { email, password } };
}
