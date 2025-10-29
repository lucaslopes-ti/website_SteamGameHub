"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import GameGrid from "@/components/GameGrid";
import { GameGridSkeleton } from "@/components/SkeletonLoader";
import { Game } from "@/lib/games";
import { useDebounce } from "@/hooks/useDebounce";
import { Filter, X, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

const GENRES = [
  "Todos",
  "Aventura",
  "Corrida",
  "Puzzle",
  "Ação",
  "Simulação",
  "RPG",
  "Exploração",
  "Survival",
  "Estratégia",
  "Fantasia",
];

const TECHNOLOGIES = [
  "Todos",
  "Unity",
  "Unreal Engine",
  "Godot",
  "GameMaker Studio",
  "RPG Maker",
];

export default function GamesPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [selectedTechnology, setSelectedTechnology] = useState("Todos");
  const [selectedAuthor, setSelectedAuthor] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "rating" | "name">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    loadGames();
    
    // Listener para atualizar quando jogos forem aprovados
    const handleGamesUpdate = () => {
      loadGames();
    };
    window.addEventListener("gamesUpdated", handleGamesUpdate);
    
    return () => {
      window.removeEventListener("gamesUpdated", handleGamesUpdate);
    };
  }, []);

  useEffect(() => {
    // Indicar que está buscando quando query mudar
    if (debouncedSearchQuery !== searchQuery) {
      setSearching(true);
    } else {
      setSearching(false);
    }
  }, [debouncedSearchQuery, searchQuery]);

  const loadGames = async () => {
    try {
      const response = await fetch("/api/games?approved=true");
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = useMemo(() => {
    let filtered = games;

    if (debouncedSearchQuery) {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(lowerQuery) ||
          game.description.toLowerCase().includes(lowerQuery) ||
          game.author.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedGenre !== "Todos") {
      filtered = filtered.filter((game) => game.genres.includes(selectedGenre));
    }

    if (selectedTechnology !== "Todos") {
      filtered = filtered.filter((game) =>
        game.technologies.includes(selectedTechnology)
      );
    }

    if (selectedAuthor !== "Todos") {
      filtered = filtered.filter((game) => game.author === selectedAuthor);
    }

    // Ordenação
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.title.localeCompare(b.title);
        case "date":
        default:
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
    });

    return filtered;
  }, [debouncedSearchQuery, selectedGenre, selectedTechnology, selectedAuthor, games, sortBy]);

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const paginatedGames = filteredGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset para primeira página quando filtros mudarem
  }, [debouncedSearchQuery, selectedGenre, selectedTechnology, selectedAuthor, sortBy]);

  // Obter lista de autores únicos
  const uniqueAuthors = useMemo(() => {
    const authors = new Set(games.map((g) => g.author));
    return Array.from(authors).sort();
  }, [games]);

  const activeFiltersCount =
    (selectedGenre !== "Todos" ? 1 : 0) +
    (selectedTechnology !== "Todos" ? 1 : 0) +
    (selectedAuthor !== "Todos" ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-steam-blueLight">
          Todos os Jogos
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar jogos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-steam-dark border border-steam-blue rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-steam-blueLight"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-steam-blueLight" />
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-steam-blue hover:bg-steam-blueLight text-white px-6 py-2 rounded transition relative"
          >
            <Filter className="w-5 h-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-steam-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "rating" | "name")}
              className="bg-steam-dark border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
            >
              <option value="date">Mais Recentes</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-steam-dark rounded border border-steam-blue animate-slideIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-steam-blueLight mb-2">
                  Gênero
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
                >
                  {GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-steam-blueLight mb-2">
                  Tecnologia
                </label>
                <select
                  value={selectedTechnology}
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                  className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
                >
                  {TECHNOLOGIES.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-steam-blueLight mb-2">
                  Autor
                </label>
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
                >
                  <option value="Todos">Todos</option>
                  {uniqueAuthors.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setSelectedGenre("Todos");
                  setSelectedTechnology("Todos");
                  setSelectedAuthor("Todos");
                }}
                className="mt-4 flex items-center gap-2 text-steam-blueLight hover:text-white transition"
              >
                <X className="w-4 h-4" />
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <GameGridSkeleton />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-gray-400">
              {filteredGames.length} jogo{filteredGames.length !== 1 ? "s" : ""}{" "}
              encontrado{filteredGames.length !== 1 ? "s" : ""}
            </span>
            {totalPages > 1 && (
              <span className="text-gray-400 text-sm">
                Página {currentPage} de {totalPages}
              </span>
            )}
          </div>
          <GameGrid games={paginatedGames} />
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-steam-dark hover:bg-steam-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded transition ${
                        currentPage === pageNum
                          ? "bg-steam-blueLight text-white"
                          : "bg-steam-dark text-gray-300 hover:bg-steam-blue"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-steam-dark hover:bg-steam-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition flex items-center gap-2"
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
