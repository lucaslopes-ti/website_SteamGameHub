/**
 * Recompensas físicas da SQL Quest (camada server).
 *
 * Catálogo FIXO de 3 produtos (preço/estoque são constantes server-side, nunca
 * confiados no cliente), pedidos em `sql_quest_reward_requests/{uid}_{itemId}`,
 * estoque compartilhado globalmente em `sql_quest_reward_stock/{itemId}` e uma
 * marca de inventário versionada em `sql_quest_reward_inventory/current`.
 *
 * Regras:
 * - Saldo da loja = XP ganho (derivado de `completedLessonIds` via catálogo,
 *   NUNCA do `totalXp` persistido) − spentXp. `spentXp` só é debitado na
 *   APROVAÇÃO, dentro de UMA transação única.
 * - O aluno cria pedido `requested` apenas se tiver saldo atual suficiente;
 *   nada é descontado nem reservado na criação.
 * - Aprovar é idempotente; saldo/estoque insuficientes bloqueiam SEM mutar.
 * - O estoque inicial 5/1/1 é inicializado UMA única vez via marca de
 *   inventário versionada (transação create-only). Após a marca existir,
 *   qualquer doc de estoque ausente/corrompido bloqueia a compra — nunca é
 *   restaurado.
 * - Um aluno pode ter no máximo UM pedido por produto (id determinístico
 *   `{uid}_{itemId}` + create atômico).
 * - O pedido registra o `classId` canônico do progresso no momento da criação:
 *   admin vê/decide todos; instrutor apenas pedidos cujo `classId` pertence a
 *   turma que ele instrui; pedido sem turma é visível/decidível só por admin.
 * - O UID é sempre derivado do token — nunca do corpo da requisição.
 */
import type { Firestore } from "firebase-admin/firestore";
import type { AuthUser } from "@/lib/server-auth";
import { computeTotalXp } from "../progress";
import { PROGRESS_COLLECTION, sanitizeLessonIds } from "./progress";
import { CLASSES_COLLECTION, getClassById } from "./classes";
import {
  canTransition,
  computeXpBalance,
  isRewardRequestStatus,
  targetStatusFor,
  validateRequestDetails,
  type RewardAction,
  type RewardRequestStatus,
} from "../domain/rewards";

export const REWARD_REQUESTS_COLLECTION = "sql_quest_reward_requests";
export const REWARD_STOCK_COLLECTION = "sql_quest_reward_stock";
export const REWARD_INVENTORY_COLLECTION = "sql_quest_reward_inventory";
export const REWARD_INVENTORY_VERSION = 1;
export const REWARD_INVENTORY_DOC_ID = "current";

/** Produto físico da loja de recompensas (constante server-side). */
export interface RewardProduct {
  id: string;
  name: string;
  description: string;
  costXp: number;
  initialStock: number;
}

/** Catálogo fixo e versionado no servidor. */
export const REWARD_PRODUCTS: readonly RewardProduct[] = [
  {
    id: "keychain",
    name: "Chaveiro simples",
    description: "Chaveiro personalizado com o logo da SQL Quest.",
    costXp: 500,
    initialStock: 5,
  },
  {
    id: "character-piece",
    name: "Peça de personagem",
    description:
      "Peça de personagem impressa em 3D, conforme a descrição enviada no pedido.",
    costXp: 1000,
    initialStock: 1,
  },
  {
    id: "object-12cm",
    name: "Objeto personalizado de até 12 cm",
    description:
      "Objeto personalizado impresso em 3D com até 12 cm, conforme a descrição enviada no pedido.",
    costXp: 3000,
    initialStock: 1,
  },
];

export const REWARD_PRODUCT_BY_ID: ReadonlyMap<string, RewardProduct> = new Map(
  REWARD_PRODUCTS.map((product) => [product.id, product])
);

