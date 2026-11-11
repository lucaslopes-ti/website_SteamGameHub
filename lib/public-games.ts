/**
 * Leitura de jogos PÚBLICOS no servidor (Server Components / SEO).
 *
 * Usado para renderizar no HTML inicial o conteúdo que o Google precisa ver
 * (título, descrição, links para /games/:id) sem depender de JavaScript no
 * navegador. Apenas jogos aprovados são retornados, e campos pessoais
 * (e-mail e UID do autor) nunca saem daqui, já que o resultado vai parar no
 * HTML público e indexável.
 *
 * Qualquer falha (Firebase indisponível, variável ausente em build local)
 * degrada para "sem dados": as páginas continuam funcionando e o cliente
 * busca os dados pela API como antes.
 */
import { unstable_cache } from "next/cache";
import { Game, mockGames } from "@/lib/games";

const QUERY_TIMEOUT_MS = 5_000;

/** Resultado da busca de um jogo para a página de detalhe. */
export type PublicGameLookup =
  | { status: "public"; game: Game }
  | { status: "hidden" } // existe, mas está pendente (só autor/staff veem)
  | { status: "missing" } // não existe
  | { status: "unknown" }; // falha ao consultar: não dá para afirmar nada

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

function useMockData(): boolean {
  return (
    !process.env.FIREBASE_SERVICE_ACCOUNT_KEY &&
    process.env.NODE_ENV !== "production"
  );
}

/** Remove dados pessoais antes de o jogo ir para o HTML público. */
function toPublicGame(id: string, data: Record<string, unknown>): Game {
  const { authorEmail: _email, authorUid: _uid, ...rest } = data;
  const out: Record<string, unknown> = { id };
  for (const [key, value] of Object.entries(rest)) {
    if (value && typeof value === "object" && "toDate" in value) {
      out[key] = (value as { toDate: () => Date }).toDate().toISOString();
    } else {
      out[key] = value;
    }
  }
  return { authorEmail: "", ...out } as unknown as Game;
}

async function fetchApprovedGames(): Promise<Game[]> {
  if (useMockData()) {
    return mockGames
      .filter((g) => g.approved)
      .map((g) => toPublicGame(g.id, { ...g }));
  }
  const { getAdminDb } = await import("@/lib/firebase/admin");
  const snap = await withTimeout(
    getAdminDb().collection("games").where("approved", "==", true).get(),
    QUERY_TIMEOUT_MS
  );
  return snap.docs.map((d) => toPublicGame(d.id, d.data()));
}

async function fetchPublicGame(id: string): Promise<PublicGameLookup> {
  if (useMockData()) {
    const game = mockGames.find((g) => g.id === id);
    if (!game) return { status: "missing" };
    return game.approved
      ? { status: "public", game: toPublicGame(game.id, { ...game }) }
      : { status: "hidden" };
  }
  const { getAdminDb } = await import("@/lib/firebase/admin");
  const snap = await withTimeout(
    getAdminDb().collection("games").doc(id).get(),
    QUERY_TIMEOUT_MS
  );
  if (!snap.exists) return { status: "missing" };
  const data = snap.data() as Record<string, unknown>;
  if (data.approved !== true) return { status: "hidden" };
  return { status: "public", game: toPublicGame(snap.id, data) };
}

// Cache de 5 minutos entre requisições. Falhas lançam exceção dentro do cache
// (e por isso não ficam guardadas) e só são convertidas em "sem dados" fora.
const cachedApprovedGames = unstable_cache(
  fetchApprovedGames,
  ["public-approved-games"],
  { revalidate: 300 }
);
const cachedPublicGame = unstable_cache(fetchPublicGame, ["public-game"], {
  revalidate: 300,
});

/** Jogos aprovados (lista vazia se o Firebase falhar). */
export async function getApprovedGames(): Promise<Game[]> {
  try {
    return await cachedApprovedGames();
  } catch (error) {
    console.error("[public-games] Falha ao listar jogos aprovados:", error);
    return [];
  }
}

/** Um jogo para a página /games/:id. */
export async function getPublicGame(id: string): Promise<PublicGameLookup> {
  try {
    return await cachedPublicGame(id);
  } catch (error) {
    console.error(`[public-games] Falha ao buscar o jogo ${id}:`, error);
    return { status: "unknown" };
  }
}

/** URL base absoluta do site (sem barra final). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://senaigamehub.vercel.app"
).replace(/\/+$/, "");

/** Resume um texto para meta description (até ~160 caracteres). */
export function toMetaDescription(text: string | undefined, fallback: string): string {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  if (clean.length <= 160) return clean;
  const cut = clean.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
