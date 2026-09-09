/**
 * Testes do hook useSqlProgress — persistência apenas para UID autenticado.
 *
 * Cobre a regra de progresso:
 * - visitante anônimo: estado vazio e `complete()` NÃO chama a API (não há
 *   persistência em localStorage anônimo);
 * - usuário autenticado: carrega o progresso do servidor (GET);
 * - `complete()` envia PUT e aplica a resposta autoritativa do servidor;
 * - resposta de outro UID é ignorada (defesa contra contaminação entre contas).
 *
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useSqlProgress } from "@/components/sql-quest/useSqlProgress";
import { lessons } from "@/lib/sql-quest/catalog";

const mockUseAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockAuthedFetch = jest.fn();
jest.mock("@/lib/client-auth", () => ({
  authedFetch: (...args: unknown[]) => mockAuthedFetch(...args),
}));

const xpOf = (id: string) => lessons.find((l) => l.id === id)?.xpReward ?? 0;

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

  it("autenticado: carrega o progresso do servidor (GET)", async () => {
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
    expect(mockAuthedFetch).toHaveBeenCalledWith("/api/sql-quest/progress");
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("xp").textContent).toBe(String(xpOf("1-1")));
    expect(screen.getByTestId("completed").textContent).toBe("true");
  });

  it("complete() envia PUT e aplica a resposta autoritativa", async () => {
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
        json: async () => ({ uid: "u-1", completedLessonIds: ["1-1"] }),
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
        body: JSON.stringify({ completedLessonIds: ["1-1"] }),
      })
    );
    expect(screen.getByTestId("xp").textContent).toBe(String(xpOf("1-1")));
  });

  it("ignora resposta de outro UID (defesa contra contaminação entre contas)", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: "u-1" },
      isAuthenticated: true,
      loading: false,
    });
    mockAuthedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ uid: "u-2", completedLessonIds: ["1-1"] }),
    });

    render(<Harness chapter={1} lesson={1} />);

    await waitFor(() =>
      expect(screen.getByTestId("loaded").textContent).toBe("true")
    );
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("xp").textContent).toBe("0");
  });
});