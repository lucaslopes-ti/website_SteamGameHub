/**
 * Firebase Admin SDK — uso exclusivo no servidor (API routes / scripts).
 *
 * - Inicialização única (singleton) via `FIREBASE_SERVICE_ACCOUNT_KEY`.
 * - Falha fechada em produção: se a chave não estiver configurada, lança erro
 *   em vez de operar sem credenciais.
 * - Nunca importe este módulo em código de cliente ("use client").
 */
import {
  initializeApp,
  getApps,
  cert,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let appInstance: App | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

/**
 * Normaliza a chave privada do service account (quebras de linha costumam ser
 * escapadas como `\\n` em variáveis de ambiente).
 */
function normalizePrivateKey(privateKey: string): string {
  let key = privateKey.replace(/\\n/g, "\n");
  if (!key.includes("\n") && key.includes("BEGIN PRIVATE KEY")) {
    key = key.replace(
      /-----BEGIN PRIVATE KEY-----/,
      "-----BEGIN PRIVATE KEY-----\n"
    );
    key = key.replace(
      /-----END PRIVATE KEY-----/,
      "\n-----END PRIVATE KEY-----"
    );
  }
  return key;
}

function parseServiceAccount(raw: string): ServiceAccount {
  const parsed = JSON.parse(raw);
  if (parsed.private_key) {
    parsed.private_key = normalizePrivateKey(parsed.private_key);
  }
  return parsed as ServiceAccount;
}

export function getAdminApp(): App {
  if (appInstance) return appInstance;

  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY não configurado. Operação bloqueada em produção."
      );
    }
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY não configurado.");
  }

  if (getApps().length > 0) {
    appInstance = getApps()[0];
    return appInstance;
  }

  const serviceAccount = parseServiceAccount(key);
  const options: Record<string, unknown> = {
    credential: cert(serviceAccount),
  };
  // Incluir storageBucket quando disponível para que o módulo de upload
  // (que reutiliza o app Admin) continue funcionando.
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (storageBucket) {
    options.storageBucket = storageBucket;
  }

  appInstance = initializeApp(options);
  return appInstance;
}

export function getAdminDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getAdminApp());
  }
  return dbInstance;
}

export function getAdminAuth(): Auth {
  if (!authInstance) {
    authInstance = getAuth(getAdminApp());
  }
  return authInstance;
}

/**
 * Converte valores de Timestamp do Firestore em strings ISO 8601 para
 * serialização segura em JSON (evita objetos `{ _seconds, _nanoseconds }`).
 */
export function serializeTimestamps<T extends Record<string, unknown>>(
  data: T
): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && "toDate" in value) {
      const ts = value as { toDate: () => Date };
      out[key] = ts.toDate().toISOString();
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Remove valores `undefined` (recursivamente em objetos/arrays) antes de
 * gravar no Firestore, que rejeita `undefined` em documentos.
 *
 * Objetos não-plain (ex.: `FieldValue`, `Timestamp`) são preservados intactos.
 */
export function stripUndefined<T extends Record<string, unknown>>(data: T): T {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      out[key] = value
        .map((item) =>
          isPlainObject(item) ? stripUndefined(item) : item
        )
        .filter((item) => item !== undefined);
    } else if (isPlainObject(value)) {
      out[key] = stripUndefined(value);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}
