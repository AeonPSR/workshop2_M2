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

export function validateSignupInput(body) {
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!name || !email || !password) {
    return { valid: false, error: "Tous les champs sont requis." };
  }
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "Adresse email invalide." };
  }
  if (password.length < 6) {
    return {
      valid: false,
      error: "Le mot de passe doit contenir au moins 6 caractères.",
    };
  }

  return { valid: true, data: { name, email, password } };
}
