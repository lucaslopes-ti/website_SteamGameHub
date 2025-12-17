"use client";

import { useMemo, useState } from "react";
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

const SECRET_PHRASE = [
  "TEMA DE CONSOLE HACKER",
  "VERSAO 4 — MANTRA DE TI",
  "> EXECUTAR FESTIVE_MESSAGE.EXE",
  "> AUTENTICACAO: TURMA2026",
  "> DICA: ENCONTRE A VARIAVEL 'ROOTJOY' E COMPILE.",
  "> LEMBRETE: NAO E BUG, E FEATURE!",
].join("\n");
const SHIFT = 7;

function normalizeInput(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
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
  const [testShift, setTestShift] = useState(7);
  const [showHints, setShowHints] = useState(false);
  const snowFlakes = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 6,
        size: 3 + Math.floor(Math.random() * 3),
        opacity: 0.5 + Math.random() * 0.5,
      })),
    []
  );

  const solved = status === "ok";

  const decodedPreview = useMemo(
    () => caesarShift(cipherText, -testShift),
    [cipherText, testShift]
  );

  const handleCheck = () => {
    if (normalizeInput(answer) === normalizeInput(SECRET_PHRASE)) {
      setStatus("ok");
    } else {
      setStatus("error");
    }
  };

  return (
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
                Boas festas, turma do SENAI Dr. Celso Charuri!
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Vocês encerram mais um ciclo cheio de protótipos, playtests e
                resiliência. Antes do recesso, deixei uma carta escondida para
                quem topar decifrar uma Cifra de César. Bora liberar a mensagem
                e começar 2026 com curiosidade no nível máximo?
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-steam-blue/70 bg-steam-darker px-4 py-2 text-sm text-steam-blueLight">
                  Recesso: aproveitem, descansem, anotem ideias
                </span>
                <span className="rounded-full border border-steam-blue/70 bg-steam-darker px-4 py-2 text-sm text-steam-blueLight">
                  Retorno: 12/01 para fechar a trajetória do curso
                </span>
                <span className="rounded-full border border-steam-blue/70 bg-steam-darker px-4 py-2 text-sm text-steam-blueLight">
                  Modo: console hacker + neve pixelada
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

          <div className="mt-6 space-y-3 rounded-xl border border-steam-blue/40 bg-steam-darker p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Texto cifrado
            </p>
            <div className="font-mono text-lg text-white tracking-wider bg-steam-dark rounded-lg p-4 border border-steam-blue/40 whitespace-pre-wrap">
              {cipherText}
            </div>
            <p className="text-sm text-gray-400">
              Dica: é um prompt hacker com mantra de TI para celebrar 2026.
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
                placeholder={`Ex:\n> EXECUTAR FESTIVE_MESSAGE.EXE\n> AUTENTICACAO: TURMA2026\n> DICA: ENCONTRE A VARIAVEL 'ROOTJOY' E COMPILE.\n> LEMBRETE: NAO E BUG, E FEATURE!`}
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
                  2. Conte quantas vogais existem em “SENAI” (são 3) e subtraia
                  do número anterior.
                </li>
                <li>
                  3. O resultado é o deslocamento que desfaz a cifra. Aplique nas
                  letras do texto acima.
                </li>
                <li>
                  4. A frase decifrada começa com “&gt; EXECUTAR” e fala da variável
                  “ROOTJOY”.
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
              <p className="text-lg leading-relaxed text-white">
                Feliz Natal e um 2026 cheio de ideias brilhantes para a turma de Programação de Jogos Digitais do SENAI Dr. Celso Charuri!
              </p>
              <p className="text-gray-200 leading-relaxed">
                Obrigado por cada parceria, cada linha de código, cada modelagem que nasceu entre bugs teimosos e risadas sinceras. Foram muitas telas azuis, cafés e debates sobre gameplay — mas também muitas conquistas e aprendizados que levamos pra vida.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Agradeço por cada momento em que embarcaram comigo nessa jornada: dos cálculos com raízes quadradas na lousa (sim, eu vi a reação de vocês!) às manhãs/tarde em que o ar-condicionado desistia de viver enquanto a gente seguia firme codando. Foi intenso, divertido e, acima de tudo, verdadeiro.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Que o recesso traga descanso, inspiração e tempo com a família. Em 12/01, voltamos com o teclado iluminado, controle na mão e aquele olhar afiado pra reta final do curso. Vamos lapidar protótipos, fechar builds e mostrar com orgulho o que construímos juntos em 2025 — porque o melhor ainda está por vir.
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
                Valeu demais, pessoal! Que 2026 venha com ainda mais códigos,
                desafios e boas risadas. Nos vemos em 12/01!
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
  );
}

