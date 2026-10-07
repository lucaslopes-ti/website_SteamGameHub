/**
 * Teste estrutural do capítulo 14 — Cisco Packet Tracer (primeira aula).
 *
 * Garante que o quiz `packet-tracer-01` tem exatamente 20 perguntas com 4
 * alternativas válidas, histograma de respostas 5×4, distribuição de
 * dificuldades 8/8/4, tempos sugeridos coerentes e que a tabela em
 * `docs/QUIZ_PACKET_TRACER_CAPITULO_14.md` está sincronizada com o quiz.
 *
 * @jest-environment node
 */
import fs from "node:fs";
import path from "node:path";
import {
  getLesson,
  getLessonById,
  isIndependentChapter,
} from "@/lib/sql-quest/catalog";

const LETTERS = ["A", "B", "C", "D"] as const;
const SUFFIX_RE =
  /\s*\((Fácil|Média|Desafio de aplicação) · Tempo sugerido: (\d+) segundos\)$/;

const lesson = getLessonById("packet-tracer-01");
const questions =
  lesson && lesson.challenge.kind === "quiz"
    ? lesson.challenge.questions
    : [];

function promptMeta(prompt: string): { difficulty: string; seconds: number } {
  const match = prompt.match(SUFFIX_RE);
  if (!match) throw new Error(`Prompt sem sufixo de metadados: ${prompt}`);
  return { difficulty: match[1], seconds: Number(match[2]) };
}

function promptStem(prompt: string): string {
  return prompt.replace(SUFFIX_RE, "");
}

describe("capítulo 14 — metadados da lição", () => {
  it("define a lição packet-tracer-01 como entrada independente", () => {
    expect(lesson).not.toBeNull();
    expect(lesson?.chapter).toBe(14);
    expect(lesson?.chapterSlug).toBe("packet-tracer");
    expect(lesson?.lesson).toBe(1);
    expect(lesson?.difficulty).toBe("iniciante");
    expect(lesson?.xpReward).toBe(40);
    expect(lesson?.prerequisites).toEqual([]);
    expect(getLesson(14, 1)?.id).toBe("packet-tracer-01");
    expect(isIndependentChapter(14)).toBe(true);
  });
});

describe("capítulo 14 — estrutura do quiz", () => {
  it("tem exatamente 20 perguntas com 4 alternativas e answer válido", () => {
    expect(lesson?.challenge.kind).toBe("quiz");
    expect(questions).toHaveLength(20);
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(Number.isInteger(question.answer)).toBe(true);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(4);
      expect(question.prompt.trim()).not.toBe("");
      expect(question.options.every((o) => o.trim() !== "")).toBe(true);
      expect(question.explanation?.trim()).toBeTruthy();
    }
  });

  it("distribui as respostas em 5×4 sem padrão (fixado)", () => {
    const histogram: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
    for (const question of questions) histogram[question.answer] += 1;
    expect(histogram).toEqual({ 0: 5, 1: 5, 2: 5, 3: 5 });
    // Gabarito fixado por posição.
    expect(questions.map((q) => LETTERS[q.answer])).toEqual([
      "B", "D", "A", "C", "A", "B", "D", "C", "B", "D",
      "C", "A", "D", "B", "A", "C", "C", "A", "D", "B",
    ]);
  });

  it("distribui dificuldades em 8 fáceis, 8 médias e 4 desafios", () => {
    const counts: Record<string, number> = {};
    for (const question of questions) {
      const { difficulty } = promptMeta(question.prompt);
      counts[difficulty] = (counts[difficulty] ?? 0) + 1;
    }
    expect(counts).toEqual({
      Fácil: 8,
      Média: 8,
      "Desafio de aplicação": 4,
    });
  });

  it("usa os tempos sugeridos corretos (30/45/60 e diagnóstico 4 = 60)", () => {
    const expected = [
      30, 30, 30, 60, 30, 30, 45, 45, 45, 30,
      45, 45, 60, 60, 45, 30, 30, 60, 45, 60,
    ];
    expect(questions.map((q) => promptMeta(q.prompt).seconds)).toEqual(
      expected
    );
    // A dificuldade de cada pergunta reflete o tempo esperado.
    questions.forEach((question, index) => {
      const { difficulty, seconds } = promptMeta(question.prompt);
      expect(seconds).toBe(expected[index]);
      if (difficulty === "Fácil") expect(seconds).toBe(30);
      if (difficulty === "Desafio de aplicação") expect(seconds).toBe(60);
    });
  });
});

describe("capítulo 14 — tabela docs sincronizada", () => {
  it("a tabela do quiz bate com as 20 perguntas da lição", () => {
    const docPath = path.resolve(
      process.cwd(),
      "docs/QUIZ_PACKET_TRACER_CAPITULO_14.md"
    );
    const lines = fs.readFileSync(docPath, "utf8").split("\n");
    const rows = lines
      .filter((line) => line.trimStart().startsWith("|"))
      .map((line) => line.split("|").map((cell) => cell.trim()))
      .filter((cells) => /^\d+$/.test(cells[1] ?? ""));

    expect(rows).toHaveLength(20);

    rows.forEach((cells, index) => {
      // Colunas: [0]="" [1]Número [2]Enunciado [3..6]=A..D
      // [7]Alternativa correta [8]Explicação [9]Dificuldade [10]Tempo.
      const question = questions[index];
      const { difficulty, seconds } = promptMeta(question.prompt);
      expect(cells[1]).toBe(String(index + 1));
      expect(cells[2]).toBe(promptStem(question.prompt));
      expect(cells[3]).toBe(question.options[0]);
      expect(cells[4]).toBe(question.options[1]);
      expect(cells[5]).toBe(question.options[2]);
      expect(cells[6]).toBe(question.options[3]);
      expect(cells[7]).toBe(LETTERS[question.answer]);
      expect(cells[8]).toBe(question.explanation);
      expect(cells[9]).toBe(difficulty);
      expect(cells[10]).toBe(`${seconds} segundos`);
    });
  });
});
