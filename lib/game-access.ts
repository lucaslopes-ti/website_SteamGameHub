/**
 * Acesso/visibilidade de jogos no servidor.
 *
 * Regra central: jogos aprovados são públicos; jogos pendentes só são
 * visíveis para o autor (por UID, ou por e-mail exato quando verificado) e
 * para staff. Jogos inexistentes ou sem acesso NUNCA são revelados.
 */
import { Firestore } from "firebase-admin/firestore";
import { AuthUser } from "@/lib/server-auth";

export interface GameDoc {
  id: string;
  data: Record<string, unknown>;
}

export async function getGameDoc(
  db: Firestore,
  gameId: string
): Promise<GameDoc | null> {
  const snap = await db.collection("games").doc(gameId).get();
  if (!snap.exists) return null;
  return { id: snap.id, data: snap.data() as Record<string, unknown> };
}

/**
 * Verifica se o ator pode acessar o jogo (aprovado = público; pendente =
 * autor/staff).
 */
export function canAccessGame(
  data: Record<string, unknown>,
  user: AuthUser | null
): boolean {
  if (data.approved === true) return true;
  if (!user) return false;
  if (user.isStaff) return true;
  if (data.authorUid && data.authorUid === user.uid) return true;
  if (
    user.emailVerified &&
    data.authorEmail &&
    data.authorEmail === user.email
  ) {
    return true;
  }
  return false;
}

export interface LoadedGame {
  exists: boolean;
  visible: boolean;
  data: Record<string, unknown> | null;
}

/**
 * Carrega o jogo e aplica a visibilidade. `exists=false` para documentos
 * inexistentes; `visible=false` para pendentes sem acesso do ator.
 */
export async function loadVisibleGame(
  db: Firestore,
  gameId: string,
  user: AuthUser | null
): Promise<LoadedGame> {
  const doc = await getGameDoc(db, gameId);
  if (!doc) return { exists: false, visible: false, data: null };
  return { exists: true, visible: canAccessGame(doc.data, user), data: doc.data };
}