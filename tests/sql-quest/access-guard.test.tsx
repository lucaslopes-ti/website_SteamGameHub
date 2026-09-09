/**
 * Testes do guard de acesso da SQL Quest.
 *
 * Cobre a regra de acesso (função pura) e o comportamento do componente:
 * - sessão resolvendo → tela de carregamento;
 * - não autenticado → tela de login com links para /login e /cadastro;
 * - autenticado → renderiza o conteúdo.
 *
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SqlQuestGuard, {
  resolveSqlQuestAccess,
} from "@/components/sql-quest/SqlQuestGuard";

const mockUseAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/sql-quest/learn",
}));

jest.mock("next/link", () => {
  // eslint-disable-next-line react/display-name
  return ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe("resolveSqlQuestAccess — regra de acesso", () => {
  it("retorna 'loading' enquanto a sessão está sendo resolvida", () => {
    expect(
      resolveSqlQuestAccess({ loading: true, isAuthenticated: false })
    ).toBe("loading");
    expect(
      resolveSqlQuestAccess({ loading: true, isAuthenticated: true })
    ).toBe("loading");
  });

  it("retorna 'login' para visitante não autenticado", () => {
    expect(
      resolveSqlQuestAccess({ loading: false, isAuthenticated: false })
    ).toBe("login");
  });

  it("retorna 'content' para usuário autenticado", () => {
    expect(
      resolveSqlQuestAccess({ loading: false, isAuthenticated: true })
    ).toBe("content");
  });
});

describe("SqlQuestGuard", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("mostra carregamento enquanto a sessão resolve", () => {
    mockUseAuth.mockReturnValue({ loading: true, isAuthenticated: false });
    render(
      <SqlQuestGuard>
        <div>conteúdo protegido</div>
      </SqlQuestGuard>
    );
    expect(screen.getByText("Verificando sua sessão...")).toBeInTheDocument();
    expect(screen.queryByText("conteúdo protegido")).not.toBeInTheDocument();
  });

  it("bloqueia visitante não autenticado com tela de login", () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: false });
    render(
      <SqlQuestGuard>
        <div>conteúdo protegido</div>
      </SqlQuestGuard>
    );
    expect(screen.getByText("Acesso restrito")).toBeInTheDocument();
    expect(screen.queryByText("conteúdo protegido")).not.toBeInTheDocument();
  });

  it("links de login/cadastro preservam o caminho atual via redirect", () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: false });
    render(
      <SqlQuestGuard>
        <div>conteúdo protegido</div>
      </SqlQuestGuard>
    );
    const loginLink = screen.getByRole("link", { name: /entrar/i });
    const registerLink = screen.getByRole("link", { name: /criar conta/i });
    expect(loginLink).toHaveAttribute(
      "href",
      "/login?redirect=%2Fsql-quest%2Flearn"
    );
    expect(registerLink).toHaveAttribute(
      "href",
      "/cadastro?redirect=%2Fsql-quest%2Flearn"
    );
  });

  it("libera o conteúdo para usuário autenticado", () => {
    mockUseAuth.mockReturnValue({ loading: false, isAuthenticated: true });
    render(
      <SqlQuestGuard>
        <div>conteúdo protegido</div>
      </SqlQuestGuard>
    );
    expect(screen.getByText("conteúdo protegido")).toBeInTheDocument();
    expect(screen.queryByText("Acesso restrito")).not.toBeInTheDocument();
  });
});