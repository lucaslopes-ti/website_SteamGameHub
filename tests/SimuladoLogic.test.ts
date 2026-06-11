/**
 * Testes unitários para as lógicas do Simulado SAEP.
 * Testa funções puras: shuffleAndPick e calculateScore.
 */

import { shuffleAndPick, calculateScore } from "@/lib/firebase/simulado";
import type { SAEPQuestion, SAEPAttemptAnswer } from "@/lib/firebase/simulado";

// Mock de questões para os testes
function createMockQuestions(count: number): SAEPQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `q-${i + 1}`,
    question: `Questão ${i + 1}`,
    options: ["A", "B", "C", "D"],
    correctAnswer: i % 4,
    subject: "Matemática",
    difficulty: "medium" as const,
  }));
}

describe("shuffleAndPick", () => {
  it("retorna exatamente 20 questões quando há mais de 20 no banco", () => {
    const questions = createMockQuestions(50);
    const result = shuffleAndPick(questions, 20);
    expect(result).toHaveLength(20);
  });

  it("retorna todas as questões quando há menos de 20 no banco", () => {
    const questions = createMockQuestions(10);
    const result = shuffleAndPick(questions, 20);
    expect(result).toHaveLength(10);
  });

  it("retorna exatamente o count solicitado quando disponível", () => {
    const questions = createMockQuestions(30);
    const result = shuffleAndPick(questions, 15);
    expect(result).toHaveLength(15);
  });

  it("retorna um array vazio quando recebe um array vazio", () => {
    const result = shuffleAndPick([], 20);
    expect(result).toHaveLength(0);
  });

  it("retorna elementos que pertencem ao array original", () => {
    const questions = createMockQuestions(50);
    const result = shuffleAndPick(questions, 20);
    for (const q of result) {
      expect(questions).toContainEqual(q);
    }
  });

  it("não contém elementos duplicados", () => {
    const questions = createMockQuestions(50);
    const result = shuffleAndPick(questions, 20);
    const ids = result.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("produz ordens diferentes em execuções consecutivas (aleatoriedade)", () => {
    const questions = createMockQuestions(50);

    // Roda 10 vezes e verifica se pelo menos 2 resultados são diferentes
    const results = Array.from({ length: 10 }, () =>
      shuffleAndPick(questions, 20).map((q) => q.id).join(",")
    );

    const uniqueResults = new Set(results);
    // Com 50 questões e 20 selecionadas, é estatisticamente impossível
    // que todas as 10 execuções produzam a mesma sequência
    expect(uniqueResults.size).toBeGreaterThan(1);
  });

  it("não modifica o array original", () => {
    const questions = createMockQuestions(30);
    const originalOrder = questions.map((q) => q.id);
    shuffleAndPick(questions, 20);
    const afterOrder = questions.map((q) => q.id);
    expect(afterOrder).toEqual(originalOrder);
  });
});

describe("calculateScore", () => {
  it("retorna 0 quando nenhuma resposta está correta", () => {
    const answers: SAEPAttemptAnswer[] = [
      { questionId: "q1", selected: 1, correct: 0, isCorrect: false },
      { questionId: "q2", selected: 2, correct: 3, isCorrect: false },
      { questionId: "q3", selected: 0, correct: 1, isCorrect: false },
    ];
    expect(calculateScore(answers)).toBe(0);
  });

  it("retorna o total quando todas as respostas estão corretas", () => {
    const answers: SAEPAttemptAnswer[] = [
      { questionId: "q1", selected: 0, correct: 0, isCorrect: true },
      { questionId: "q2", selected: 3, correct: 3, isCorrect: true },
      { questionId: "q3", selected: 1, correct: 1, isCorrect: true },
    ];
    expect(calculateScore(answers)).toBe(3);
  });

  it("retorna a contagem correta para respostas mistas", () => {
    const answers: SAEPAttemptAnswer[] = [
      { questionId: "q1", selected: 0, correct: 0, isCorrect: true },
      { questionId: "q2", selected: 1, correct: 3, isCorrect: false },
      { questionId: "q3", selected: 1, correct: 1, isCorrect: true },
      { questionId: "q4", selected: 2, correct: 0, isCorrect: false },
      { questionId: "q5", selected: 3, correct: 3, isCorrect: true },
    ];
    expect(calculateScore(answers)).toBe(3);
  });

  it("retorna 0 para um array vazio de respostas", () => {
    expect(calculateScore([])).toBe(0);
  });

  it("lida corretamente com respostas não respondidas (selected = -1)", () => {
    const answers: SAEPAttemptAnswer[] = [
      { questionId: "q1", selected: -1, correct: 0, isCorrect: false },
      { questionId: "q2", selected: 0, correct: 0, isCorrect: true },
    ];
    expect(calculateScore(answers)).toBe(1);
  });

  it("calcula corretamente a pontuação para 20 questões (cenário real)", () => {
    const answers: SAEPAttemptAnswer[] = Array.from({ length: 20 }, (_, i) => ({
      questionId: `q-${i + 1}`,
      selected: i < 14 ? i % 4 : (i + 1) % 4,
      correct: i % 4,
      isCorrect: i < 14,
    }));
    expect(calculateScore(answers)).toBe(14);
  });
});
