import Link from "next/link";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { Game } from "@/lib/games";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`}>
      <div className="bg-steam-dark rounded-lg overflow-hidden hover-lift cursor-pointer group animate-fadeIn">
        <div className="relative h-48 bg-steam-blue overflow-hidden">
          {game.image ? (
            <Image
              src={game.image}
              alt={game.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
          {game.featured && (
            <div className="absolute top-2 right-2 bg-steam-green text-white px-2 py-1 rounded text-xs font-bold">
              DESTAQUE
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-steam-blueLight transition">
            {game.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {game.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <User className="w-4 h-4" />
              <span>{game.author}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {game.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="bg-steam-blue text-steam-blueLight text-xs px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