/** Pedido de recompensa persistido. */
export interface RewardRequestDoc {
  id: string;
  uid: string;
  /** Nome do aluno no momento da criação (fallback seguro "Aluno"). */
  studentName: string;
  /** `classId` canônico do progresso no momento da criação (null = sem turma). */
  classId: string | null;
  itemId: string;
  itemName: string;
  costXp: number;
  requestDetails: string;
  status: RewardRequestStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectedAt: string | null;
  rejectedBy: string | null;
  fulfilledAt: string | null;
  fulfilledBy: string | null;
}

/** Normaliza um valor bruto do Firestore em um RewardRequestDoc seguro. */
export function parseRewardRequest(
  id: string,
  data: Record<string, unknown>
): RewardRequestDoc {
  return {
    id,
    uid: typeof data.uid === "string" ? data.uid : "",
    studentName:
      typeof data.studentName === "string" && data.studentName.trim()
        ? data.studentName.trim()
        : "Aluno",
    classId:
      typeof data.classId === "string" && data.classId ? data.classId : null,
    itemId: typeof data.itemId === "string" ? data.itemId : "",
    itemName: typeof data.itemName === "string" ? data.itemName : "",
    costXp:
      typeof data.costXp === "number" && Number.isFinite(data.costXp)
        ? data.costXp
        : 0,
    requestDetails: typeof data.requestDetails === "string" ? data.requestDetails : "",
    status: isRewardRequestStatus(data.status) ? data.status : "requested",
    createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    approvedAt: typeof data.approvedAt === "string" ? data.approvedAt : null,
    approvedBy: typeof data.approvedBy === "string" ? data.approvedBy : null,
    rejectedAt: typeof data.rejectedAt === "string" ? data.rejectedAt : null,
    rejectedBy: typeof data.rejectedBy === "string" ? data.rejectedBy : null,
    fulfilledAt: typeof data.fulfilledAt === "string" ? data.fulfilledAt : null,
    fulfilledBy: typeof data.fulfilledBy === "string" ? data.fulfilledBy : null,
  };
}

/**
 * Parse ESTRITO para o caminho de decisão (staff). Falha fechado (409) em
 * documento de pedido inválido/corrompido: aluno ausente, produto ausente ou
 * desconhecido, custo corrompido ou divergente do catálogo, status
 * desconhecido. NUNCA normaliza custo inválido para 0 nem status inválido para
 * `requested` neste caminho.
 */
export function parseRewardRequestStrict(
  id: string,
  data: Record<string, unknown>
): { request: RewardRequestDoc; product: RewardProduct } {
  const uid = typeof data.uid === "string" ? data.uid : "";
  const itemId = typeof data.itemId === "string" ? data.itemId : "";
  const costXp = data.costXp;
  const status = data.status;

  if (!uid) {
    throw new RewardRequestError("Pedido inválido: aluno ausente.", 409);
  }
  if (!itemId) {
    throw new RewardRequestError("Pedido inválido: produto ausente.", 409);
  }
  if (typeof costXp !== "number" || !Number.isFinite(costXp) || costXp < 0) {
    throw new RewardRequestError("Pedido inválido: custo corrompido.", 409);
  }
  if (!isRewardRequestStatus(status)) {
    throw new RewardRequestError("Pedido inválido: status desconhecido.", 409);
  }
  const product = REWARD_PRODUCT_BY_ID.get(itemId);
  if (!product) {
    throw new RewardRequestError("Pedido inválido: produto desconhecido.", 409);
  }
  if (costXp !== product.costXp) {
    throw new RewardRequestError(
      "Pedido inválido: custo divergente do catálogo.",
      409
    );
  }
  return { request: parseRewardRequest(id, data), product };
}

/** Saldo derivado da loja para um aluno. */
export interface RewardBalance {
  earnedXp: number;
  spentXp: number;
  xpBalance: number;
}

/** Contexto do aluno para a loja (saldo derivado + turma canônica). */
export interface StudentRewardContext {
  balance: RewardBalance;
  classId: string | null;
}

/**
 * Lê o contexto do aluno: XP ganho SEMPRE derivado de `completedLessonIds`
 * via catálogo (`computeTotalXp`) — o `totalXp` persistido nunca é confiado.
 */
