/**
 * Comportamento da área de recompensas da SQL Quest (visão cliente).
 *
 * Fila de pedidos (staff) — `RequestList`:
 * - pedidos pendentes aparecem do mais antigo para o mais recente;
 * - cada pendente recebe sua posição visível na fila ("1º na fila");
 * - pedidos já decididos não recebem posição e vêm depois dos pendentes;
 * - as ações de staff (aprovar/recusar/entregar) continuam disponíveis;
 * - o rodapé mostra data e hora locais completas num elemento `<time>`.
 *
 * Formulário de pedido (aluno) — `RequestForm`:
 * - o aviso deixa claro que o XP só é debitado após a aprovação e que o pedido
 *   pendente reserva a disponibilidade do item e o lugar na fila.
 *
 * A resposta simulada da API vem na ordem "mais recentes primeiro" (a mesma do
 * backend) para provar que a ordenação da fila é feita no cliente.
 *
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  InstructorRewardOrdersClient,
  RewardsStoreClient,
} from "@/components/sql-quest/RewardsClient";

const mockUseAuth = jest.fn();
const mockAuthedFetch = jest.fn();

jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

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

const requests = [
  {
    id: "carla",
    itemName: "Objeto personalizado de até 12 cm",
    studentName: "Carla",
    costXp: 2072,
    requestDetails: "Pedido mais recente",
    status: "fulfilled",
    createdAt: "2026-01-05T18:30:00.000Z",
  },
  {
    id: "bruno",
    itemName: "Peça de personagem",
    studentName: "Bruno",
    costXp: 691,
    requestDetails: "Pedido intermediário",
    status: "approved",
    createdAt: "2026-01-03T12:00:00.000Z",
  },
  {
    id: "ana",
    itemName: "Chaveiro simples",
    studentName: "Ana",
    costXp: 345,
    requestDetails: "Primeiro pedido",
    status: "requested",
    createdAt: "2026-01-02T09:15:00.000Z",
  },
];

const store = {
  earnedXp: 1000,
  spentXp: 0,
  xpBalance: 1000,
  items: [
    {
      id: "keychain",
      name: "Chaveiro simples",
      description: "Chaveiro personalizado com o logo da SQL Quest.",
      costXp: 345,
      initialStock: 5,
      remainingStock: 5,
      requestStatus: null,
    },
  ],
};

beforeEach(() => {
  mockUseAuth.mockReset();
  mockAuthedFetch.mockReset();
  mockUseAuth.mockReturnValue({
    user: { uid: "staff-1" },
    loading: false,
    isStaff: true,
  });
  mockAuthedFetch.mockImplementation((url: string) => {
    if (url.includes("/rewards/requests")) {
      return Promise.resolve({ ok: true, json: async () => ({ requests }) });
    }
    return Promise.resolve({ ok: true, json: async () => store });
  });
});

describe("InstructorRewardOrdersClient — fila de pedidos", () => {
  it("ordena os pendentes do mais antigo para o mais novo e rotula a posição", async () => {
    render(<InstructorRewardOrdersClient />);
    await screen.findByText("Pedido de Ana");

    const students = screen
      .getAllByText(/Pedido de (Ana|Bruno|Carla)/)
      .map((node) => node.textContent);
    expect(students).toEqual([
      "Pedido de Ana",
      "Pedido de Bruno",
      "Pedido de Carla",
    ]);

    const badges = screen
      .getAllByText(/º na fila/)
      .map((node) => node.textContent);
    expect(badges).toEqual(["1º na fila", "2º na fila"]);
  });

  it("mantém as ações de staff disponíveis", async () => {
    render(<InstructorRewardOrdersClient />);
    await screen.findByText("Pedido de Ana");

    expect(screen.getByRole("button", { name: /aprovar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /recusar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /marcar entregue/i })
    ).toBeInTheDocument();
  });

  it("mostra data e hora locais completas em um elemento time", async () => {
    const { container } = render(<InstructorRewardOrdersClient />);
    await screen.findByText("Pedido de Ana");

    const firstTime = container.querySelector("time");
    expect(firstTime).toHaveAttribute("dateTime", "2026-01-02T09:15:00.000Z");
    expect(firstTime?.textContent).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(firstTime?.textContent).toMatch(/\d{2}:\d{2}/);
  });
});

describe("RewardsStoreClient — aviso do formulário de pedido", () => {
  it("informa que o XP só é debitado na aprovação e que o pedido reserva a disponibilidade", async () => {
    render(<RewardsStoreClient />);
    fireEvent.click(
      await screen.findByRole("button", { name: /pedir recompensa/i })
    );

    expect(
      await screen.findByText(/só será debitado depois da aprovação do instrutor/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/reserva a disponibilidade deste item/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/não reserva estoque/i)).not.toBeInTheDocument();
  });
});
