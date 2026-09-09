import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, requireAuth } from "@/lib/server-auth";
import { getDbOrUnavailable } from "@/lib/sql-quest/server/firebase";
import { getLessonById } from "@/lib/sql-quest/catalog";
import {
  PROGRESS_COLLECTION,
  applyCompletion,
  parseProgressDoc,
  ProgressValidationError,
} from "@/lib/sql-quest/server/progress";
import { levelInfo } from "@/lib/sql-quest/domain/levels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Persistência de progresso da SQL Quest.
 *
 * - GET e PUT exigem Bearer token (Firebase ID token).
 * - Armazena UM documento por usuário em `sql_quest_progress/{uid}` com
 *   `{ completedLessonIds, totalXp, updatedAt, streak, lastActivityDate,
 *     achievements, displayName }`.
 * - O userId é SEMPRE derivado do token — nunca é aceito no corpo da requisição.
 * - O PUT aceita APENAS o payload explícito `{ completedLessonIds: string[] }`
 *   (a lista completa de ids que o cliente acredita ter concluído).
 * - IDs: a API opera e responde com ids SEMÂNTICOS do catálogo (ex.:
 *   "select-01"). Ids legados/posicionais ("1-1") são aceitos na entrada e
 *   migrados para o formato canônico no servidor — progresso legado nunca é
 *   zerado.
 * - O XP é calculado EXCLUSIVAMENTE a partir do catálogo no servidor; o valor
 *   enviado pelo cliente é ignorado. Conclusão repetida é idempotente (não
 *   acumula XP nem streak).
 * - As conclusões são validadas como uma PROGRESSÃO LINEAR ESTRITA (no máximo
 *   UMA nova lição por requisição — sempre a próxima na ordem do catálogo).
 * - O streak diário é computado em America/Sao_Paulo e as conquistas são
 *   avaliadas no servidor a partir do estado (lições/XP/streak).
 * - IMPORTANTE (integridade honesta): o SQL roda client-side (sql.js/WASM no
 *   navegador). Esta validação impõe ordem e reduz a adulteração de XP, mas não
 *   consegue provar no servidor que a query foi efetivamente digitada.
 * - Se o Firebase não estiver configurado, responde 503 com mensagem clara
 *   (antes mesmo de tentar autenticar).
 */

function serializeProgress(
  uid: string,
  progress: ReturnType<typeof parseProgressDoc>,
  extra?: Record<string, unknown>
) {
  const info = levelInfo(progress.totalXp);
  return {
    // O UID é SEMPRE derivado do token — nunca do corpo da requisição.
    uid,
    completedLessonIds: progress.completedLessonIds,
    completedLessons: progress.completedLessonIds,
    totalXp: progress.totalXp,
    totalXP: progress.totalXp,
    lessonCount: progress.completedLessonIds.length,
    level: info.level,
    streak: progress.streak,
    lastActivityDate: progress.lastActivityDate,
    achievements: progress.achievements,
    classId: progress.classId,
    rankingOptIn: progress.rankingOptIn,
    updatedAt: progress.updatedAt,
    ...extra,
  };
}

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const authError = requireAuth(user);
  if (authError) return authError;

  const { db, response } = await getDbOrUnavailable();
  if (response) return response;

  try {
    const ref = db!.collection(PROGRESS_COLLECTION).doc(user!.uid);
    const snap = await ref.get();
    const progress = parseProgressDoc(
      user!.uid,
      snap.exists ? (snap.data() ?? {}) : {}
    );
    return NextResponse.json(serializeProgress(user!.uid, progress));
  } catch (error) {
    console.error("[sql-quest] Erro ao ler progresso:", error);
    return NextResponse.json({ error: "Erro ao ler o progresso." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const ref = db!.collection(PROGRESS_COLLECTION).doc(user!.uid);
    let result!: Awaited<ReturnType<typeof applyCompletion>>;

    await db!.runTransaction(async (tx) => {
      result = await applyCompletion(tx, ref, incomingIds, new Date(), user!.name);
    });

    const progress = parseProgressDoc(user!.uid, {
      completedLessonIds: result.completedLessonIds,
      totalXp: result.totalXp,
      updatedAt: result.updatedAt,
      streak: result.streak,
      lastActivityDate: result.lastActivityDate,
      achievements: result.achievements,
    });

    return NextResponse.json(
      serializeProgress(user!.uid, progress, {
        isNewCompletion: result.isNewCompletion,
        xpEarned: result.xpEarned,
        newAchievements: result.newAchievements,
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