export async function readStudentRewardContext(
  db: Firestore,
  uid: string
): Promise<StudentRewardContext> {
  const snap = await db.collection(PROGRESS_COLLECTION).doc(uid).get();
  const data = snap.exists ? (snap.data() ?? {}) : {};
  const earnedXp = computeTotalXp(sanitizeLessonIds(data.completedLessonIds));
  const spentXp = toNonNegativeNumber(data.spentXp);
  const classId =
    typeof data.classId === "string" && data.classId ? data.classId : null;
  return {
    balance: { earnedXp, spentXp, xpBalance: computeXpBalance(earnedXp, spentXp) },
    classId,
  };
}

/** Lê o saldo derivado do documento de progresso (XP derivado − spentXp). */
export async function readRewardBalance(
  db: Firestore,
  uid: string
): Promise<RewardBalance> {
  const context = await readStudentRewardContext(db, uid);
  return context.balance;
}

/** Documento de estoque de um produto (compartilhado globalmente). */
export interface RewardStockDoc {
  itemId: string;
  initialStock: number;
  remainingStock: number;
  updatedAt: string;
}

/**
 * Normaliza um valor bruto de estoque de forma FECHADA: preserva zero
 * explicitamente e limita qualquer valor ao estoque inicial do catálogo.
 * `remainingStock` ausente/inválido/corrompido → 0 (esgotado), nunca restaura.
 */
export function parseRewardStock(
  itemId: string,
  data: Record<string, unknown>
): RewardStockDoc {
  const catalogInitial = REWARD_PRODUCT_BY_ID.get(itemId)?.initialStock ?? 0;

  const initial = data.initialStock;
  const initialStock =
    typeof initial === "number" && Number.isFinite(initial) && initial >= 0
      ? Math.min(initial, catalogInitial)
      : catalogInitial;

  const remaining = data.remainingStock;
  const remainingStock =
    typeof remaining === "number" && Number.isFinite(remaining) && remaining >= 0
      ? Math.min(remaining, catalogInitial)
      : 0;

  return {
    itemId,
    initialStock,
    remainingStock,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
  };
}

/**
 * Lê o estoque de um produto. Documento ausente → 0 (esgotado/indisponível),
 * nunca o estoque inicial: após a marca de inventário existir, um doc ausente
 * significa que foi removido/corrompido e NÃO deve ser restaurado.
 */
export async function readRewardStock(
  db: Firestore,
  itemId: string
): Promise<RewardStockDoc> {
  const snap = await db.collection(REWARD_STOCK_COLLECTION).doc(itemId).get();
  if (!snap.exists) {
    const catalogInitial = REWARD_PRODUCT_BY_ID.get(itemId)?.initialStock ?? 0;
    return { itemId, initialStock: catalogInitial, remainingStock: 0, updatedAt: "" };
  }
  return parseRewardStock(itemId, snap.data() ?? {});
}

/**
 * Inicializa o estoque inicial 5/1/1 UMA única vez, de forma create-only e
 * atômica (transação): cria a marca de inventário versionada e os 3 documentos
 * de estoque apenas se ainda não existirem. Se a marca já existir, não faz
 * nada — docs de estoque removidos/corrompidos NUNCA são restaurados.
 *
 * Ordem da transação (Firestore real exige): TODAS as leituras (marca + os 3
 * docs de estoque) acontecem ANTES de qualquer `tx.set`/write.
 */
