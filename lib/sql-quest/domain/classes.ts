/**
 * Turmas da SQL Quest — códigos de acesso e autorização.
 *
 * Camada 100% serializável e pura: geração/validação de código de turma e
 * helpers de autorização (instrutor/membro). A persistência fica na camada
 * server; aqui só a lógica testável.
 */

/** Tamanho do código de acesso de uma turma. */
export const CLASS_CODE_LENGTH = 6;

/** Alfabeto sem caracteres ambíguos (sem 0/O, 1/I/L). */
export const CLASS_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Normaliza um código digitado (trim + maiúsculas). */
export function normalizeClassCode(code: string): string {
  return code.trim().toUpperCase();
}

/** Valida um código de turma (formato e alfabeto). */
export function isValidClassCode(code: string): boolean {
  const normalized = normalizeClassCode(code);
  if (normalized.length !== CLASS_CODE_LENGTH) return false;
  for (const ch of normalized) {
    if (!CLASS_CODE_ALPHABET.includes(ch)) return false;
  }
  return true;
}

function randomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n);
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < n; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

/** Gera um código de turma aleatório (6 caracteres, alfabeto seguro). */
export function generateClassCode(): string {
  const bytes = randomBytes(CLASS_CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CLASS_CODE_LENGTH; i++) {
    code += CLASS_CODE_ALPHABET[bytes[i] % CLASS_CODE_ALPHABET.length];
  }
  return code;
}

// ---------------------------------------------------------------------------
// Autorização (funções puras sobre o documento da turma)
// ---------------------------------------------------------------------------

export interface ClassActor {
  uid: string;
  isStaff: boolean;
}

export interface ClassAuthShape {
  instructorUids?: string[];
  memberUids?: string[];
}

/** O usuário é instrutor da turma (ou staff global)? */
export function isInstructorOfClass(
  user: ClassActor,
  classDoc: ClassAuthShape
): boolean {
  return user.isStaff || (classDoc.instructorUids ?? []).includes(user.uid);
}

/** O usuário é membro da turma? */
export function isMemberOfClass(
  uid: string,
  classDoc: ClassAuthShape
): boolean {
  return (classDoc.memberUids ?? []).includes(uid);
}

/** O usuário pode visualizar a turma (instrutor ou membro)? */
export function canViewClass(
  user: ClassActor,
  classDoc: ClassAuthShape
): boolean {
  return isInstructorOfClass(user, classDoc) || isMemberOfClass(user.uid, classDoc);
}