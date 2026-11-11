import {
  JOGO_POR_ID,
  aplicarResultadoFase,
  computeGameXp,
  estrelasPremiadas,
  sanitizeGameMissionIds,
  xpMaximoDoJogo,
} from "@/lib/jogos/catalog";
import { computeEarnedXpFromDoc } from "@/lib/sql-quest/server/progress";

const jogo = JOGO_POR_ID.get("montador-cabo")!;

describe("XP dos jogos das aulas", () => {
  it("montador de cabo tem 8 fases e 1320 XP no total", () => {
    expect(jogo.fases).toHaveLength(8);
    expect(xpMaximoDoJogo(jogo)).toBe(1320);
  });

  it("premia as estrelas que faltam e não repete XP", () => {
    const r1 = aplicarResultadoFase([], "montador-cabo", "bancada", 1);
    expect(r1).toMatchObject({ ok: true, xpGanho: 60 });
    if (!r1.ok) return;
    const r2 = aplicarResultadoFase(r1.missoes, "montador-cabo", "bancada", 3);
    expect(r2).toMatchObject({ ok: true, xpGanho: 80 });
    if (!r2.ok) return;
    const r3 = aplicarResultadoFase(r2.missoes, "montador-cabo", "bancada", 2);
    expect(r3).toMatchObject({ ok: true, xpGanho: 0, novas: [] });
    expect(computeGameXp(r2.missoes)).toBe(140);
    expect(estrelasPremiadas(r2.missoes, jogo).bancada).toBe(3);
  });

  it("dá o bônus quando todas as fases chegam a 3 estrelas", () => {
    let missoes: string[] = [];
    let ultimo = 0;
    for (const fase of jogo.fases) {
      const r = aplicarResultadoFase(missoes, "montador-cabo", fase.id, 3);
      if (!r.ok) throw new Error(r.erro);
      missoes = r.missoes;
      ultimo = r.xpGanho;
    }
    expect(ultimo).toBe(140 + 200);
    expect(computeGameXp(missoes)).toBe(1320);
  });

  it("recusa jogo, fase ou estrelas inválidos", () => {
    expect(aplicarResultadoFase([], "outro", "bancada", 1).ok).toBe(false);
    expect(aplicarResultadoFase([], "montador-cabo", "xyz", 1).ok).toBe(false);
    expect(aplicarResultadoFase([], "montador-cabo", "bancada", 4).ok).toBe(false);
    expect(aplicarResultadoFase([], "montador-cabo", "bancada", 0).ok).toBe(false);
    expect(aplicarResultadoFase([], "montador-cabo", "bancada", 1.5).ok).toBe(false);
  });

  it("ignora ids desconhecidos e repetidos", () => {
    expect(
      sanitizeGameMissionIds(["montador-cabo:bancada-1", "x", "montador-cabo:bancada-1", 3])
    ).toEqual(["montador-cabo:bancada-1"]);
  });

  it("o saldo da loja soma lições e jogos", () => {
    expect(
      computeEarnedXpFromDoc({
        completedLessonIds: [],
        gameMissionIds: ["montador-cabo:cores-1", "montador-cabo:cores-2"],
      })
    ).toBe(100);
  });

  it("plantão do técnico tem 16 OS e 1800 XP no total", () => {
    const plantao = JOGO_POR_ID.get("plantao-tecnico")!;
    expect(plantao.fases).toHaveLength(16);
    expect(plantao.fases.map((f) => f.id)).toEqual(
      Array.from({ length: 16 }, (_, i) => `os${String(i + 1).padStart(2, "0")}`)
    );
    expect(xpMaximoDoJogo(plantao)).toBe(1800);
    const r = aplicarResultadoFase([], "plantao-tecnico", "os01", 3);
    expect(r).toMatchObject({ ok: true, xpGanho: 100 });
  });

  it("os dois jogos somam XP juntos no saldo", () => {
    expect(
      computeEarnedXpFromDoc({
        completedLessonIds: [],
        gameMissionIds: ["montador-cabo:cores-1", "plantao-tecnico:os05-1", "plantao-tecnico:os05-2"],
      })
    ).toBe(60 + 40 + 30);
  });
});
