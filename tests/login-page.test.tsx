/**
 * Teste de fluxo da página de login: após autenticar, o usuário deve ser
 * levado ao caminho interno informado em `?redirect` (ex.: SQL Quest) em vez
 * de sempre ir para /materiais. Redirects externos caem no fallback.
 *
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/app/login/page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("@/components/I18nProvider", () => ({
  useI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "login.title": "Entrar",
        "login.subtitle": "Acesso restrito",
        "login.formAria": "Formulário de login",
        "login.invalidCredentials": "E-mail ou senha incorretos",
        "login.error": "Erro ao fazer login",
        "login.email": "E-mail *",
        "login.emailPlaceholder": "digite o email",
        "login.emailDescription": "Digite seu e-mail",
        "login.passcode": "Código de acesso *",
        "login.passcodeDescription": "Digite seu código de acesso",
        "login.submittingAria": "Fazendo login, aguarde",
        "login.submitAria": "Fazer login no sistema",
        "login.submitting": "Entrando...",
        "login.submit": "Entrar",
      };
      return map[key] ?? key;
    },
  }),
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

describe("LoginPage — fluxo de redirect", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockUseAuth.mockReset();
    mockUseAuth.mockReturnValue({
      login: jest.fn().mockResolvedValue(true),
      loginWithGoogle: jest.fn().mockResolvedValue(true),
    });
  });

  const fillAndSubmit = () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("E-mail *"), {
      target: { value: "aluno@senai.br" },
    });
    fireEvent.change(screen.getByLabelText("Código de acesso *"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Fazer login no sistema" }));
  };

  it("redireciona para o caminho interno de ?redirect após login", async () => {
    window.history.replaceState({}, "", "/login?redirect=%2Fsql-quest%2Flearn");
    fillAndSubmit();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/sql-quest/learn"));
  });

  it("cai no fallback /materiais quando redirect é externo", async () => {
    window.history.replaceState({}, "", "/login?redirect=https%3A%2F%2Fevil.com");
    fillAndSubmit();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/materiais"));
  });

  it("cai no fallback /materiais quando não há redirect", async () => {
    window.history.replaceState({}, "", "/login");
    fillAndSubmit();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/materiais"));
  });
});