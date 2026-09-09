import type { MetadataRoute } from "next";

/**
 * Sitemap público.
 *
 * Sempre emite as URLs públicas estáticas (`/`, `/about`, `/games`, `/stats`).
 * Quando a infraestrutura Firebase Admin está disponível no momento da
 * geração, adiciona também os jogos aprovados (`/games/:id`). Qualquer falha
 * (ex.: variável FIREBASE_SERVICE_ACCOUNT_KEY ausente em build local) apenas
 * degrada para a lista estática — nunca derruba o sitemap.
 *
 * `lastModified` é incluído somente quando existe um campo confiável de
 * modificação no documento (`updatedAt`). `createdAt` indica criação e não é
 * usado, pois edições posteriores do jogo não o atualizam.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://senaigamehub.vercel.app";

/** Rotas públicas estáticas (a string vazia representa a home). */
const STATIC_PATHS = ["", "/about", "/games", "/stats"];

/**
 * Converte um valor de timestamp (string ISO 8601 ou Timestamp do Firestore)
 * em Date válido. Retorna `undefined` quando o valor não é confiável.
 */
function toLastModified(value: unknown): Date | undefined {
  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? undefined : new Date(ms);
  }
  if (
    value &&
    typeof value === "object" &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const date = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
}

/** Impede que uma falha de rede no Firestore trave a geração do sitemap. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Firestore query timed out after ${ms}ms`)),
      ms
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const db = getAdminDb();
    const snap = await withTimeout(
      db.collection("games").where("approved", "==", true).get(),
      5_000
    );

    for (const doc of snap.docs) {
      const entry: MetadataRoute.Sitemap[number] = {
        url: `${SITE_URL}/games/${doc.id}`,
      };
      const updatedAt = toLastModified(doc.data()?.updatedAt);
      if (updatedAt) {
        entry.lastModified = updatedAt;
      }
      entries.push(entry);
    }
  } catch (error) {
    console.error(
      "[sitemap] Não foi possível incluir jogos aprovados do Firebase; mantendo apenas a lista estática.",
      error
    );
  }

  return entries;
}
