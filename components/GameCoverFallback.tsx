import { Gamepad2 } from "lucide-react";

interface GameCoverFallbackProps {
  title: string;
  size?: "sm" | "lg";
}

// Capa padrão para jogos sem imagem: gradiente da paleta SENAI + inicial do jogo
export default function GameCoverFallback({ title, size = "sm" }: Readonly<GameCoverFallbackProps>) {
  const initial = title.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-senai-blueDark via-senai-blue to-senai-blueDark" aria-hidden="true">
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="absolute -bottom-1/3 -right-1/4 h-2/3 w-2/3 rounded-full bg-senai-orange/25 blur-3xl" />
      <div className="absolute -top-1/3 -left-1/4 h-2/3 w-2/3 rounded-full bg-senai-blueLight/25 blur-3xl" />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-2">
        <span
          className={`font-display font-black leading-none text-white/90 drop-shadow-[0_4px_24px_rgba(0,165,226,0.45)] ${
            size === "lg" ? "text-8xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {initial}
        </span>
        <Gamepad2 className={`text-senai-orange ${size === "lg" ? "w-7 h-7" : "w-5 h-5"}`} strokeWidth={2} />
      </div>
    </div>
  );
}
