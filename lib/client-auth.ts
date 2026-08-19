"use client";

/**
 * Fetch autenticado no cliente.
 *
 * Anexa `Authorization: Bearer <currentUser.getIdToken()>` sem quebrar os
 * demais headers já definidos pelo chamador.
 */
import { getFirebaseAuth } from "@/lib/firebase/config";

export async function authedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers || {});
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      headers.set("Authorization", `Bearer ${token}`);
    }
  } catch (error) {
    console.error("Erro ao obter token de autenticação:", error);
  }
  return fetch(input, { ...init, headers });
}
