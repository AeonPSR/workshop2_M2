"use server";

import { redirect } from "next/navigation";
import { validateLoginInput, validateSignupInput } from "@/lib/auth";
import { verifyOdooCredentials, createOdooAccount } from "@/lib/api/odoo-auth";
import { createSession, deleteSession } from "@/lib/session";

export async function login(prevState, formData) {
  const result = validateLoginInput({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.valid) {
    return { error: result.error };
  }

  let account;
  try {
    account = await verifyOdooCredentials(
      result.data.email,
      result.data.password,
    );
  } catch (error) {
    console.error("Odoo login failed:", error);
    return { error: "Service indisponible. Veuillez réessayer plus tard." };
  }

  if (!account) {
    return { error: "Identifiants incorrects." };
  }

  await createSession(account);
  redirect("/");
}

export async function signup(prevState, formData) {
  const result = validateSignupInput({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.valid) {
    return { error: result.error };
  }

  let account;
  try {
    account = await createOdooAccount(result.data);
  } catch (error) {
    console.error("Odoo signup failed:", error);
    return { error: "Service indisponible. Veuillez réessayer plus tard." };
  }

  if (account?.error === "duplicate") {
    return { error: "Un compte existe déjà avec cet email." };
  }
  if (!account) {
    return { error: "Impossible de créer le compte." };
  }

  await createSession(account);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
