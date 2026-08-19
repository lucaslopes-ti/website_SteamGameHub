"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ToastProvider";
import {
  getQuestions,
  addQuestion,
  deleteQuestion,
} from "@/lib/firebase/simulado";
import type { SAEPQuestion } from "@/lib/firebase/simulado";
import {
  Plus,
  Trash2,
  Upload,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  FileJson,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";

const SUBJECTS = [
  "Matemática",
  "Português",
  "Ciências",
  "História",
  "Geografia",
  "Lógica",
  "Informática",
  "Inglês",
  "Outro",
];

const DIFFICULTIES = [
  { value: "easy", label: "Fácil", color: "text-emerald-400 bg-emerald-500/15" },
  { value: "medium", label: "Médio", color: "text-yellow-400 bg-yellow-500/15" },
  { value: "hard", label: "Difícil", color: "text-red-400 bg-red-500/15" },
];

interface QuestionForm {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
}

const emptyForm: QuestionForm = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: 0,
  subject: "Matemática",
  difficulty: "medium",
};

export default function AdminSAEPPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isTeacher, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [questions, setQuestions] = useState<SAEPQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<QuestionForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [batchJson, setBatchJson] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterSubject, setFilterSubject] = useState("all");

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || (!isAdmin && !isTeacher))) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, isAdmin, isTeacher, router]);

  // Load questions
  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (err) {
      console.error("Erro ao carregar questões:", err);
      showToast("Erro ao carregar questões", "error");
    } finally {
      setLoading(false);
    }
  }

  // Add single question
  async function handleAddQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || !form.optionA.trim() || !form.optionB.trim() || !form.optionC.trim() || !form.optionD.trim()) {
      showToast("Preencha todos os campos", "warning");
      return;
    }

    setSubmitting(true);
    try {
      await addQuestion({
        question: form.question.trim(),
        options: [form.optionA.trim(), form.optionB.trim(), form.optionC.trim(), form.optionD.trim()],
        correctAnswer: form.correctAnswer,
        subject: form.subject,
        difficulty: form.difficulty,
      });
      showToast("Questão adicionada com sucesso! ✅", "success");
      setForm(emptyForm);
      setShowForm(false);
      await loadQuestions();
    } catch (err) {
      console.error("Erro ao adicionar questão:", err);
      showToast("Erro ao adicionar questão", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // Batch import
  async function handleBatchImport() {
    if (!batchJson.trim()) {
      showToast("Cole o JSON no campo", "warning");
      return;
    }

    let rawParsed: any[];

    try {
      rawParsed = JSON.parse(batchJson);
      if (!Array.isArray(rawParsed)) throw new Error("JSON deve ser um array");
    } catch {
      showToast("JSON inválido. Verifique o formato.", "error");
      return;
    }

    // Normalize: accept both formats
    const letterToIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };

    const normalized = rawParsed.map((item: any) => {
      // Format 1: Standard (question, options[], correctAnswer)
      if (item.question && Array.isArray(item.options)) {
        return {
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
          subject: item.subject || "Conhecimentos Específicos",
          difficulty: item.difficulty || "medium",
        };
      }

      // Format 2: SAEP (enunciado/pergunta, alternativas{A,B,C,D}, resposta_correta/correta)
      const text = item.enunciado || item.pergunta;
      const alts = item.alternativas;
      const answer = item.resposta_correta || item.correta || item.gabarito;

      if (text && alts && typeof alts === "object" && !Array.isArray(alts)) {
        const keys = Object.keys(alts).sort(); // A, B, C, D...
        const options = keys.map((k) => alts[k]);
        const correctAnswer = answer ? letterToIndex[answer.toUpperCase()] ?? 0 : 0;

        return {
          question: text,
          options,
          correctAnswer,
          subject: item.subject || "Conhecimentos Específicos",
          difficulty: item.difficulty || "medium",
        };
      }

      return null; // Invalid format
    });

    setSubmitting(true);
    let success = 0;
    let errors = 0;
    const errorMessages: string[] = [];

    for (let i = 0; i < normalized.length; i++) {
      const item = normalized[i];
      try {
        if (!item || !item.question || !item.options || item.options.length < 4 || item.correctAnswer === undefined) {
          errors++;
          const id = rawParsed[i]?.id || `#${i + 1}`;
          errorMessages.push(`Questão ${id}: formato inválido`);
          continue;
        }
        await addQuestion({
          question: item.question,
          options: item.options.slice(0, 4), // max 4 options
          correctAnswer: item.correctAnswer,
          subject: item.subject || "Outro",
          difficulty: (item.difficulty as "easy" | "medium" | "hard") || "medium",
        });
        success++;
      } catch {
        errors++;
      }
    }

    if (errorMessages.length > 0) {
      console.warn("Erros na importação:", errorMessages);
    }

    showToast(
      `Importação: ${success} sucesso, ${errors} erro(s)`,
      errors > 0 ? "warning" : "success"
    );
    setBatchJson("");
    setShowBatchImport(false);
    await loadQuestions();
    setSubmitting(false);
  }

  // Delete question
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return;

    setDeletingId(id);
    try {
      await deleteQuestion(id);
      showToast("Questão excluída", "success");
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      showToast("Erro ao excluir questão", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredQuestions =
    filterSubject === "all"
      ? questions
      : questions.filter((q) => q.subject === filterSubject);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-senai-dark to-senai-blueDark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-senai-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-senai-dark to-senai-blueDark">
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-senai-orange" />
                Gerenciar Questões SAEP
              </h1>
              <p className="text-sm text-gray-400">
                {questions.length} questão(ões) cadastrada(s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowBatchImport(true); setShowForm(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <FileJson className="w-4 h-4" />
              Importar JSON
            </button>
            <button
              onClick={() => { setShowForm(true); setShowBatchImport(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-senai-orange text-slate-950 text-sm font-bold hover:bg-senai-orange/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Questão
            </button>
          </div>
        </div>

        {/* Add Question Form */}
        {showForm && (
          <div className="rounded-2xl bg-white/5 border border-senai-orange/30 p-6 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-senai-orange" />
                Nova Questão
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              {/* Question text */}
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Enunciado</label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-senai-orange/50 focus:outline-none resize-none"
                  placeholder="Digite o enunciado da questão..."
                  required
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(["A", "B", "C", "D"] as const).map((letter, idx) => (
                  <div key={letter} className="relative">
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">
                      Alternativa {letter}
                      {form.correctAnswer === idx && (
                        <span className="ml-2 text-emerald-400">✓ Correta</span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={form[`option${letter}` as keyof QuestionForm] as string}
                        onChange={(e) =>
                          setForm({ ...form, [`option${letter}`]: e.target.value })
                        }
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-senai-orange/50 focus:outline-none text-sm"
                        placeholder={`Alternativa ${letter}...`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, correctAnswer: idx })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                          form.correctAnswer === idx
                            ? "bg-emerald-500 text-white"
                            : "bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10"
                        }`}
                        title="Marcar como correta"
                      >
                        {letter}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subject + Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Matéria</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-senai-orange/50 focus:outline-none text-sm"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-senai-dark">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Dificuldade</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm({ ...form, difficulty: e.target.value as "easy" | "medium" | "hard" })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-senai-orange/50 focus:outline-none text-sm"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d.value} value={d.value} className="bg-senai-dark">
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-senai-orange text-slate-950 font-bold hover:bg-senai-orange/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Salvar Questão
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Batch Import */}
        {showBatchImport && (
          <div className="rounded-2xl bg-white/5 border border-senai-blueLight/30 p-6 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileJson className="w-5 h-5 text-senai-blueLight" />
                Importar via JSON
              </h2>
              <button onClick={() => setShowBatchImport(false)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-xs text-gray-400 font-mono space-y-3">
              <div>
                <p className="text-gray-300 mb-1 font-sans font-semibold">Formato 1 — Padrão:</p>
                <pre className="overflow-x-auto">{`[{
  "question": "Quanto é 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": 1,
  "subject": "Matemática",
  "difficulty": "easy"
}]`}</pre>
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-gray-300 mb-1 font-sans font-semibold">Formato 2 — SAEP (enunciado + alternativas):</p>
                <pre className="overflow-x-auto">{`[{
  "enunciado": "Qual tag HTML...",
  "alternativas": { "A": "...", "B": "...", "C": "...", "D": "..." },
  "resposta_correta": "B"
}]`}</pre>
              </div>
            </div>

            <textarea
              value={batchJson}
              onChange={(e) => setBatchJson(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-senai-blueLight/50 focus:outline-none resize-none font-mono text-sm"
              placeholder="Cole o JSON aqui..."
            />

            <button
              onClick={handleBatchImport}
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-senai-blueLight text-slate-950 font-bold hover:bg-senai-blueLight/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Importar Questões
                </>
              )}
            </button>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterSubject("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterSubject === "all"
                ? "bg-senai-orange/20 text-senai-orange border border-senai-orange/40"
                : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
            }`}
          >
            Todas ({questions.length})
          </button>
          {SUBJECTS.map((s) => {
            const count = questions.filter((q) => q.subject === s).length;
            if (count === 0) return null;
            return (
              <button
                key={s}
                onClick={() => setFilterSubject(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterSubject === s
                    ? "bg-senai-orange/20 text-senai-orange border border-senai-orange/40"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-senai-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Carregando questões...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-gray-400">Nenhuma questão encontrada.</p>
            <p className="text-gray-500 text-sm">Clique em &quot;Nova Questão&quot; para adicionar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => {
              const diff = DIFFICULTIES.find((d) => d.value === q.difficulty);
              return (
                <div
                  key={q.id}
                  className="rounded-xl bg-white/5 border border-white/10 p-5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-senai-blue/20 flex items-center justify-center text-senai-blueLight text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-senai-blue/20 text-senai-blueLight uppercase tracking-wider">
                          {q.subject}
                        </span>
                        {diff && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${diff.color} uppercase tracking-wider`}>
                            {diff.label}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white mb-2 whitespace-pre-wrap">{q.question}</p>
                      <div className="grid grid-cols-2 gap-1">
                        {q.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`text-xs px-2 py-1 rounded ${
                              optIdx === q.correctAnswer
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                            {optIdx === q.correctAnswer && " ✓"}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(q.id)}
                      disabled={deletingId === q.id}
                      className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0 disabled:opacity-50"
                      title="Excluir questão"
                    >
                      {deletingId === q.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