export async function ensureRewardInventory(db: Firestore): Promise<void> {
  const markerRef = db
    .collection(REWARD_INVENTORY_COLLECTION)
    .doc(REWARD_INVENTORY_DOC_ID);

  await db.runTransaction(async (tx) => {
    const markerSnap = await tx.get(markerRef);
    if (markerSnap.exists) return;

    // 1) Leituras primeiro: marca + todos os docs de estoque.
    const stockRefs = REWARD_PRODUCTS.map((product) =>
      db.collection(REWARD_STOCK_COLLECTION).doc(product.id)
    );
    const stockSnaps = await Promise.all(stockRefs.map((ref) => tx.get(ref)));

    // 2) Só depois, as escritas (create-only: apenas docs ausentes).
    const now = new Date().toISOString();
    tx.set(
      markerRef,
      {
        version: REWARD_INVENTORY_VERSION,
        itemIds: REWARD_PRODUCTS.map((product) => product.id),
        createdAt: now,
      },
      { merge: false }
    );

    for (let i = 0; i < REWARD_PRODUCTS.length; i++) {
      if (!stockSnaps[i].exists) {
        tx.set(
          stockRefs[i],
          {
            itemId: REWARD_PRODUCTS[i].id,
            initialStock: REWARD_PRODUCTS[i].initialStock,
            remainingStock: REWARD_PRODUCTS[i].initialStock,
            updatedAt: now,
          },
          { merge: false }
        );
      }
    }
  });
}

/** Erro de negócio com status HTTP apropriado. */
export class RewardRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400
  ) {
    super(message);
    this.name = "RewardRequestError";
  }
}

/**
 * Cria um pedido `requested` para o aluno autenticado.
 *
 * - Valida produto e descrição (3–500 chars).
 * - Exige saldo atual suficiente (derivado das conclusões reais; não desconta
 *   nem reserva).
 * - Registra o `classId` canônico do progresso no pedido.
 * - Garante no máximo UM pedido por produto via id determinístico
 *   `{uid}_{itemId}` + create atômico (create-only).
 */
export async function createRewardRequest(
  db: Firestore,
  user: AuthUser,
  itemId: string,
  requestDetails: unknown
): Promise<RewardRequestDoc> {
  const product = REWARD_PRODUCT_BY_ID.get(itemId);
  if (!product) {
    throw new RewardRequestError("Produto de recompensa não encontrado.", 404);
  }

  const details = validateRequestDetails(requestDetails);
  if (!details.ok) {
    throw new RewardRequestError(details.error, 400);
  }

  const context = await readStudentRewardContext(db, user.uid);
  if (context.balance.xpBalance < product.costXp) {
    throw new RewardRequestError("Saldo de XP insuficiente para este pedido.", 409);
  }

  const now = new Date().toISOString();
  const studentName =
    typeof user.name === "string" && user.name.trim() ? user.name.trim() : "Aluno";
  const ref = db
    .collection(REWARD_REQUESTS_COLLECTION)
    .doc(`${user.uid}_${product.id}`);
  const doc: RewardRequestDoc = {
    id: ref.id,
    uid: user.uid,
    studentName,
    classId: context.classId,
    itemId: product.id,
    itemName: product.name,
    costXp: product.costXp,
    requestDetails: details.value,
    status: "requested",
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
    approvedBy: null,
    rejectedAt: null,
    rejectedBy: null,
    fulfilledAt: null,
    fulfilledBy: null,
  };

  try {
    await ref.create(doc);
  } catch (error) {
    if (isAlreadyExistsError(error)) {
      throw new RewardRequestError("Você já fez um pedido deste produto.", 409);
    }
    throw error;
  }
  return doc;
}

