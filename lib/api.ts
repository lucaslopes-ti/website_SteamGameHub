import { Game } from "./games";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchGames(): Promise<Game[]> {
  try {
    const response = await fetch(`${API_BASE}/api/games?approved=true`);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
}

export async function fetchGameById(id: string): Promise<Game | null> {
  try {
    const response = await fetch(`${API_BASE}/api/games/${id}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    return null;
  }
}

export async function searchGamesAPI(query: string): Promise<Game[]> {
  try {
    const games = await fetchGames();
    const lowerQuery = query.toLowerCase();
    return games.filter(
      (game) =>
        game.title.toLowerCase().includes(lowerQuery) ||
        game.description.toLowerCase().includes(lowerQuery) ||
        game.author.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
}

