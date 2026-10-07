/**
 * Teste de render da landing (`LandingClient`).
 *
 * Prova que os cards de capítulos independentes (12 redes e 13 cabeamento)
 * ficam acessíveis mesmo sem nenhum progresso, enquanto os capítulos da trilha
 * principal (2–11) seguem bloqueados.
 *
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LandingClient from "@/components/sql-quest/LandingClient";

const mockUseAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockAuthedFetch = jest.fn();
jest.mock("@/lib/client-auth", () => ({
  authedFetch: (...args: unknown[]) => mockAuthedFetch(...args),
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

beforeEach(() => {
  mockUseAuth.mockReset();
  mockAuthedFetch.mockReset();
  mockUseAuth.mockReturnValue({
    user: { id: "u-1" },
    isAuthenticated: true,
    loading: false,
  });
  mockAuthedFetch.mockImplementation(async (url: string) => {
    if (url === "/api/sql-quest/progress") {
      return {
        ok: true,
        json: async () => ({ uid: "u-1", completedLessonIds: [] }),
      };
    }
    if (url === "/api/sql-quest/profile") {
      return {
        ok: true,
        json: async () => ({
          classId: null,
          className: null,
          rankingOptIn: false,
          rank: null,
        }),
      };
    }
    return { ok: true, json: async () => ({}) };
  });
});

describe("LandingClient — cards de capítulos independentes", () => {
  it("libera os links de 12 e 13 e mantém 2–11 bloqueados sem progresso", async () => {
    const { container } = render(<LandingClient />);

    // Aguarda progresso e ranking carregarem (evita atualizações fora do act).
    await waitFor(() =>
      expect(
        screen.getByText("Você ainda não está em uma turma")
      ).toBeInTheDocument()
    );

    for (const number of [1, 12, 13]) {
      const link = container.querySelector(
        `a[href="/sql-quest/learn/${number}"]`
      );
      expect(link).not.toBeNull();
      expect(link).not.toHaveAttribute("aria-disabled", "true");
    }

    for (const number of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
      expect(
        container.querySelector(`a[href="/sql-quest/learn/${number}"]`)
      ).toBeNull();
    }

    expect(screen.getAllByText("Explorar capítulo").length).toBe(3);
    expect(screen.getAllByText("Complete o anterior").length).toBe(10);
  });
});
