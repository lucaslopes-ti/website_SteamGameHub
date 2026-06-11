/**
 * Testes do componente Hero.
 * Testa renderização básica e presença dos elementos principais.
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock do next/link
jest.mock("next/link", () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock do fetch para API de jogos
const mockGames = [
  {
    id: "1",
    title: "Space Adventure",
    author: "Alice",
    authorEmail: "alice@test.com",
    image: "/test.png",
    approved: true,
    rating: 4.5,
    totalRatings: 10,
  },
  {
    id: "2",
    title: "Puzzle World",
    author: "Bob",
    authorEmail: "bob@test.com",
    image: "/test2.png",
    approved: true,
    rating: 4.0,
    totalRatings: 8,
  },
  {
    id: "3",
    title: "Racing Stars",
    author: "Carol",
    authorEmail: "carol@test.com",
    image: "/test3.png",
    approved: true,
    rating: 3.5,
    totalRatings: 5,
  },
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockGames),
  })
) as jest.Mock;

import Hero from "@/components/Hero";

describe("Hero", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renderiza o título principal SENAI Game Hub", () => {
    render(<Hero />);
    expect(screen.getByText("SENAI")).toBeInTheDocument();
    expect(screen.getByText("Game Hub")).toBeInTheDocument();
  });

  it("renderiza os botões de ação", () => {
    render(<Hero />);
    expect(screen.getByText("Explorar jogos")).toBeInTheDocument();
    expect(screen.getByText("Enviar meu jogo")).toBeInTheDocument();
  });

  it("renderiza os cards de estatísticas", () => {
    render(<Hero />);
    expect(screen.getByText("Avaliação média")).toBeInTheDocument();
    expect(screen.getByText("Jogos publicados")).toBeInTheDocument();
    expect(screen.getByText("Desenvolvedores")).toBeInTheDocument();
    expect(screen.getByText("Avaliações")).toBeInTheDocument();
  });

  it("renderiza o badge 'Técnico em Programação de Jogos'", () => {
    render(<Hero />);
    expect(screen.getByText("Técnico em Programação de Jogos")).toBeInTheDocument();
  });

  it("faz fetch dos jogos ao montar", () => {
    render(<Hero />);
    expect(global.fetch).toHaveBeenCalledWith("/api/games?approved=true");
  });

  it("mostra 'Projeto em destaque' quando não há jogos carregados", () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );
    render(<Hero />);
    expect(screen.getByText("Projeto em destaque")).toBeInTheDocument();
  });
});