/** Lista os pedidos do próprio aluno (mais recentes primeiro). */
export async function listOwnRequests(
  db: Firestore,
  uid: string
): Promise<RewardRequestDoc[]> {
  const snap = await db
    .collection(REWARD_REQUESTS_COLLECTION)
    .where("uid", "==", uid)
    .get();
  return snap.docs
    .map((doc) => parseRewardRequest(doc.id, doc.data()))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Lista os pedidos visíveis ao staff:
 * - admin: todos;
 * - instrutor: apenas pedidos cujo `classId` pertence a uma turma que ele
 *   instrui (não depende de listas antigas de membros). Pedido sem turma é
 *   visível apenas para admin.
 */
export async function listStaffVisibleRequests(
  db: Firestore,
  user: AuthUser
): Promise<RewardRequestDoc[]> {
  const all = await db.collection(REWARD_REQUESTS_COLLECTION).get();
  const requests = all.docs.map((doc) => parseRewardRequest(doc.id, doc.data()));

  if (user.isAdmin) {
    return requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const classesSnap = await db
    .collection(CLASSES_COLLECTION)
    .where("instructorUids", "array-contains", user.uid)
    .get();
  const instructedClassIds = new Set(classesSnap.docs.map((doc) => doc.id));
  const visible = requests.filter(
    (request) => request.classId !== null && instructedClassIds.has(request.classId)
  );
  return visible.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * O staff pode decidir este pedido? Admin decide todos; instrutor decide
 * apenas pedidos cujo `classId` pertence a uma turma que ele instrui. Pedido
 * sem turma é decidível apenas por admin.
 */
export async function canStaffDecide(
  db: Firestore,
  user: AuthUser,
  request: RewardRequestDoc
): Promise<boolean> {
  if (user.isAdmin) return true;
  if (!request.classId) return false;
  const classDoc = await getClassById(db, request.classId);
  if (!classDoc) return false;
  return classDoc.instructorUids.includes(user.uid);
}

export interface DecideResult {
  request: RewardRequestDoc;
  /** true quando a ação repetida no estado final não mutou nada. */
  idempotent: boolean;
}

/**
 * Executa uma ação de staff (approve/reject/fulfill) em UMA transação.
 *
 * - O produto e o preço vêm SEMPRE de `REWARD_PRODUCT_BY_ID`; pedido
 *   inválido/corrompido falha fechado (409) sem estoque/débito.
 * - Aprovar: idempotente; atomiza o débito de `spentXp` e o decremento do
 *   estoque; saldo/estoque insuficientes bloqueiam SEM mutar; exige a marca de
 *   inventário e um doc de estoque válido (ausente/corrompido bloqueia).
 * - Rejeitar/fulfill: idempotentes, sem débito/estoque.
 */
export async function decideRewardRequest(
  db: Firestore,
  user: AuthUser,
  requestId: string,
  action: RewardAction
): Promise<DecideResult> {
  const ref = db.collection(REWARD_REQUESTS_COLLECTION).doc(requestId);
  let result!: DecideResult;

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      throw new RewardRequestError("Pedido não encontrado.", 404);
    }
    const { request, product } = parseRewardRequestStrict(
      requestId,
      snap.data() ?? {}
    );
    const target = targetStatusFor(action);

    // Idempotência: repetir a ação no estado final não muta nada.
    if (request.status === target) {
      result = { request, idempotent: true };
      return;
    }
    if (!canTransition(request.status, action)) {
      throw new RewardRequestError(
        `Não é possível ${action} um pedido com status "${request.status}".`,
        409
      );
    }

    const now = new Date().toISOString();

    if (action === "approve") {
      const progressRef = db.collection(PROGRESS_COLLECTION).doc(request.uid);
      const stockRef = db.collection(REWARD_STOCK_COLLECTION).doc(request.itemId);
      const markerRef = db
        .collection(REWARD_INVENTORY_COLLECTION)
        .doc(REWARD_INVENTORY_DOC_ID);
      const [progressSnap, stockSnap, markerSnap] = await Promise.all([
        tx.get(progressRef),
        tx.get(stockRef),
        tx.get(markerRef),
      ]);

      if (!markerSnap.exists) {
        throw new RewardRequestError(
          "Inventário de recompensas não inicializado.",
          409
        );
      }

      // XP ganho SEMPRE derivado das conclusões reais (nunca do totalXp).
      const progressData = progressSnap.exists ? (progressSnap.data() ?? {}) : {};
      const earnedXp = computeTotalXp(
        sanitizeLessonIds(progressData.completedLessonIds)
      );
      // Progresso legado sem o campo `spentXp` é tratado como 0; um campo
      // PRESENTE e inválido (string/NaN/negativo) bloqueia a aprovação.
      const spentXpRaw = progressData.spentXp;
      let spentXp: number;
      if (spentXpRaw === undefined) {
        spentXp = 0;
      } else if (
        typeof spentXpRaw === "number" &&
        Number.isFinite(spentXpRaw) &&
        spentXpRaw >= 0
      ) {
        spentXp = spentXpRaw;
      } else {
        throw new RewardRequestError(
          "Saldo do aluno inválido. Contate um administrador.",
          409
        );
      }
      if (earnedXp - spentXp < product.costXp) {
        throw new RewardRequestError(
          "Saldo de XP insuficiente para aprovar este pedido.",
          409
        );
      }

      const stock = resolveStockForApproval(stockSnap, request.itemId);
      if (!stock.ok) {
        throw new RewardRequestError(
          "Estoque indisponível. Contate um administrador.",
          409
        );
      }
      if (stock.remainingStock <= 0) {
        throw new RewardRequestError(
          "Estoque insuficiente para aprovar este pedido.",
          409
        );
      }

      tx.set(
        progressRef,
        { uid: request.uid, spentXp: spentXp + product.costXp, updatedAt: now },
        { merge: true }
      );
      // Nunca restaura: apenas decrementa o valor lido do doc existente.
      tx.set(
        stockRef,
        {
          itemId: request.itemId,
          initialStock: stock.initialStock,
          remainingStock: stock.remainingStock - 1,
          updatedAt: now,
        },
        { merge: false }
      );
      tx.set(
        ref,
        { status: "approved", approvedAt: now, approvedBy: user.uid, updatedAt: now },
        { merge: true }
      );

      result = {
        request: {
          ...request,
          status: "approved",
          approvedAt: now,
          approvedBy: user.uid,
          updatedAt: now,
        },
        idempotent: false,
      };
      return;
    }

    if (action === "reject") {
      tx.set(
        ref,
        { status: "rejected", rejectedAt: now, rejectedBy: user.uid, updatedAt: now },
        { merge: true }
      );
      result = {
        request: {
          ...request,
          status: "rejected",
          rejectedAt: now,
          rejectedBy: user.uid,
          updatedAt: now,
        },
        idempotent: false,
      };
      return;
    }

    // fulfill
    tx.set(
      ref,
      { status: "fulfilled", fulfilledAt: now, fulfilledBy: user.uid, updatedAt: now },
      { merge: true }
    );
    result = {
      request: {
        ...request,
        status: "fulfilled",
        fulfilledAt: now,
        fulfilledBy: user.uid,
        updatedAt: now,
      },
      idempotent: false,
    };
  });

  return result;
}

function toNonNegativeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

/**
 * Resolve o estoque para aprovação de forma FECHADA (sem permitir compra
 * indevida):
 * - documento ausente → `{ ok: false }` (após a marca existir, ausência =
 *   removido/corrompido; nunca restaura);
 * - `remainingStock` inválido/corrompido (não-número, NaN, negativo) →
 *   `{ ok: false }`;
 * - `remainingStock` válido → limitado ao estoque inicial do catálogo.
 */
function resolveStockForApproval(
  stockSnap: {
    exists: boolean;
    data: () => Record<string, unknown> | null | undefined;
  },
  itemId: string
): { ok: true; initialStock: number; remainingStock: number } | { ok: false } {
  if (!stockSnap.exists) {
    return { ok: false };
  }

  const data = stockSnap.data() ?? {};
  const remaining = data.remainingStock;
  if (typeof remaining !== "number" || !Number.isFinite(remaining) || remaining < 0) {
    return { ok: false };
  }

  const catalogInitial = REWARD_PRODUCT_BY_ID.get(itemId)?.initialStock ?? 0;
  const initial = data.initialStock;
  const initialStock =
    typeof initial === "number" && Number.isFinite(initial) && initial >= 0
      ? Math.min(initial, catalogInitial)
      : catalogInitial;

  return {
    ok: true,
    initialStock,
    remainingStock: Math.min(remaining, catalogInitial),
  };
}

function isAlreadyExistsError(error: unknown): boolean {
  const code = (error as { code?: unknown })?.code;
  return code === "already-exists" || code === 6;
}