import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";

// ==========================================
// TYPES
// ==========================================

export interface SAEPQuestion {
  id: string;
  question: string;
  options: string[];       // 4 alternativas
  correctAnswer: number;   // Índice 0-3
  subject: string;         // Matéria/Área
  difficulty: "easy" | "medium" | "hard";
  createdAt?: Timestamp;
}

export interface SAEPAttemptAnswer {
  questionId: string;
  selected: number;
  correct: number;
  isCorrect: boolean;
}

export interface SAEPAttempt {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: SAEPAttemptAnswer[];
  completedAt: Timestamp;
}

export interface RankingEntry {
  userId: string;
  userName: string;
  userEmail: string;
  totalScore: number;         // Soma de acertos de TODAS as tentativas
  totalAttempts: number;      // Quantas vezes fez o simulado
  totalQuestionsAnswered: number; // Total de questões respondidas
  averagePercentage: number;  // Média de acerto
  lastAttemptAt: Timestamp;
}

// ==========================================
// QUESTÕES
// ==========================================

/**
 * Busca todas as questões do banco SAEP.
 */
export async function getQuestions(): Promise<SAEPQuestion[]> {
  const db = getFirebaseDb();
  const snapshot = await getDocs(collection(db, "saep_questions"));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as SAEPQuestion[];
}

/**
 * Embaralha um array usando Fisher-Yates e retorna `count` itens.
 * Exportada para ser testável.
 */
export function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/**
 * Calcula a pontuação a partir das respostas do aluno.
 * Exportada para ser testável.
 */
export function calculateScore(answers: SAEPAttemptAnswer[]): number {
  return answers.filter((a) => a.isCorrect).length;
}

/**
 * Adiciona uma nova questão ao banco.
 */
export async function addQuestion(
  questionData: Omit<SAEPQuestion, "id" | "createdAt">
): Promise<string> {
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, "saep_questions"), {
    ...questionData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Atualiza uma questão existente.
 */
export async function updateQuestion(
  questionId: string,
  data: Partial<Omit<SAEPQuestion, "id">>
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, "saep_questions", questionId), data);
}

/**
 * Remove uma questão do banco.
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, "saep_questions", questionId));
}

// ==========================================
// TENTATIVAS (ATTEMPTS)
// ==========================================

/**
 * Salva uma tentativa do simulado.
 * O ranking é somatório — cada tentativa acumula pontos.
 */
export async function saveAttempt(
  userId: string,
  userName: string,
  userEmail: string,
  score: number,
  totalQuestions: number,
  answers: SAEPAttemptAnswer[]
): Promise<void> {
  const db = getFirebaseDb();
  const attempt: Omit<SAEPAttempt, "id"> = {
    userId,
    userName,
    userEmail,
    score,
    totalQuestions,
    percentage: totalQuestions > 0 ? (score / totalQuestions) * 100 : 0,
    answers,
    completedAt: Timestamp.now(),
  };
  await addDoc(collection(db, "saep_attempts"), attempt);
}

/**
 * Retorna o ranking somatório.
 * Agrupa todas as tentativas por userId, soma os acertos e conta tentativas.
 */
export async function getRanking(): Promise<RankingEntry[]> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, "saep_attempts"),
    orderBy("completedAt", "desc")
  );
  const snapshot = await getDocs(q);

  const userMap = new Map<string, RankingEntry>();

  for (const d of snapshot.docs) {
    const data = d.data() as SAEPAttempt;
    const existing = userMap.get(data.userId);

    if (existing) {
      existing.totalScore += data.score;
      existing.totalAttempts += 1;
      existing.totalQuestionsAnswered += data.totalQuestions;
      // Recalcular média
      existing.averagePercentage =
        existing.totalQuestionsAnswered > 0
          ? (existing.totalScore / existing.totalQuestionsAnswered) * 100
          : 0;
      // Manter a tentativa mais recente
      if (
        data.completedAt &&
        (!existing.lastAttemptAt ||
          data.completedAt.toMillis() > existing.lastAttemptAt.toMillis())
      ) {
        existing.lastAttemptAt = data.completedAt;
      }
    } else {
      userMap.set(data.userId, {
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        totalScore: data.score,
        totalAttempts: 1,
        totalQuestionsAnswered: data.totalQuestions,
        averagePercentage:
          data.totalQuestions > 0
            ? (data.score / data.totalQuestions) * 100
            : 0,
        lastAttemptAt: data.completedAt,
      });
    }
  }

  // Ordenar pelo total de pontos acumulados (desc), desempate por média
  return Array.from(userMap.values()).sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.averagePercentage - a.averagePercentage;
  });
}

/**
 * Retorna todas as tentativas de um usuário específico.
 */
export async function getUserAttempts(userId: string): Promise<SAEPAttempt[]> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, "saep_attempts"),
    orderBy("completedAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }) as SAEPAttempt)
    .filter((a) => a.userId === userId);
}
