/**
 * Utilitário para gerenciar identificação local do usuário
 * Gera e persiste um ID único para cada navegador/dispositivo
 */

const USER_ID_KEY = "activity_user_id";
const USER_NAME_KEY = "activity_user_name";

/**
 * Gera um ID único para o usuário ou retorna o existente
 */
export function getLocalUserId(): string {
  if (typeof window === "undefined") return "anonymous";

  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    // Gerar ID único simples baseado em timestamp e random
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

/**
 * Define o nome do usuário localmente
 */
export function setLocalUserName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_NAME_KEY, name);
}

/**
 * Obtém o nome do usuário ou retorna um padrão
 */
export function getLocalUserName(): string {
  if (typeof window === "undefined") return "Participante";
  return localStorage.getItem(USER_NAME_KEY) || `Participante #${getLocalUserId().slice(-6)}`;
}

/**
 * Reseta o ID do usuário (útil para testes)
 */
export function resetLocalUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
}

