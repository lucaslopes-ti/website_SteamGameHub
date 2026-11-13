/**
 * Catálogo de XP dos jogos das aulas (páginas estáticas em public/, como o
 * Montador de Cabo / Bancada do Técnico).
 *
 * Camada pura (sem Firebase): usada pela API /api/jogos/xp, pela loja (saldo)
 * e pelos testes. O XP SEMPRE sai deste catálogo; o cliente só informa a fase
 * e quantas estrelas fez.
 *
 * Cada fase vale XP por estrela (1ª, 2ª e 3ª estrela). Cada estrela é uma
 * "missão" guardada uma única vez em `gameMissionIds` no documento
 * `sql_quest_progress/{uid}`: jogar de novo não soma XP repetido, mas melhorar
 * de 1 para 3 estrelas soma o que faltava. Fechar todas as fases com 3
 * estrelas libera o bônus de jogo completo.
 */

export interface FaseXp {
  id: string;
  nome: string;
}

export interface JogoXp {
  id: string;
  nome: string;
  fases: readonly FaseXp[];
  /** XP da 1ª, 2ª e 3ª estrela de cada fase. */
  xpPorEstrela: readonly [number, number, number];
  /** Bônus quando todas as fases chegam a 3 estrelas. */
  bonusCompleto: number;
}

export const JOGOS_XP: readonly JogoXp[] = [
  {
    id: "montador-cabo",
    nome: "Bancada do Técnico (Montador de Cabo)",
    fases: [
      { id: "bancada", nome: "Fase 1 · Bancada: 3 cabos" },
      { id: "gaveta", nome: "Fase 2 · Caça-defeitos" },
      { id: "fibra", nome: "Fase 3 · Fibra: pode ou não pode?" },
      { id: "tomada", nome: "Fase 4 · Tomada de rede" },
      { id: "qualcabo", nome: "Fase 5 · Qual cabo eu uso?" },
      { id: "cores", nome: "Fase 6 · Corrida das cores" },
      { id: "ferramentas", nome: "Fase 7 · Ferramenta certa" },
      { id: "regras", nome: "Fase 8 · Regras da instalação" },
    ],
    xpPorEstrela: [60, 40, 40],
    bonusCompleto: 200,
  },
  {
    id: "plantao-tecnico",
    nome: "Plantão do Técnico (roteadores no bairro Santa Mônica)",
    fases: [
      { id: "os01", nome: "OS 01 · Salão de beleza (Vivo)" },
      { id: "os02", nome: "OS 02 · Casa do Seu Jorge (Claro)" },
      { id: "os03", nome: "OS 03 · Estudante da UFU (Algar)" },
      { id: "os04", nome: "OS 04 · Padaria Pão Quente (MZNet)" },
      { id: "os05", nome: "OS 05 · República de estudantes (Vivo)" },
      { id: "os06", nome: "OS 06 · Academia perto do Sabiá (Claro)" },
      { id: "os07", nome: "OS 07 · Escritório de contabilidade (Algar)" },
      { id: "os08", nome: "OS 08 · Lanchonete do Kaique (MZNet)" },
      { id: "os09", nome: "OS 09 · Consultório (Vivo)" },
      { id: "os10", nome: "OS 10 · Loja de capinhas (Claro)" },
      { id: "os11", nome: "OS 11 · Casa do professor (Algar)" },
      { id: "os12", nome: "OS 12 · Clínica veterinária (MZNet)" },
      { id: "os13", nome: "OS 13 · Imobiliária da Lúcia (Vivo)" },
      { id: "os14", nome: "OS 14 · Escola de inglês (Claro)" },
      { id: "os15", nome: "OS 15 · Hamburgueria do Léo (Algar)" },
      { id: "os16", nome: "OS 16 · Oficina mecânica (MZNet)" },
      { id: "os17", nome: "OS 17 · Pet shop Amigo Fiel (Vivo)" },
      { id: "os18", nome: "OS 18 · Pizzaria Bella Massa (Claro)" },
      { id: "os19", nome: "OS 19 · Estúdio de tatuagem (Algar)" },
      { id: "os20", nome: "OS 20 · Mercearia da Dona Rosa (MZNet)" },
      { id: "os21", nome: "OS 21 · Escritório de advocacia (Vivo)" },
      { id: "os22", nome: "OS 22 · Barbearia do Thiago (Claro)" },
      { id: "os23", nome: "OS 23 · Farmácia Santa Mônica (Algar)" },
      { id: "os24", nome: "OS 24 · Escola de música (MZNet)" },
      { id: "os25", nome: "OS 25 · Quiosque do Sabiá (Vivo)" },
    ],
    xpPorEstrela: [40, 30, 30],
    bonusCompleto: 200,
  },
  {
    id: "oficina-tecnico",
    nome: "Oficina do Técnico (Bairro da Oficina, dentro do Plantão do Técnico)",
    fases: [
      { id: "cabe", nome: "Fase 1 · Cabe ou não cabe?" },
      { id: "pop", nome: "Fase 2 · POP sem energia" },
      { id: "tela", nome: "Fase 3 · O que a tela diz?" },
      { id: "perif", nome: "Fase 4 · Teste de periféricos" },
      { id: "limp", nome: "Fase 5 · Limpeza e pasta térmica" },
      { id: "fonte", nome: "Fase 6 · Fonte e energia" },
    ],
    xpPorEstrela: [40, 30, 30],
    bonusCompleto: 200,
  },
];

