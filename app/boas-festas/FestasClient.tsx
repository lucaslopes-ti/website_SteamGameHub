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

const SECRET_PHRASE = "CHARURI VAI BRILHAR EM 2025";
const SHIFT = 6;

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
  const [testShift, setTestShift] = useState(3);
  const [showHints, setShowHints] = useState(false);

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

      <section className="container mx-auto px-4 pt-12">
        <div className="rounded-2xl border border-steam-blue/60 bg-steam-dark/70 p-8 shadow-2xl backdrop-blur-md glass-card">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-wide text-steam-blueLight">
            <Sparkles className="h-5 w-5" />
            Especial de Natal e Ano Novo · Turma de Programação de Jogos Digitais
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-200">
            <span className="rounded-full border border-steam-blue/60 bg-steam-darker px-3 py-1">
              Tema: Natal + Ano Novo + Games + Computadores
            </span>
            <span className="rounded-full border border-steam-blue/60 bg-steam-darker px-3 py-1">
              HUD futurista + neve pixelada + luzes RGB
            </span>
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
                e começar 2025 com curiosidade no nível máximo?
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-steam-blue/70 bg-steam-darker px-4 py-2 text-sm text-steam-blueLight">
                  Recesso: aproveitem, descansem, anotem ideias
                </span>
                <span className="rounded-full border border-steam-blue/70 bg-steam-darker px-4 py-2 text-sm text-steam-blueLight">
                  Retorno: 12/01 para fechar a trajetória do curso
                </span>
                <span className="rounded-full border border-steam-blue/70 bg-steam-darker px-4 py-2 text-sm text-steam-blueLight">
                  Vibe: setup gamer, protótipos e foguetes de Ano Novo
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
                    Tema gamer-festas
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2 rounded-lg bg-steam-dark/60 px-3 py-2">
                    <Monitor className="h-4 w-4 text-steam-blueLight" />
                    <span>HUD com grade sutil e luzes RGB no fundo</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-steam-dark/60 px-3 py-2">
                    <Cpu className="h-4 w-4 text-steam-blueLight" />
                    <span>Clima de setup: teclado, mouse, controle e café</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-steam-dark/60 px-3 py-2">
                    <Sparkles className="h-4 w-4 text-steam-blueLight" />
                    <span>Neve pixelada + fogos de Ano Novo no mood Steam</span>
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
            <div className="font-mono text-lg text-white tracking-wider bg-steam-dark rounded-lg p-4 border border-steam-blue/40">
              {cipherText}
            </div>
            <p className="text-sm text-gray-400">
              Dica: é uma frase curta, positiva e direta, ligada ao que vamos
              viver em 2025.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm text-gray-300">
              Escreva aqui a frase decifrada (sem acentos):
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Ex: FELIZ NATAL CHARURI 2025"
                className="w-full rounded-lg border border-steam-blue/60 bg-steam-darker px-4 py-3 text-white outline-none ring-0 focus:border-steam-blueLight focus:ring-2 focus:ring-steam-blue/40"
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
                  1. Some os dígitos de 2025. (2 + 0 + 2 + 5 = 9)
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
                  4. A frase final começa com “CHARURI” e termina com “2025”.
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
              <div className="rounded-lg border border-steam-blue/40 bg-steam-darker px-3 py-2 font-mono text-sm text-white">
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
                Feliz Natal e um 2025 brilhante para a turma de Programação de
                Jogos Digitais do SENAI Dr. Celso Charuri! Obrigado por cada
                brainstorm, cada playtest com bug teimoso e cada risada que
                manteve o time de pé. Vocês transformaram teoria em jogo,
                feedback em melhoria e convivência em aprendizado real.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Que o recesso traga descanso, família e inspiração. Voltem em
                12/01 com aquele olhar afiado para a reta final do curso: vamos
                lapidar protótipos, fechar builds e apresentar com orgulho o que
                construímos juntos — controle na mão, teclado iluminado e muita
                criatividade plugada.
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
                Orgulho define. Que 2025 venha com saúde, oportunidades e muito
                código limpo. Nos vemos em 12/01!
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

