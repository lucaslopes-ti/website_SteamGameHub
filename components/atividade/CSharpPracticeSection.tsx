"use client";

import { useState } from "react";
import { Code, CheckCircle, Download, Play, XCircle, BookOpen, Lightbulb } from "lucide-react";
import CodeEditor from "./CodeEditor";

interface CSharpPracticeSectionProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
  unlocked: boolean;
}

const exercises = [
  {
    id: "1",
    title: "Variáveis e Tipos",
    description: "Crie variáveis para armazenar a pontuação do jogador e o nome do jogador.",
    theory: {
      title: "Variáveis e Tipos de Dados em C#",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">O que são variáveis?</h4>
            <p className="text-gray-300">
              Variáveis são espaços na memória do computador onde você pode armazenar dados. 
              Em C#, toda variável precisa ter um <strong>tipo</strong> e um <strong>nome</strong>.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Tipos Básicos em C#</h4>
            <div className="bg-steam-dark rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">int</code>
                <p className="text-gray-300 text-sm">Armazena números inteiros (ex: 0, 100, -50)</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">string</code>
                <p className="text-gray-300 text-sm">Armazena texto entre aspas (ex: "Jogador", "Hello")</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">bool</code>
                <p className="text-gray-300 text-sm">Armazena verdadeiro ou falso (true/false)</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">float</code>
                <p className="text-gray-300 text-sm">Armazena números decimais (ex: 3.14, 2.5)</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Como declarar variáveis</h4>
            <div className="bg-steam-dark rounded-lg p-4">
              <p className="text-gray-300 mb-2">Sintaxe básica:</p>
              <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm mb-2">
                tipo nomeDaVariavel = valor;
              </code>
              <p className="text-gray-400 text-sm mb-3">Exemplos:</p>
              <div className="space-y-2 font-mono text-sm">
                <div className="bg-steam-darker p-2 rounded">
                  <span className="text-steam-blueLight">int</span>{" "}
                  <span className="text-white">score</span> = <span className="text-yellow-400">0</span>;
                </div>
                <div className="bg-steam-darker p-2 rounded">
                  <span className="text-steam-blueLight">string</span>{" "}
                  <span className="text-white">playerName</span> = <span className="text-yellow-400">"Jogador"</span>;
                </div>
                <div className="bg-steam-darker p-2 rounded">
                  <span className="text-steam-blueLight">bool</span>{" "}
                  <span className="text-white">isAlive</span> = <span className="text-yellow-400">true</span>;
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas importantes</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Nomes de variáveis devem começar com letra minúscula</li>
              <li>Use nomes descritivos (score, playerName são melhores que x, y)</li>
              <li>Strings sempre ficam entre aspas duplas: "texto"</li>
              <li>Números inteiros não precisam de aspas: 100</li>
              <li>Não esqueça o ponto e vírgula (;) no final!</li>
            </ul>
          </div>
        </div>
      ),
    },
    template: `// Exercício 1: Criar variáveis
// Tarefa: Crie uma variável 'score' do tipo int com valor 0
// Crie uma variável 'playerName' do tipo string com valor "Jogador"

`,
    tests: (code: string) => {
      return code.includes("int") && code.includes("score") && code.includes("string");
    },
    xp: 20,
  },
  {
    id: "2",
    title: "Estrutura Condicional",
    description: "Crie uma estrutura if para verificar se o jogador ganhou (score >= 100).",
    theory: {
      title: "Estruturas Condicionais (if)",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">O que são condicionais?</h4>
            <p className="text-gray-300">
              Condicionais permitem que o programa tome decisões baseadas em condições. 
              O código só executa se a condição for verdadeira (true).
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Sintaxe do if</h4>
            <div className="bg-steam-dark rounded-lg p-4">
              <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm">
                if (condição) {'{'}<br />
                &nbsp;&nbsp;// código que executa se condição for verdadeira<br />
                {'}'}
              </code>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Operadores de Comparação</h4>
            <div className="bg-steam-dark rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">==</code>
                <p className="text-gray-300 text-sm">Igual a (ex: score == 100)</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">&gt;=</code>
                <p className="text-gray-300 text-sm">Maior ou igual a (ex: score &gt;= 100)</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">&lt;=</code>
                <p className="text-gray-300 text-sm">Menor ou igual a (ex: score &lt;= 50)</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">&gt;</code>
                <p className="text-gray-300 text-sm">Maior que (ex: score &gt; 0)</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">&lt;</code>
                <p className="text-gray-300 text-sm">Menor que (ex: score &lt; 0)</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
            <div className="bg-steam-dark rounded-lg p-4">
              <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
                <span className="text-steam-blueLight">int</span> score = <span className="text-yellow-400">100</span>;<br />
                <br />
                <span className="text-steam-blueLight">if</span> (score &gt;= <span className="text-yellow-400">100</span>) {'{'}<br />
                &nbsp;&nbsp;<span className="text-steam-blueLight">Console</span>.<span className="text-steam-green">WriteLine</span>(<span className="text-yellow-400">"Você ganhou!"</span>);<br />
                {'}'}
              </code>
              <p className="text-gray-400 text-sm mt-2">
                Este código verifica se score é maior ou igual a 100. Se for, imprime "Você ganhou!".
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Use chaves {'{}'} para delimitar o bloco de código do if</li>
              <li>A condição sempre fica entre parênteses ()</li>
              <li>Use == para comparar igualdade (não = que é para atribuir valor)</li>
              <li>Console.WriteLine() imprime texto na tela</li>
            </ul>
          </div>
        </div>
      ),
    },
    template: `// Exercício 2: Estrutura condicional
// Tarefa: Crie um if que verifica se score >= 100
// Se verdadeiro, imprima "Você ganhou!"

int score = 100;

`,
    tests: (code: string) => {
      return code.includes("if") && code.includes("score") && code.includes(">=");
    },
    xp: 30,
  },
  {
    id: "3",
    title: "Funções",
    description: "Crie uma função chamada 'AddScore' que adiciona pontos à pontuação.",
    theory: {
      title: "Funções em C#",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">O que são funções?</h4>
            <p className="text-gray-300">
              Funções são blocos de código reutilizáveis que realizam uma tarefa específica. 
              Elas podem receber dados (parâmetros) e retornar resultados.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Sintaxe básica</h4>
            <div className="bg-steam-dark rounded-lg p-4">
              <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm">
                tipoRetorno NomeDaFuncao(tipoParametro nomeParametro) {'{'}<br />
                &nbsp;&nbsp;// código da função<br />
                &nbsp;&nbsp;return valor; // se não for void<br />
                {'}'}
              </code>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Tipos de retorno</h4>
            <div className="bg-steam-dark rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">void</code>
                <p className="text-gray-300 text-sm">Função que não retorna nada (apenas executa código)</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">int</code>
                <p className="text-gray-300 text-sm">Função que retorna um número inteiro</p>
              </div>
              <div className="flex items-start gap-3">
                <code className="text-steam-green font-mono text-sm">string</code>
                <p className="text-gray-300 text-sm">Função que retorna texto</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
            <div className="bg-steam-dark rounded-lg p-4">
              <p className="text-gray-300 mb-2">Função que adiciona pontos ao score:</p>
              <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
                <span className="text-steam-blueLight">int</span> score = <span className="text-yellow-400">0</span>;<br />
                <br />
                <span className="text-steam-blueLight">void</span> <span className="text-steam-green">AddScore</span>(<span className="text-steam-blueLight">int</span> points) {'{'}<br />
                &nbsp;&nbsp;score = score + points;<br />
                {'}'}
              </code>
              <p className="text-gray-400 text-sm mt-2">
                Esta função recebe um número inteiro (points) e adiciona ao score. 
                Note que usamos score = score + points para somar os valores.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>void significa que a função não retorna valor</li>
              <li>Parâmetros ficam entre parênteses: (tipo nome)</li>
              <li>Use nomes descritivos para funções (AddScore é melhor que func1)</li>
              <li>score = score + points pode ser escrito como score += points</li>
              <li>Variáveis declaradas dentro da função só existem dentro dela</li>
            </ul>
          </div>
        </div>
      ),
    },
    template: `// Exercício 3: Criar função
// Tarefa: Crie uma função AddScore que recebe um int 'points' e retorna void
// Dentro da função, adicione 'points' ao 'score'

int score = 0;

`,
    tests: (code: string) => {
      return (
        code.includes("void") && code.includes("AddScore") && code.includes("int")
      );
    },
    xp: 50,
  },
];

