import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4 text-steam-blueLight">404</h1>
      <h2 className="text-3xl font-bold mb-4 text-white">Página não encontrada</h2>
      <p className="text-gray-400 mb-8">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-steam-blueLight hover:bg-steam-blue text-white px-6 py-3 rounded font-semibold transition"
      >
        <Home className="w-5 h-5" />
        Voltar para Home
      </Link>
    </div>
  );
}

