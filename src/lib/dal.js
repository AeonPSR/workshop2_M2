import "server-only";
import { cache } from "react";
import { getSession } from "@/lib/session";

export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.uid) return null;
  return session;
});
