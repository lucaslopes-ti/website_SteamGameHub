"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Gift,
  Gamepad2,
  KeyRound,
  Lightbulb,
  Lock,
  Monitor,
  PartyPopper,
  Snowflake,
  Sparkles,
  Unlock,
  Cpu,
} from "lucide-react";

const SECRET_PHRASE = "BUGFREECHRISTMAS";
const SHIFT = 7;

function normalizeInput(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function caesarShift(text: string, distance: number) {
  const shift = ((distance % 26) + 26) % 26;
  return text.replace(/[A-Za-z]/g, (char) => {
    const base = char >= "a" && char <= "z" ? 97 : 65;
    const code = char.charCodeAt(0) - base;
    const shifted = (code + shift + 26) % 26;
    return String.fromCharCode(shifted + base);
  });
}

export default function FestasClient() {
  const cipherText = useMemo(() => caesarShift(SECRET_PHRASE, SHIFT), []);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [testShift, setTestShift] = useState(1);
  const [showHints, setShowHints] = useState(false);
  const [showPlanB, setShowPlanB] = useState(false);
  const [rgbGlow, setRgbGlow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const snowFlakes = useMemo(
    () => {
      const flakeCount = isMobile ? 90 : 60;
      const baseSize = isMobile ? 4 : 3;
      const extraSize = isMobile ? 4 : 3;
      const minDuration = isMobile ? 9 : 7;

      return Array.from({ length: flakeCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: minDuration + Math.random() * 6,
        size: baseSize + Math.floor(Math.random() * extraSize),
        opacity: (isMobile ? 0.7 : 0.5) + Math.random() * (isMobile ? 0.25 : 0.5),
      }));
    },
    [isMobile]
  );
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<"idle" | "ok" | "err">("idle");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateIsMobile = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    updateIsMobile(mediaQuery);
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  const solved = status === "ok";
  const displayName = recipientName.trim() || "você";

  const decodedPreview = useMemo(
    () => caesarShift(cipherText, -testShift),
    [cipherText, testShift]
  );

  const handleCheck = () => {
    const normalized = normalizeInput(answer);
    const normalizedSecret = normalizeInput(SECRET_PHRASE);
    const altNumber = normalizeInput("2026");
    const altKey = normalizeInput("BUGFREECHRISTMAS");

    if (
      normalized === normalizedSecret ||
      normalized === altNumber ||
      normalized === altKey
    ) {
      setStatus("ok");
    } else {
      setStatus("error");
    }
  };

  const handleCopyCipher = async () => {
    try {
      await navigator?.clipboard?.writeText(cipherText);
      setCopyStatus("ok");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("err");
    }
  };

  const runFestiveConsole = () => {
    const leds = 64 + Math.floor(Math.random() * 64);
    const output = [
      "> python terminal.py",
      "# TODO: Refatorar alegria para otimizar fim de ano",
      "# FIXME: Corrigir bug de sono acumulado",
      "# SECRET_KEY = ?",
      "import math",
      "print('Feliz Natal, devs!')",
      "cbrt = lambda x: round(x ** (1/3))",
      `cbrt(8316073576) -> 2026`,
      `leds_rgb_detectados = ${leds}`,
      "compilando rootJoy... ok",
      "SECRET_KEY encontrada: BUGFREECHRISTMAS",
    ];
    setTerminalOutput(output);
  };

  const rgbGlowStyle = `
    .rgb-blink {
      animation: rgbBlink 1.2s ease-in-out 0s 1 forwards;
      text-shadow: 0 0 8px #f00, 0 0 12px #0f0, 0 0 16px #00f;
    }
    @keyframes rgbBlink {
      0% { color: #f00; }
      33% { color: #0f0; }
      66% { color: #00f; }
      100% { color: #fff; text-shadow: 0 0 0 transparent; }
    }
  `;

  return (
    <>
      <style jsx>{rgbGlowStyle}</style>
      <div className="relative overflow-hidden pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-steam-dark via-steam-darker to-black opacity-80 -z-10" />
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-steam-blue/30 blur-3xl" />
      <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-steam-green/25 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div className="pixel-snow" aria-hidden>
        {snowFlakes.map((flake) => (
          <div
            key={flake.id}
            className="pixel-snowflake"
            style={{
              left: `${flake.left}%`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
              opacity: flake.opacity,
              width: flake.size,
              height: flake.size,
            }}
          />
        ))}
      </div>

      <section className="container mx-auto px-4 pt-12">
        <div className="rounded-2xl border border-steam-blue/60 bg-steam-dark/70 p-8 shadow-2xl backdrop-blur-md glass-card">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-wide text-steam-blueLight">
            <Sparkles className="h-5 w-5" />
            Especial de Natal e Ano Novo · Turma de Programação de Jogos Digitais
          </div>
          <div className="mt-3 rounded-lg border border-steam-blue/50 bg-black/40 px-4 py-3 font-mono text-sm text-steam-blueLight shadow-inner">
            <div className="flex flex-wrap gap-2">
              <span className="text-green-300">root@charuri</span>
              <span className="text-gray-300">~$</span>
              <span className="text-steam-blueLight">
                ./festive_message --year 2026 --mode pixel-snow --vibes console
              </span>
            </div>
            <div className="mt-1 text-gray-300">console online... carregando saudação...</div>
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white leading-tight">
                Boas festas, turma!
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Vocês encerram mais um ciclo cheio de protótipos, playtests e resiliência.
                Antes do recesso, deixei uma carta escondida para quem topar decifrar uma
                Cifra de César. Bora liberar a mensagem e começar 2026 com curiosidade no
                nível máximo?
              </p>
              <p className="text-sm text-steam-blueLight font-semibold flex flex-wrap gap-2 items-center">
                Desejo um Feliz Natal e Próspero Ano Novo. Desejo que sua árvore tenha mais
                luzes que seu PC tem LEDs{" "}
                <button
                  type="button"
                  onClick={() => {
                    setRgbGlow(true);
                    setTimeout(() => setRgbGlow(false), 2000);
                  }}
                  className={`relative inline-flex items-center gap-1 px-1 text-steam-blueLight/60 underline decoration-dotted decoration-steam-blue ${
                    rgbGlow ? "rgb-blink" : "hover:text-steam-blueLight"
                  }`}
                  title="(psst) clica aqui"
                >
                  <span className="relative">
                    RGB
                    {rgbGlow && (
                      <span className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-red-500 via-green-400 to-blue-500 blur-sm opacity-70" />
                    )}
                  </span>
                </button>
                !
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-steam-blue/70 bg-steam-darker px-4 py-2 text-sm text-steam-blueLight">
                  Recesso: aproveitem, descansem, anotem ideias
                </span>
                <span className="rounded-full border border-steam-blue/70 bg-steam-darker px-4 py-2 text-sm text-steam-blueLight">
                  Retorno: 12/01 para fechar a trajetória do curso
                </span>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-xl border border-steam-blue/60 bg-steam-darker p-4 shadow">
                <div className="flex items-center gap-2 text-steam-blueLight">
                  <CalendarClock className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Linha do tempo
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-gray-200">
                  <div className="flex justify-between rounded-lg bg-steam-dark/60 px-3 py-2">
                    <span>Recesso</span>
                    <span className="text-steam-blueLight">até 11/01</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-steam-dark/60 px-3 py-2">
                    <span>Voltamos</span>
                    <span className="text-steam-blueLight">12/01</span>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-steam-blue/60 bg-steam-darker p-4 shadow">
                <div className="flex items-center gap-2 text-steam-blueLight">
                  <Gift className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Missão
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Desbloqueie a frase-código e receba a mensagem completa de
                  Natal e Ano Novo feita especialmente para vocês.
                </p>
              </div>
              <div className="rounded-xl border border-steam-blue/60 bg-steam-darker p-4 shadow">
                <div className="flex items-center gap-2 text-steam-blueLight">
                  <Gamepad2 className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Console hacker vibe
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-gray-300 font-mono">
                  <div className="flex items-center gap-2 rounded-lg bg-steam-dark/60 px-3 py-2">
                    <Monitor className="h-4 w-4 text-steam-blueLight" />
                    <span>prompt: ./boot_holiday --pixel-snow --crt</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-steam-dark/60 px-3 py-2">
                    <Cpu className="h-4 w-4 text-steam-blueLight" />
                    <span>scanlines + glitch leve + leds em verde neon</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-steam-dark/60 px-3 py-2">
                    <Sparkles className="h-4 w-4 text-steam-blueLight" />
                    <span>pixel snow caindo sobre o HUD festivo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-10 grid gap-6 px-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-steam-blue/70 bg-steam-dark/80 p-8 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-steam-blueLight">
            <Lock className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-white">
              Desafio de Cifra de César
            </h2>
          </div>
          <p className="mt-2 text-gray-300 leading-relaxed">
            A frase abaixo foi deslocada algumas casas no alfabeto. Resolva o
            enigma, digite a resposta (sem acentos) e libere a carta final.
          </p>

          <div className="mt-4 rounded-xl border border-steam-blue/40 bg-black/50 p-4 font-mono text-sm text-gray-200 shadow-inner">
            <div className="text-steam-blueLight mb-2 flex items-center gap-2">
              <span className="rounded bg-steam-darker px-2 py-1 text-xs uppercase">terminal.py</span>
              <span>// comentário suspeito</span>
            </div>
            <div className="space-y-1">
              <div># TODO: Refatorar alegria para otimizar fim de ano</div>
              <div># FIXME: Corrigir bug de sono acumulado</div>
              <div># SECRET_KEY = ?</div>
              <div>print("Feliz Natal, devs!")</div>
            </div>
            <div className="mt-3 text-steam-blueLight">
              Dica do terminal: “O valor da variável secreta é o oposto de um bug que faz sorrir.”
              Descubra a SECRET_KEY e decifre a cifra abaixo.
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-xl border border-steam-blue/40 bg-steam-darker p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Texto cifrado
              </p>
              <button
                onClick={handleCopyCipher}
                className="text-xs rounded border border-steam-blue/60 bg-steam-dark px-3 py-1 text-steam-blueLight hover:border-steam-blueLight transition"
                title="Copiar texto cifrado"
              >
                Copiar cifra
              </button>
            </div>
            <div className="font-mono text-lg text-white tracking-wider bg-steam-dark rounded-lg p-4 border border-steam-blue/40 whitespace-pre-wrap">
              {cipherText}
            </div>
            {copyStatus === "ok" && (
              <p className="text-xs text-green-300">Copiado!</p>
            )}
            {copyStatus === "err" && (
              <p className="text-xs text-red-300">Não foi possível copiar.</p>
            )}
            <p className="text-sm text-gray-400">
              Dica: é só a SECRET_KEY cifrada com deslocamento 7 (oposto de um bug
              que faz sorrir). O comentário acima entrega o contexto.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm text-gray-300">
              Escreva aqui a frase decifrada (pode colar em múltiplas linhas e sem acentos):
            </label>
            <div className="flex flex-col gap-3">
              <textarea
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                rows={5}
                placeholder={`Ex:\n# TODO: REFACTORAR ALEGRIA PARA OTIMIZAR FIM DE ANO\n# FIXME: CORRIGIR BUG DE SONO ACUMULADO\n# SECRET_KEY = BUGFREECHRISTMAS\nprint("Feliz Natal, devs!")\n> CBRT(8316073576) == ?`}
                className="w-full rounded-lg border border-steam-blue/60 bg-steam-darker px-4 py-3 font-mono text-sm text-white outline-none ring-0 focus:border-steam-blueLight focus:ring-2 focus:ring-steam-blue/40"
              />
              <button
                onClick={handleCheck}
                className="w-full sm:w-40 rounded-lg bg-steam-blue px-4 py-3 font-semibold text-white transition hover:bg-steam-blueLight focus:outline-none focus:ring-2 focus:ring-steam-blueLight focus:ring-offset-2 focus:ring-offset-steam-dark"
              >
                Conferir
              </button>
            </div>
            {status === "error" && (
              <p className="text-sm text-red-300">
                Quase! Revise o deslocamento e lembre de remover acentos e
                caracteres especiais.
              </p>
            )}
            {status === "ok" && (
              <div className="flex items-center gap-2 text-steam-blueLight">
                <Unlock className="h-5 w-5" />
                <p className="text-sm">
                  Desbloqueado! Role para ler a carta completa.
                </p>
              </div>
            )}
            <div className="text-xs text-gray-400 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <button
                onClick={() => setShowPlanB((prev) => !prev)}
                className="w-fit rounded border border-steam-blue/60 bg-steam-darker px-3 py-1 text-steam-blueLight hover:border-steam-blueLight transition"
              >
                {showPlanB ? "Ocultar plano B" : "Mostrar plano B"}
              </button>
              {showPlanB && (
                <span>
                  Plano B: se pintar dúvida, responda só a SECRET_KEY
                  (“bugfreechristmas”) ou o resultado de CBRT(8316073576) → 2026.
                  Sabia que um dia usaríamos raiz cúbica para algo importante! :)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-steam-blue/60 bg-steam-dark/80 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-steam-blueLight">
                <Lightbulb className="h-5 w-5" />
                <span className="font-semibold text-white">Dicas</span>
              </div>
              <button
                onClick={() => setShowHints((prev) => !prev)}
                className="text-sm text-steam-blueLight underline underline-offset-4"
              >
                {showHints ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {showHints ? (
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                <li>
                  1. Some os dígitos de 2026. (2 + 0 + 2 + 6 = 10)
                </li>
                <li>
                  2. Conte quantas vogais existem em “SENAI” (são 3) e subtraia do
                  número anterior → deslocamento 7.
                </li>
                <li>
                  3. A SECRET_KEY é o oposto de um bug que faz sorrir (pense em
                  algo “bugFree” + Natal).
                </li>
                <li>
                  4. Plano B: o terminal pergunta CBRT(8316073576). Resultado? 2026.
                </li>
                <li>
                  5. Se travar, pode responder só a chave ou apenas “2026” para
                  liberar a carta.
                </li>
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                Ative as dicas se travar. O enigma foi feito para ser divertido,
                não impossível.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-steam-blue/60 bg-steam-dark/80 p-6 shadow-lg">
            <div className="flex items-center gap-2 text-steam-blueLight">
              <KeyRound className="h-5 w-5" />
              <span className="font-semibold text-white">
                Laboratório de cifra
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-300 leading-relaxed">
              Teste deslocamentos para ver como a mensagem muda. Quando o texto
              fizer sentido, você achou a chave.
            </p>
            <div className="mt-4 space-y-2">
              <label className="text-xs uppercase tracking-wide text-gray-400">
                Deslocamento de teste: {testShift} casas
              </label>
              <input
                type="range"
                min={1}
                max={13}
                value={testShift}
                onChange={(e) => setTestShift(Number(e.target.value))}
                className="w-full accent-steam-blueLight"
              />
              <div className="rounded-lg border border-steam-blue/40 bg-steam-darker px-3 py-2 font-mono text-sm text-white whitespace-pre-wrap">
                {decodedPreview}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-steam-blue/60 bg-steam-dark/80 p-6 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-steam-blueLight">
                <Monitor className="h-5 w-5" />
                <span className="font-semibold text-white">Console festivo</span>
              </div>
              <button
                onClick={runFestiveConsole}
                className="rounded bg-steam-blue px-3 py-2 text-sm font-semibold text-white hover:bg-steam-blueLight transition focus:outline-none focus:ring-2 focus:ring-steam-blueLight focus:ring-offset-2 focus:ring-offset-steam-dark"
              >
                Rodar script
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              Rode o script e veja o terminal revelar a SECRET_KEY e a raiz cúbica
              que libera a carta.
            </p>
            <div className="mt-3 rounded-lg border border-steam-blue/50 bg-black/60 p-3 font-mono text-sm text-gray-200 min-h-[140px]">
              {terminalOutput.length === 0 ? (
                <p className="text-gray-500">Aguardando comando...</p>
              ) : (
                terminalOutput.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-steam-blue/60 bg-steam-dark/80 p-6 shadow-lg">
            <div className="flex items-center gap-2 text-steam-blueLight">
              <Snowflake className="h-5 w-5" />
              <span className="font-semibold text-white">Clima da turma</span>
            </div>
            <p className="mt-2 text-sm text-gray-300 leading-relaxed">
              Guardem o que funcionou: colaboração, feedback honesto e coragem
              de iterar. Esses três pontos são a nossa “build estável”.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-10 px-4">
        <div
          className={`relative overflow-hidden rounded-2xl border p-8 shadow-2xl backdrop-blur-md ${
            solved
              ? "border-steam-green bg-gradient-to-br from-steam-dark/80 via-steam-darker/80 to-steam-dark/70"
              : "border-dashed border-steam-blue/60 bg-steam-dark/70"
          }`}
        >
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-steam-blue/20 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-steam-green/20 blur-3xl" />

          <div className="relative flex items-center gap-2 text-steam-blueLight">
            {solved ? (
              <PartyPopper className="h-6 w-6" />
            ) : (
              <Lock className="h-6 w-6" />
            )}
            <h3 className="text-2xl font-bold text-white">
              {solved ? "Carta desbloqueada" : "Carta protegida"}
            </h3>
          </div>

          {solved ? (
            <div className="relative mt-4 space-y-4 text-gray-200">
              <div className="rounded-lg border border-steam-blue/40 bg-steam-darker/60 p-4 shadow-inner">
                <label className="text-sm font-semibold text-gray-300">
                  Personalize a carta com seu nome
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Seu nome aqui"
                    className="w-full rounded-lg border border-steam-blue/60 bg-steam-dark px-3 py-2 text-sm text-white outline-none ring-0 sm:max-w-xs focus:border-steam-blueLight focus:ring-2 focus:ring-steam-blue/40"
                  />
                  <span className="text-xs text-gray-400">
                    Se deixar em branco, uso “você”.
                  </span>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-white">
                🎄 Feliz Natal e um 2026 cheio de ideias brilhantes pra você, {displayName}!
              </p>
              <p className="text-gray-200 leading-relaxed">
                Obrigado por cada parceria, cada linha de código e cada modelagem que você ajudou a construir — entre bugs teimosos e boas risadas. Foram muitas telas azuis, cafés e discussões sobre gameplay, mas também muitas conquistas e aprendizados que levamos pra vida.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Valeu por embarcar comigo nessa jornada: dos cálculos com raízes quadradas na lousa (sim, eu vi sua reação!) às manhãs/tardes em que o ar-condicionado desistia de viver enquanto você seguia firme codando. Foi intenso, divertido e, acima de tudo, verdadeiro.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Que o recesso te traga descanso, inspiração e bons momentos com a família. Em <span className="font-semibold text-steam-blueLight">12/01</span>, voltamos com os teclados a postos, o controle na mão e aquele olhar afiado pra reta final do curso. Vamos lapidar protótipos, fechar builds e mostrar com orgulho o que você ajudou a criar — porque o melhor ainda está por vir.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-steam-blue/50 bg-steam-darker/80 p-4">
                  <div className="flex items-center gap-2 text-steam-blueLight">
                    <Gift className="h-5 w-5" />
                    <span className="font-semibold text-white">Para o recesso</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>Descanse de verdade.</li>
                    <li>Anote ideias loucas sem censura.</li>
                    <li>Jogue algo novo e analise o que te prende.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-steam-blue/50 bg-steam-darker/80 p-4">
                  <div className="flex items-center gap-2 text-steam-blueLight">
                    <CalendarClock className="h-5 w-5" />
                    <span className="font-semibold text-white">Quando voltarmos</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>Polimento final dos projetos.</li>
                    <li>Últimos playtests e ajustes finos.</li>
                    <li>Preparar a entrega que vai marcar nossa história.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-steam-blue/50 bg-steam-darker/80 p-4">
                  <div className="flex items-center gap-2 text-steam-blueLight">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold text-white">Para levar na vida</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li>Criatividade com pés no chão.</li>
                    <li>Feedback como combustível, não como ataque.</li>
                    <li>Time acima do ego: é assim que shipamos.</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-200 leading-relaxed">
                Nos vemos em <span className="font-semibold text-steam-blueLight">12/01</span>!
              </p>
            </div>
          ) : (
            <p className="relative mt-3 text-gray-300">
              Resolva o desafio para revelar a mensagem completa. A curiosidade
              sempre abre portas.
            </p>
          )}
        </div>
      </section>
      </div>
    </>
  );
}

