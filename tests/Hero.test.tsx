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

// Jogos aprovados recebidos da página inicial
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
] as unknown as Game[];

import type { Game } from "@/lib/games";
import Hero from "@/components/Hero";

describe("Hero", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renderiza o título principal SENAI Game Hub", () => {
    render(<Hero games={mockGames} totalViews={1200} totalDownloads={340} />);
    expect(screen.getByText("SENAI")).toBeInTheDocument();
    expect(screen.getByText("Game Hub")).toBeInTheDocument();
  });

  it("renderiza os botões de ação", () => {
    render(<Hero games={mockGames} totalViews={1200} totalDownloads={340} />);
    expect(screen.getByText("Explorar jogos")).toBeInTheDocument();
    expect(screen.getByText("Enviar meu jogo")).toBeInTheDocument();
  });

  it("renderiza os cards de estatísticas", () => {
    render(<Hero games={mockGames} totalViews={1200} totalDownloads={340} />);
    expect(screen.getByText("Jogos publicados")).toBeInTheDocument();
    expect(screen.getByText("Desenvolvedores")).toBeInTheDocument();
    expect(screen.getByText("Visualizações")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
  });

  it("renderiza o badge 'Aberto a todos os alunos SENAI'", () => {
    render(<Hero games={mockGames} totalViews={1200} totalDownloads={340} />);
    expect(screen.getByText("Aberto a todos os alunos SENAI")).toBeInTheDocument();
  });

  it("destaca o jogo com melhor média ponderada", () => {
    render(<Hero games={mockGames} totalViews={0} totalDownloads={0} />);
    expect(screen.getByText("Space Adventure")).toBeInTheDocument();
  });

  it("mostra 'Projeto em destaque' quando não há jogos carregados", () => {
    render(<Hero games={[]} totalViews={0} totalDownloads={0} />);
    expect(screen.getByText("Projeto em destaque")).toBeInTheDocument();
  });
});