export const JOGO_POR_ID: ReadonlyMap<string, JogoXp> = new Map(
  JOGOS_XP.map((j) => [j.id, j])
);

/** Id da missão de uma estrela: "montador-cabo:bancada-2". */
export function idMissaoEstrela(jogo: string, fase: string, estrela: number): string {
  return `${jogo}:${fase}-${estrela}`;
}

/** Id da missão de bônus do jogo completo: "montador-cabo:completo". */
export function idMissaoCompleto(jogo: string): string {
  return `${jogo}:completo`;
}

/** XP de cada missão conhecida (fonte única de verdade). */
const XP_POR_MISSAO: ReadonlyMap<string, number> = (() => {
  const mapa = new Map<string, number>();
  for (const jogo of JOGOS_XP) {
    for (const fase of jogo.fases) {
      jogo.xpPorEstrela.forEach((xp, i) => {
        mapa.set(idMissaoEstrela(jogo.id, fase.id, i + 1), xp);
      });
    }
    mapa.set(idMissaoCompleto(jogo.id), jogo.bonusCompleto);
  }
  return mapa;
})();

/** XP máximo de um jogo (todas as estrelas + bônus). */
export function xpMaximoDoJogo(jogo: JogoXp): number {
  const porFase = jogo.xpPorEstrela.reduce((a, b) => a + b, 0);
  return porFase * jogo.fases.length + jogo.bonusCompleto;
}

/** Mantém só ids de missão conhecidos, sem repetição, na ordem recebida. */
export function sanitizeGameMissionIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const vistos = new Set<string>();
  const ids: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !XP_POR_MISSAO.has(item) || vistos.has(item)) continue;
    vistos.add(item);
    ids.push(item);
  }
  return ids;
}

/** Soma o XP das missões de jogo (ids desconhecidos valem 0). */
export function computeGameXp(missionIds: unknown): number {
  return sanitizeGameMissionIds(missionIds).reduce(
    (total, id) => total + (XP_POR_MISSAO.get(id) ?? 0),
    0
  );
}

export type ResultadoPremio =
  | { ok: true; missoes: string[]; novas: string[]; xpGanho: number }
  | { ok: false; erro: string };

/**
 * Aplica o resultado de uma fase: adiciona as missões das estrelas 1..N que
 * ainda faltam e, se todas as fases ficarem com 3 estrelas, o bônus.
 * Idempotente: repetir o mesmo resultado não soma XP.
 */
export function aplicarResultadoFase(
  anteriores: unknown,
  jogoId: unknown,
  faseId: unknown,
  estrelas: unknown
): ResultadoPremio {
  const jogo = typeof jogoId === "string" ? JOGO_POR_ID.get(jogoId) : undefined;
  if (!jogo) return { ok: false, erro: "Jogo desconhecido." };
  const fase = jogo.fases.find((f) => f.id === faseId);
  if (!fase) return { ok: false, erro: "Fase desconhecida." };
  if (
    typeof estrelas !== "number" ||
    !Number.isInteger(estrelas) ||
    estrelas < 1 ||
    estrelas > jogo.xpPorEstrela.length
  ) {
    return { ok: false, erro: "Envie de 1 a 3 estrelas." };
  }

  const missoes = sanitizeGameMissionIds(anteriores);
  const novas: string[] = [];
  const adicionar = (id: string) => {
    if (!missoes.includes(id)) {
      missoes.push(id);
      novas.push(id);
    }
  };
  for (let e = 1; e <= estrelas; e++) adicionar(idMissaoEstrela(jogo.id, fase.id, e));

  const tudoTresEstrelas = jogo.fases.every((f) =>
    missoes.includes(idMissaoEstrela(jogo.id, f.id, jogo.xpPorEstrela.length))
  );
  if (tudoTresEstrelas) adicionar(idMissaoCompleto(jogo.id));

  return { ok: true, missoes, novas, xpGanho: computeGameXp(novas) };
}

/** Estrelas já premiadas por fase de um jogo (0 a 3). */
export function estrelasPremiadas(missionIds: unknown, jogo: JogoXp): Record<string, number> {
  const missoes = sanitizeGameMissionIds(missionIds);
  const resultado: Record<string, number> = {};
  for (const fase of jogo.fases) {
    let n = 0;
    for (let e = 1; e <= jogo.xpPorEstrela.length; e++) {
      if (missoes.includes(idMissaoEstrela(jogo.id, fase.id, e))) n = e;
    }
    resultado[fase.id] = n;
  }
  return resultado;
}