export default function CSharpPracticeSection({
  onComplete,
  addXP,
  unlocked,
}: CSharpPracticeSectionProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [code, setCode] = useState(exercises[0].template);
  const [testResult, setTestResult] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [earnedXP, setEarnedXP] = useState(0);
  const [theoryRead, setTheoryRead] = useState<Record<string, boolean>>({});

  const handleTest = async () => {
    const exercise = exercises[currentExercise];
    
    // Verificar se leu a teoria primeiro
    if (exercise.theory && !theoryRead[exercise.id]) {
      setTestResult({
        passed: false,
        message: "Por favor, leia a teoria antes de testar o código.",
      });
      return;
    }
    
    const passed = exercise.tests(code);

    if (passed) {
      setTestResult({
        passed: true,
        message: "Parabéns! Código válido!",
      });

      if (!completedExercises.includes(exercise.id)) {
        setCompletedExercises((prev) => [...prev, exercise.id]);
        setEarnedXP((prev) => prev + exercise.xp);
        addXP(exercise.xp);
      }

      // Avançar automaticamente se não for o último
      setTimeout(() => {
        setCurrentExercise((prev) => {
          if (prev < exercises.length - 1) {
            const nextIndex = prev + 1;
            const nextExercise = exercises[nextIndex];
            setCode(nextExercise.template);
            setTestResult(null);
            return nextIndex;
          }
          return prev;
        });
      }, 2000);
    } else {
      setTestResult({
        passed: false,
        message: "Código não atende aos requisitos. Revise e tente novamente.",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Program_${currentExercise + 1}.cs`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allCompleted = completedExercises.length === exercises.length;

  if (!unlocked) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Complete a fase anterior para desbloquear esta seção.</p>
      </div>
    );
  }

  const exercise = exercises[currentExercise];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-steam-blueLight mb-2 flex items-center gap-3">
          <Code className="w-8 h-8" />
          Prática C# Guiada
        </h2>
        <p className="text-gray-300">
          Complete os exercícios sequenciais para aprender C# passo a passo.
        </p>
      </div>

      {/* Progresso */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">
            Exercício {currentExercise + 1} de {exercises.length}
          </span>
          <span className="text-steam-green font-semibold">
            XP Ganho: {earnedXP} pontos
          </span>
        </div>
        <div className="w-full bg-steam-dark rounded-full h-2">
          <div
            className="bg-steam-blueLight h-2 rounded-full transition-all"
            style={{
              width: `${(completedExercises.length / exercises.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Exercício Atual */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-2">{exercise.title}</h3>
        <p className="text-gray-300 mb-4">{exercise.description}</p>

        {/* Teoria e Exemplos */}
        {exercise.theory && !theoryRead[exercise.id] && (
          <div className="bg-gradient-to-r from-steam-blue/20 to-steam-green/20 border border-steam-blueLight rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-steam-blueLight" />
              <h4 className="text-2xl font-bold text-steam-blueLight">{exercise.theory.title}</h4>
            </div>
            <div className="text-gray-200 mb-6">{exercise.theory.content}</div>
            <div className="bg-steam-dark/50 rounded-lg p-4 border border-steam-blue">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">Dica:</span>
              </div>
              <p className="text-sm text-gray-300">
                Leia atentamente a teoria acima antes de começar a codificar. 
                Isso vai ajudar você a entender os conceitos e escrever código correto!
              </p>
            </div>
            <button
              onClick={() => setTheoryRead((prev) => ({ ...prev, [exercise.id]: true }))}
              className="mt-4 w-full px-6 py-3 bg-steam-blueLight hover:bg-steam-blue text-white rounded-lg font-semibold transition-colors"
            >
              Entendi! Vou praticar agora →
            </button>
          </div>
        )}

        {/* Mostrar teoria novamente (opcional) */}
        {exercise.theory && theoryRead[exercise.id] && (
          <div className="mb-4">
            <button
              onClick={() => setTheoryRead((prev) => ({ ...prev, [exercise.id]: false }))}
              className="text-sm text-steam-blueLight hover:text-steam-green transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Revisar teoria
            </button>
          </div>
        )}

        {/* Editor de Código */}
        {exercise.theory && !theoryRead[exercise.id] ? (
          <div className="mb-4 opacity-50 pointer-events-none">
            <CodeEditor value={code} onChange={setCode} language="csharp" />
            <div className="mt-2 text-center text-sm text-gray-400">
              Leia a teoria acima para desbloquear o editor
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <CodeEditor value={code} onChange={setCode} language="csharp" />
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleTest}
            className="flex items-center gap-2 px-6 py-3 bg-steam-green hover:bg-steam-green/80 text-white rounded-lg font-semibold transition-colors"
          >
            <Play className="w-5 h-5" />
            Testar Código
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-steam-blue hover:bg-steam-blue/80 text-white rounded-lg font-semibold transition-colors"
          >
            <Download className="w-5 h-5" />
            Baixar .cs
          </button>
        </div>

        {/* Resultado do Teste */}
        {testResult && (
          <div
            className={`rounded-lg p-4 border ${
              testResult.passed
                ? "bg-steam-green/20 border-steam-green text-steam-green"
                : "bg-red-500/20 border-red-500 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {testResult.passed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{testResult.message}</span>
            </div>
            {testResult.passed && !completedExercises.includes(exercise.id) && (
              <p className="mt-2 text-sm">+{exercise.xp} XP!</p>
            )}
          </div>
        )}

        {/* Navegação entre Exercícios */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              if (currentExercise > 0) {
                const prevIndex = currentExercise - 1;
                setCurrentExercise(prevIndex);
                const prevExercise = exercises[prevIndex];
                setCode(prevExercise.template);
                setTestResult(null);
              }
            }}
            disabled={currentExercise === 0}
            className="px-4 py-2 bg-steam-dark border border-steam-blue text-gray-300 rounded-lg hover:bg-steam-darker disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={() => {
              if (currentExercise < exercises.length - 1) {
                const nextIndex = currentExercise + 1;
                setCurrentExercise(nextIndex);
                const nextExercise = exercises[nextIndex];
                setCode(nextExercise.template);
                setTestResult(null);
              }
            }}
            disabled={currentExercise === exercises.length - 1}
            className="px-4 py-2 bg-steam-dark border border-steam-blue text-gray-300 rounded-lg hover:bg-steam-darker disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próximo →
          </button>
        </div>
      </div>

      {/* Exercícios Completos */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-3">Exercícios Completados</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {exercises.map((ex) => {
            const isCompleted = completedExercises.includes(ex.id);
            return (
              <div
                key={ex.id}
                className={`p-3 rounded-lg border ${
                  isCompleted
                    ? "bg-steam-green/10 border-steam-green"
                    : "bg-steam-dark border-steam-blue opacity-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${
                      isCompleted ? "text-steam-green" : "text-gray-400"
                    }`}
                  >
                    {ex.title}
                  </span>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-steam-green" />}
                </div>
                {isCompleted && (
                  <span className="text-sm text-yellow-400">+{ex.xp} XP</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conclusão */}
      {allCompleted && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-steam-blueLight to-steam-green text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Concluir Prática C# e Avançar →
          </button>
        </div>
      )}
    </div>
  );
}

