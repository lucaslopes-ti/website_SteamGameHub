/**
 * Testes de normalização do parâmetro `?redirect=` do fluxo de autenticação
 * (login/cadastro).
 *
 * Garante que apenas caminhos internos são aceitos e que valores externos,
 * protocol-relative, com esquema ou com caracteres de controle caem no
 * fallback padrão (proteção contra open redirect).
 */
import {
  DEFAULT_AUTH_REDIRECT,
  getAuthRedirectFromSearch,
  sanitizeRedirectPath,
} from "@/lib/auth-redirect";

describe("sanitizeRedirectPath", () => {
  it("mantém caminhos internos válidos", () => {
    expect(sanitizeRedirectPath("/sql-quest/learn")).toBe("/sql-quest/learn");
    expect(sanitizeRedirectPath("/materiais")).toBe("/materiais");
    expect(sanitizeRedirectPath("/sql-quest/learn/cap-1/licao-1")).toBe(
      "/sql-quest/learn/cap-1/licao-1"
    );
    expect(sanitizeRedirectPath("/simulado-saep/play")).toBe(
      "/simulado-saep/play"
    );
  });

  it("usa o fallback padrão para valores ausentes ou vazios", () => {
    expect(sanitizeRedirectPath(null)).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeRedirectPath(undefined)).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeRedirectPath("")).toBe(DEFAULT_AUTH_REDIRECT);
  });

  it("rejeita URLs externas e esquemas", () => {
    expect(sanitizeRedirectPath("https://evil.com")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeRedirectPath("http://evil.com/x")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeRedirectPath("javascript:alert(1)")).toBe(
      DEFAULT_AUTH_REDIRECT
    );
    expect(sanitizeRedirectPath("mailto:x@y.com")).toBe(DEFAULT_AUTH_REDIRECT);
  });

  it("rejeita redirects protocol-relative (//)", () => {
    expect(sanitizeRedirectPath("//evil.com")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeRedirectPath("//evil.com/path")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeRedirectPath("///evil.com")).toBe(DEFAULT_AUTH_REDIRECT);
  });

  it("rejeita backslashes e caracteres de controle", () => {
    expect(sanitizeRedirectPath("/\\evil.com")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeRedirectPath("/materiais\njavascript:alert(1)")).toBe(
      DEFAULT_AUTH_REDIRECT
    );
  });
});

describe("getAuthRedirectFromSearch", () => {
  it("extrai e normaliza o redirect da query string", () => {
    expect(getAuthRedirectFromSearch("?redirect=%2Fsql-quest%2Flearn")).toBe(
      "/sql-quest/learn"
    );
    expect(getAuthRedirectFromSearch("?redirect=/sql-quest/learn")).toBe(
      "/sql-quest/learn"
    );
  });

  it("usa o fallback quando não há redirect", () => {
    expect(getAuthRedirectFromSearch("")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(getAuthRedirectFromSearch("?foo=bar")).toBe(DEFAULT_AUTH_REDIRECT);
  });

  it("rejeita redirect externo na query string", () => {
    expect(
      getAuthRedirectFromSearch("?redirect=https%3A%2F%2Fevil.com")
    ).toBe(DEFAULT_AUTH_REDIRECT);
    expect(getAuthRedirectFromSearch("?redirect=%2F%2Fevil.com")).toBe(
      DEFAULT_AUTH_REDIRECT
    );
  });
});