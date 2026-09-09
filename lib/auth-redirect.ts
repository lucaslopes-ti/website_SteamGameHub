/**
 * Normalização do parâmetro `?redirect=` usado pelo fluxo de autenticação
 * (login/cadastro).
 *
 * Regras de segurança contra open redirect:
 * - aceita somente caminhos internos que começam com `/`;
 * - rejeita `//` (protocol-relative), esquemas (`https:`, `javascript:`, ...),
 *   backslashes e caracteres de controle;
 * - qualquer valor inválido/ausente cai no fallback padrão.
 */

export const DEFAULT_AUTH_REDIRECT = "/materiais";

export function sanitizeRedirectPath(
  value: string | null | undefined
): string {
  if (!value) return DEFAULT_AUTH_REDIRECT;
  if (!value.startsWith("/")) return DEFAULT_AUTH_REDIRECT;
  if (value.startsWith("//")) return DEFAULT_AUTH_REDIRECT;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return DEFAULT_AUTH_REDIRECT;
  if (/[\\\x00-\x1f]/.test(value)) return DEFAULT_AUTH_REDIRECT;
  return value;
}

export function getAuthRedirectFromSearch(search: string): string {
  const raw = new URLSearchParams(search).get("redirect");
  return sanitizeRedirectPath(raw);
}