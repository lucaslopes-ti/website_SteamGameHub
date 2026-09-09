/**
 * Testes do hook useSqlProgress — persistência apenas para UID autenticado.
 *
 * Cobre a regra de progresso:
 * - visitante anônimo: estado vazio e `complete()` NÃO chama a API (não há
 *   persistência em localStorage anônimo);
 * - usuário autenticado: carrega o progresso do servidor (GET) com ids
 *   SEMÂNTICOS e deriva XP corretamente;
 * - `complete()` envia PUT com ids semânticos e aplica a resposta autoritativa;
 * - respostas legadas/posicionais são aceitas e migradas para ids semânticos;
 * - resposta de outro UID é ignorada (defesa contra contaminação entre contas).
 *
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useSqlProgress } from "@/components/sql-quest/useSqlProgress";
import { getLessonById } from "@/lib/sql-quest/catalog";

const mockUseAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockAuthedFetch = jest.fn();
jest.mock("@/lib/client-auth", () => ({
  authedFetch: (...args: unknown[]) => mockAuthedFetch(...args),
}));

// Resolve XP por id semântico OU posicional/legado (ex.: "1-1" → select-01).
const xpOf = (id: string) => getLessonById(id)?.xpReward ?? 0;

function Harness({ chapter, lesson }: { chapter: number; lesson: number }) {
  const { loaded, completedCount, totalXP, isCompleted, isUnlocked, complete } =
    useSqlProgress();
  return (
    <div>
      <span data-testid="loaded">{String(loaded)}</span>
      <span data-testid="count">{completedCount}</span>
      <span data-testid="xp">{totalXP}</span>
      <span data-testid="completed">{String(isCompleted(chapter, lesson))}</span>
      <span data-testid="unlocked">{String(isUnlocked(chapter, lesson))}</span>
      <button type="button" onClick={() => complete(chapter, lesson)}>
        completar
      </button>
    </div>
  );
}

describe("useSqlProgress — persistência por UID autenticado", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
    mockAuthedFetch.mockReset();
  });

  it("visitante anônimo: estado vazio e complete() não chama a API", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
    render(<Harness chapter={1} lesson={1} />);

    expect(screen.getByTestId("loaded").textContent).toBe("true");
    expect(screen.getByTestId("count").textContent).toBe("0");

    await userEvent.click(screen.getByRole("button", { name: "completar" }));

    expect(mockAuthedFetch).not.toHaveBeenCalled();
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("autenticado: carrega progresso semântico do servidor e deriva XP", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "u-1" },
      isAuthenticated: true,
      loading: false,
    });
    mockAuthedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ uid: "u-1", completedLessonIds: ["select-01"] }),
    });

    render(<Harness chapter={1} lesson={1} />);

    await waitFor(() =>
      expect(screen.getByTestId("loaded").textContent).toBe("true")
    );
    expect(mockAuthedFetch).toHaveBeenCalledWith("/api/sql-quest/progress");
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("completed").textContent).toBe("true");
    // XP derivado do catálogo a partir do id semântico.
    expect(screen.getByTestId("xp").textContent).toBe(String(xpOf("select-01")));
  });

  it("aceita resposta legada/posicional e migra para ids semânticos", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "u-1" },
      isAuthenticated: true,
      loading: false,
    });
    mockAuthedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ uid: "u-1", completedLessonIds: ["1-1"] }),
    });

    render(<Harness chapter={1} lesson={1} />);

    await waitFor(() =>
      expect(screen.getByTestId("loaded").textContent).toBe("true")
    );
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("completed").textContent).toBe("true");
    // XP correto mesmo com resposta posicional (resolvido para select-01).
    expect(screen.getByTestId("xp").textContent).toBe(String(xpOf("select-01")));
  });

  it("complete() envia PUT com id semântico e aplica a resposta autoritativa", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "u-1" },
      isAuthenticated: true,
      loading: false,
    });
    mockAuthedFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uid: "u-1", completedLessonIds: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uid: "u-1", completedLessonIds: ["select-01"] }),
      });

    render(<Harness chapter={1} lesson={1} />);
    await waitFor(() =>
      expect(screen.getByTestId("loaded").textContent).toBe("true")
    );

    await userEvent.click(screen.getByRole("button", { name: "completar" }));

    await waitFor(() =>
      expect(screen.getByTestId("count").textContent).toBe("1")
    );
    expect(mockAuthedFetch).toHaveBeenLastCalledWith(
      "/api/sql-quest/progress",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ completedLessonIds: ["select-01"] }),
      })
    );
    expect(screen.getByTestId("completed").textContent).toBe("true");
    expect(screen.getByTestId("xp").textContent).toBe(String(xpOf("select-01")));
  });

  it("ignora resposta de outro UID (defesa contra contaminação entre contas)", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "u-1" },
      isAuthenticated: true,
      loading: false,
    });
    mockAuthedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ uid: "u-2", completedLessonIds: ["select-01"] }),
    });

    render(<Harness chapter={1} lesson={1} />);

    await waitFor(() =>
      expect(screen.getByTestId("loaded").textContent).toBe("true")
    );
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("xp").textContent).toBe("0");
  });
});