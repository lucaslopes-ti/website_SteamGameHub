// Fundo do hero: céu em degradê SENAI, piso em grade com perspectiva (estilo arcade),
// linha do horizonte iluminada e formas "pixel" flutuando. Tudo em CSS/SVG, sem imagens externas.

const SHAPES = [
  { kind: "plus", className: "left-[2%] top-[12%] w-5 text-senai-orange hidden sm:block", delay: "0s" },
  { kind: "square", className: "left-[50%] top-[8%] w-5 text-senai-blueLight hidden lg:block", delay: "-3s" },
  { kind: "circle", className: "right-[3%] top-[6%] w-6 text-senai-blueLight", delay: "-6s" },
  { kind: "triangle", className: "left-[55%] top-[42%] w-5 text-senai-orange hidden lg:block", delay: "-2s" },
  { kind: "plus", className: "right-[2%] top-[55%] w-4 text-senai-orange hidden md:block", delay: "-8s" },
  { kind: "square", className: "left-[3%] top-[58%] w-4 text-senai-blueLight hidden sm:block", delay: "-5s" },
] as const;

function Shape({ kind }: Readonly<{ kind: (typeof SHAPES)[number]["kind"] }>) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.5, vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg viewBox="0 0 24 24" className="w-full h-auto">
      {kind === "plus" && <path d="M12 3v18M3 12h18" {...common} />}
      {kind === "square" && <rect x="4" y="4" width="16" height="16" rx="2" {...common} />}
      {kind === "circle" && <circle cx="12" cy="12" r="8" {...common} />}
      {kind === "triangle" && <path d="M12 4l9 16H3z" {...common} strokeLinejoin="round" />}
    </svg>
  );
}

export default function HeroBackground() {
  return (
    <div className="hero-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Céu */}
      <div className="absolute inset-0 hero-bg-sky" />
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-senai-blueLight/20 blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full bg-senai-orange/15 blur-[140px]" />

      {/* Horizonte e piso em perspectiva */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] lg:h-[34%]">
        <div className="hero-bg-horizon absolute inset-x-0 top-0 h-px" />
        <div className="hero-bg-floor absolute inset-x-[-50%] top-0 bottom-0" />
      </div>

      {/* Formas flutuantes */}
      {SHAPES.map((s, i) => (
        <div
          key={i}
          className={`hero-bg-shape absolute opacity-30 ${s.className}`}
          style={{ animationDelay: s.delay }}
        >
          <Shape kind={s.kind} />
        </div>
      ))}

      {/* Scanlines sutis + transição para o fundo da página */}
      <div className="absolute inset-0 hero-bg-scanlines" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--surface)]" />
    </div>
  );
}
