import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { lessons, getLessonById } from "@/lib/sql-quest/catalog";
import { computeTotalXp, validateCompletions } from "@/lib/sql-quest/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Persistência de progresso da SQL Quest.
 *
 * - GET e PUT exigem Bearer token (Firebase ID token).
 * - Armazena UM documento por usuário em `sql_quest_progress/{uid}` com
 *   `{ completedLessonIds, totalXp, updatedAt }`.
 * - O userId é SEMPRE derivado do token — nunca é aceito no corpo da requisição.
 * - O PUT aceita APENAS o payload explícito `{ completedLessonIds: string[] }`
 *   (a lista completa de ids que o cliente acredita ter concluído).
 * - O XP é calculado EXCLUSIVAMENTE a partir do catálogo no servidor; o valor
 *   enviado pelo cliente é ignorado. Conclusão repetida é idempotente (não
 *   acumula XP).
 * - As conclusões são validadas como uma PROGRESSÃO LINEAR ESTRITA:
 *   - não são aceitas remoções de conclusões existentes;
 *   - não são aceitos saltos nem lições fora da próxima disponível (o conjunto
 *     final precisa ser um prefixo contíguo da trilha em ordem);
 *   - é permitida no máximo UMA nova lição por requisição — sempre a próxima na
 *     ordem do catálogo;
 *   - o XP é derivado apenas do conjunto final validado.
 * - IMPORTANTE (integridade honesta): o SQL roda client-side (sql.js/WASM no
 *   navegador). Esta validação impõe ordem e reduz a adulteração de XP, mas não
 *   consegue provar no servidor que a query foi efetivamente digitada.
 * - Se o Firebase não estiver configurado, responde 503 com mensagem clara
 *   (antes mesmo de tentar autenticar).
 */

const COLLECTION = "sql_quest_progress";

/** Ordem oficial da trilha (ids na ordem de conclusão). */
const orderedIds = lessons.map((l) => l.id);

/** Erro de validação de progresso que aborta a transação com 400. */
class ProgressValidationError extends Error {}

function firebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
}

function firebaseUnavailableResponse(): NextResponse {
  return NextResponse.json(
    {
      error:
        "O Firebase não está configurado neste ambiente. Configure FIREBASE_SERVICE_ACCOUNT_KEY para habilitar o salvamento de progresso.",
      code: "FIREBASE_NOT_CONFIGURED",
    },
    { status: 503 }
  );
}

/**
 * Mantém apenas ids de lições conhecidas no catálogo (server-authoritative),
 * normalizados na ordem oficial da trilha.
 */
function sanitizeLessonIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const known = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && getLessonById(item)) known.add(item);
  }
  return orderedIds.filter((id) => known.has(id));
}

/**
 * Valida o payload explícito `{ completedLessonIds: string[] }`: se algum id
 * não existir no catálogo, devolve a mensagem de erro correspondente.
 */
function parseCompletedLessonIds(
  body: unknown
): { ids: string[] } | { error: string } {
  const record = (body ?? {}) as Record<string, unknown>;
  const value = record.completedLessonIds;
  if (!Array.isArray(value)) {
    return {
      error:
        "Envie o payload explícito { completedLessonIds: string[] } no corpo da requisição.",
    };
  }
  const ids: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !getLessonById(item)) {
      return {
        error: `A lição "${String(item)}" não existe no catálogo.`,
      };
    }
    ids.push(item);
  }
  return { ids };
}

/**
 * Valida a atualização como progressão linear estrita:
 * - preserva conclusões existentes (proíbe remoção);
 * - o conjunto final precisa ser um prefixo contíguo da trilha (proíbe saltos);
 * - permite no máximo UMA nova lição por requisição — a próxima na ordem do
 *   catálogo (o cliente envia a lista completa; o servidor decide o delta).
 */
function validateProgressUpdate(
  previous: string[],
  incoming: string[]
): { ok: true; final: string[] } | { ok: false; error: string } {
  const base = validateCompletions(previous, incoming);
  if (!base.ok) return base;

  const newIds = base.final.filter((id) => !previous.includes(id));
  if (newIds.length > 1) {
    return {
      ok: false,
      error:
        "Conclua uma lição por vez: envie apenas a próxima lição da trilha nesta requisição.",
    };
  }

  return base;
}

/**
 * Resolve o Firestore Admin ou uma resposta 503 clara quando o Firebase não
 * está configurado (evita falhar 500 com erro de configuração).
 */
async function getDbOrUnavailable(): Promise<{
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

function serializeProgress(
  completedLessonIds: string[],
  updatedAt: string | null,
  extra?: Record<string, unknown>
) {
  const totalXp = computeTotalXp(completedLessonIds);
  return {
    completedLessonIds,
    completedLessons: completedLessonIds,
    totalXp,
    totalXP: totalXp,
    lessonCount: completedLessonIds.length,
    updatedAt,
    ...extra,
  };
}

export async function GET(request: NextRequest) {
  // Firebase não configurado → 503 antes mesmo de tentar autenticar.
  if (!firebaseConfigured()) return firebaseUnavailableResponse();

  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const ref = db!.collection(COLLECTION).doc(user!.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(serializeProgress([], null));
    }

    const data = snap.data() ?? {};
    const completedLessonIds = sanitizeLessonIds(data.completedLessonIds);
    const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : null;
    return NextResponse.json(serializeProgress(completedLessonIds, updatedAt));
  } catch (error) {
    console.error("[sql-quest] Erro ao ler progresso:", error);
    return NextResponse.json({ error: "Erro ao ler o progresso." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Firebase não configurado → 503 antes mesmo de tentar autenticar.
  if (!firebaseConfigured()) return firebaseUnavailableResponse();

  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  // userId NÃO é aceito no corpo: o UID vem sempre do token.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const parsed = parseCompletedLessonIds(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const incomingIds = parsed.ids;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const ref = db!.collection(COLLECTION).doc(user!.uid);
    const updatedAt = new Date().toISOString();
    let completedLessonIds: string[] = [];
    let isNewCompletion = false;
    let xpEarned = 0;

    await db!.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const existing = snap.exists ? (snap.data() ?? {}) : {};
      const previous = sanitizeLessonIds(existing.completedLessonIds);

      const validated = validateProgressUpdate(previous, incomingIds);
      if (!validated.ok) {
        throw new ProgressValidationError(validated.error);
      }

      const merged = validated.final;
      isNewCompletion = merged.length > previous.length;
      xpEarned = merged
        .slice(previous.length)
        .reduce((acc, id) => acc + (getLessonById(id)?.xpReward ?? 0), 0);
      completedLessonIds = merged;

      tx.set(
        ref,
        {
          completedLessonIds,
          totalXp: computeTotalXp(completedLessonIds),
          updatedAt,
        },
        { merge: true }
      );
    });

    return NextResponse.json(
      serializeProgress(completedLessonIds, updatedAt, {
        isNewCompletion,
        xpEarned,
      })
    );
  } catch (error) {
    if (error instanceof ProgressValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[sql-quest] Erro ao salvar progresso:", error);
    return NextResponse.json({ error: "Erro ao salvar o progresso." }, { status: 500 });
  }
}