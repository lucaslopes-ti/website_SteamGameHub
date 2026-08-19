export interface Game {
  id: string;
  title: string;
  description: string;
  author: string;
  authorEmail: string;
  authorUid?: string;
  genres: string[];
  technologies: string[];
  releaseDate: string;
  image?: string;
  trailerUrl?: string;
  downloadLink?: string;
  playableLink?: string;
  executableFile?: string; // Nome do arquivo executável armazenado
  executableFileName?: string; // Nome original do arquivo
  executableFileSize?: number; // Tamanho do arquivo em bytes
  screenshots?: string[]; // Array de URLs de screenshots
  rating: number;
  totalRatings: number;
  featured: boolean;
  approved: boolean;
  pending?: boolean; // Se está aguardando aprovação
}

export const mockGames: Game[] = [
  {
    id: "1",
    title: "Aventura Espacial",
    description:
      "Explore um universo infinito em um jogo de aventura espacial cheio de mistérios e desafios. Navegue por diferentes planetas e descubra segredos ocultos.",
    author: "João Silva",
    authorEmail: "joao.silva@senai.com",
    genres: ["Aventura", "Exploração"],
    technologies: ["Unity", "C#"],
    releaseDate: "2024-03-15",
    rating: 4.5,
    totalRatings: 23,
    featured: true,
    approved: true,
  },
  {
    id: "2",
    title: "Corrida Urbana",
    description:
      "Corra pelas ruas da cidade em alta velocidade. Personalize seu veículo e compita contra outros jogadores em pistas emocionantes.",
    author: "Maria Santos",
    authorEmail: "maria.santos@senai.com",
    genres: ["Corrida", "Esportes"],
    technologies: ["Unreal Engine", "C++"],
    releaseDate: "2024-03-10",
    rating: 4.2,
    totalRatings: 18,
    featured: true,
    approved: true,
  },
  {
    id: "3",
    title: "Puzzle Master",
    description:
      "Teste sua lógica com puzzles desafiadores. Mais de 100 níveis diferentes para você resolver.",
    author: "Pedro Oliveira",
    authorEmail: "pedro.oliveira@senai.com",
    genres: ["Puzzle", "Lógica"],
    technologies: ["Godot", "GDScript"],
    releaseDate: "2024-03-05",
    rating: 4.7,
    totalRatings: 31,
    featured: true,
    approved: true,
  },
  {
    id: "4",
    title: "Zombie Survival",
    description:
      "Sobreviva a uma horda de zumbis em um mundo pós-apocalíptico. Reúna recursos, construa abrigos e lute pela sobrevivência.",
    author: "Ana Costa",
    authorEmail: "ana.costa@senai.com",
    genres: ["Ação", "Survival"],
    technologies: ["Unity", "C#"],
    releaseDate: "2024-02-28",
    rating: 4.3,
    totalRatings: 27,
    featured: false,
    approved: true,
  },
  {
    id: "5",
    title: "Farm Simulator",
    description:
      "Gerencie sua própria fazenda! Plante, colha e venda produtos. Expanda seu negócio e torne-se um magnata agrícola.",
    author: "Carlos Mendes",
    authorEmail: "carlos.mendes@senai.com",
    genres: ["Simulação", "Estratégia"],
    technologies: ["GameMaker Studio", "GML"],
    releaseDate: "2024-02-20",
    rating: 4.0,
    totalRatings: 15,
    featured: false,
    approved: true,
  },
  {
    id: "6",
    title: "RPG Medieval",
    description:
      "Aventure-se em um mundo de fantasia medieval. Escolha sua classe, complete quests e derrote monstros épicos.",
    author: "Julia Ferreira",
    authorEmail: "julia.ferreira@senai.com",
    genres: ["RPG", "Fantasia"],
    technologies: ["RPG Maker", "JavaScript"],
    releaseDate: "2024-02-15",
    rating: 4.6,
    totalRatings: 42,
    featured: false,
    approved: true,
  },
];

export function getGames(): Game[] {
  return mockGames.filter((game) => game.approved);
}

export function getGameById(id: string): Game | undefined {
  return mockGames.find((game) => game.id === id && game.approved);
}

export function getGamesByGenre(genre: string): Game[] {
  return mockGames.filter(
    (game) => game.approved && game.genres.includes(genre)
  );
}

export function getGamesByTechnology(technology: string): Game[] {
  return mockGames.filter(
    (game) => game.approved && game.technologies.includes(technology)
  );
}

export function searchGames(query: string): Game[] {
  const lowerQuery = query.toLowerCase();
  return mockGames.filter(
    (game) =>
      game.approved &&
      (game.title.toLowerCase().includes(lowerQuery) ||
        game.description.toLowerCase().includes(lowerQuery) ||
        game.author.toLowerCase().includes(lowerQuery))
  );
}

