/**
 * Helpers compartilhados de Firebase Admin para as API routes da SQL Quest.
 *
 * Centraliza a checagem de configuração e a resposta 503 clara quando o
 * Firebase não está configurado (evita falhar 500 com erro de configuração).
 */
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
}

export function firebaseUnavailableResponse(): NextResponse {
  return NextResponse.json(
    {
      error:
        "O Firebase não está configurado neste ambiente. Configure FIREBASE_SERVICE_ACCOUNT_KEY para habilitar os recursos da SQL Quest.",
      code: "FIREBASE_NOT_CONFIGURED",
    },
    { status: 503 }
  );
}

/**
 * Resolve o Firestore Admin ou uma resposta 503 clara quando o Firebase não
 * está configurado.
 */
export async function getDbOrUnavailable(): Promise<{
  db: ReturnType<typeof getAdminDb> | null;
  response: NextResponse | null;
}> {
  if (!firebaseConfigured()) {
    return { db: null, response: firebaseUnavailableResponse() };
  }
  try {
    return { db: getAdminDb(), response: null };
  } catch (error) {
    console.error("[sql-quest] Falha ao inicializar Firestore Admin:", error);
    return { db: null, response: firebaseUnavailableResponse() };
  }
}