"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import CodeEditor from "@/components/atividade/CodeEditor";
import AntiCheatProtection from "@/components/atividade/AntiCheatProtection";
import { 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  Send,
  Clock,
  FileText,
  X
} from "lucide-react";
import { getLocalUserId, getLocalUserName, setLocalUserName } from "@/lib/local-user";

// Tipos de questões
interface Question {
  id: string;
  part: string;
  partTitle: string;
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
  }>;
  template: string;
  expectedOutput?: string; // Para validação automática (opcional)
}

// Versões da prova (3 versões diferentes)
const provaVersions: Record<number, Question[]> = {
  1: [
    // PARTE 1: ESTRUTURA SEQUENCIAL
    {
      id: "1.1",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.1: Cálculo de Valor a Pagar",
      description: `Fazer um programa para ler o código de uma peça 1, o número de peças 1, o valor unitário de cada peça 1, o código de uma peça 2, o número de peças 2 e o valor unitário de cada peça 2. Calcule e mostre o valor a ser pago.`,
      examples: [
        { input: "12 1 5.30\n16 2 5.10", output: "VALOR A PAGAR: R$ 15.50" },
        { input: "13 2 15.30\n161 4 5.20", output: "VALOR A PAGAR: R$ 51.40" },
        { input: "1 1 15.10\n2 1 15.10", output: "VALOR A PAGAR: R$ 30.20" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "1.2",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.2: Área do Círculo",
      description: `Faça um programa para ler o valor do raio de um círculo, e depois mostrar o valor da área deste círculo com quatro casas decimais conforme exemplos.\n\nFórmula: A = π * r²\n\nConsidere o valor de π = 3.14159`,
      examples: [
        { input: "2.00", output: "A=12.5664" },
        { input: "100.64", output: "A=31819.3103" },
        { input: "150.00", output: "A=70685.7750" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "1.3",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.3: Média Ponderada",
      description: `Leia três valores (A, B e C) e calcule a média ponderada onde A tem peso 2, B tem peso 3 e C tem peso 5. Mostre o resultado com 1 casa decimal.`,
      examples: [
        { input: "5.0\n6.0\n7.0", output: "MEDIA = 6.3" },
        { input: "10.0\n10.0\n5.0", output: "MEDIA = 8.3" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    // PARTE 2: ESTRUTURA CONDICIONAL
    {
      id: "2.1",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.1: Lanchonete",
      description: `Com base na tabela de preços abaixo, faça um programa que leia o código de um item e a quantidade deste item. A seguir, calcule e mostre o valor da conta a pagar.\n\nTabela:\n1 - Cachorro Quente - R$ 4.00\n2 - X-Salada - R$ 4.50\n3 - X-Bacon - R$ 5.00\n4 - Torrada simples - R$ 2.00\n5 - Refrigerante - R$ 1.50`,
      examples: [
        { input: "3 2", output: "Total: R$ 10.00" },
        { input: "2 3", output: "Total: R$ 13.50" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "2.2",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.2: Fórmula de Bhaskara",
      description: `Ler os valores dos três coeficientes "a", "b" e "c" de uma equação do segundo grau (ax² + bx + c = 0). Em seguida, mostrar os valores das raízes da equação, conforme exemplos, usando a fórmula de Bhaskara. Se a equação não possuir raízes (o valor de "a" não pode ser zero, e o valor de "delta" não pode ser negativo), mostrar uma mensagem "Impossivel calcular".\n\nFórmula: x = (-b ± √Δ) / 2a onde: Δ = b² - 4ac`,
      examples: [
        { input: "10.0 20.1 5.1", output: "X1 = -0.29788\nX2 = -1.71212" },
        { input: "0.0 20.0 5.0", output: "Impossivel calcular" },
        { input: "10.3 203.0 5.0", output: "X1 = -0.02466\nX2 = -19.68408" },
        { input: "10.0 3.0 5.0", output: "Impossivel calcular" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "2.3",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.3: Classificação de Idade",
      description: `Leia a idade de uma pessoa e classifique-a como:\n- Criança: 0 a 12 anos\n- Adolescente: 13 a 17 anos\n- Adulto: 18 a 64 anos\n- Idoso: 65 anos ou mais\n\nMostre a classificação correspondente.`,
      examples: [
        { input: "10", output: "Crianca" },
        { input: "15", output: "Adolescente" },
        { input: "30", output: "Adulto" },
        { input: "70", output: "Idoso" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    // PARTE 3: ESTRUTURAS REPETITIVAS
    {
      id: "3.1",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.1: Validação de Senha",
      description: `Escreva um programa que repita a leitura de uma senha até que ela seja válida. Para cada leitura de senha incorreta informada, escrever a mensagem "Senha Invalida". Quando a senha for informada corretamente deve ser impressa a mensagem "Acesso Permitido" e o algoritmo encerrado. Considere que a senha correta é o valor 2002.`,
      examples: [
        { input: "2200\n1020\n2022\n2002", output: "Senha Invalida\nSenha Invalida\nSenha Invalida\nAcesso Permitido" },
        { input: "2020\n1031\n2002", output: "Senha Invalida\nSenha Invalida\nAcesso Permitido" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "3.2",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.2: Valores no Intervalo",
      description: `Leia um valor inteiro N. Este valor será a quantidade de valores inteiros X que serão lidos em seguida. Mostre quantos destes valores X estão dentro do intervalo [10,20] e quantos estão fora do intervalo, mostrando essas informações conforme exemplo (use a palavra "in" para dentro do intervalo, e "out" para fora do intervalo).`,
      examples: [
        { input: "5\n14\n123\n10\n-25\n32", output: "2 in\n3 out" },
        { input: "4\n86\n35\n20\n7", output: "1 in\n3 out" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "3.3",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.3: Soma de Números Pares",
      description: `Leia um valor inteiro N. Em seguida, calcule e mostre a soma de todos os números pares de 1 até N (inclusive). Se N for menor que 2, mostre 0.`,
      examples: [
        { input: "10", output: "30" },
        { input: "5", output: "6" },
        { input: "1", output: "0" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    }
  ],
  2: [
    // Versão 2 - Mesmas questões mas com valores diferentes
    {
      id: "1.1",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.1: Cálculo de Valor a Pagar",
      description: `Fazer um programa para ler o código de uma peça 1, o número de peças 1, o valor unitário de cada peça 1, o código de uma peça 2, o número de peças 2 e o valor unitário de cada peça 2. Calcule e mostre o valor a ser pago.`,
      examples: [
        { input: "10 2 3.50\n20 3 4.20", output: "VALOR A PAGAR: R$ 19.60" },
        { input: "5 1 10.00\n15 2 8.50", output: "VALOR A PAGAR: R$ 27.00" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "1.2",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.2: Área do Círculo",
      description: `Faça um programa para ler o valor do raio de um círculo, e depois mostrar o valor da área deste círculo com quatro casas decimais conforme exemplos.\n\nFórmula: A = π * r²\n\nConsidere o valor de π = 3.14159`,
      examples: [
        { input: "3.50", output: "A=38.4845" },
        { input: "50.25", output: "A=7927.7859" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "1.3",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.3: Média Ponderada",
      description: `Leia três valores (A, B e C) e calcule a média ponderada onde A tem peso 2, B tem peso 3 e C tem peso 5. Mostre o resultado com 1 casa decimal.`,
      examples: [
        { input: "7.5\n8.0\n6.5", output: "MEDIA = 7.3" },
        { input: "9.0\n9.5\n8.0", output: "MEDIA = 8.8" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "2.1",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.1: Lanchonete",
      description: `Com base na tabela de preços abaixo, faça um programa que leia o código de um item e a quantidade deste item. A seguir, calcule e mostre o valor da conta a pagar.\n\nTabela:\n1 - Cachorro Quente - R$ 4.00\n2 - X-Salada - R$ 4.50\n3 - X-Bacon - R$ 5.00\n4 - Torrada simples - R$ 2.00\n5 - Refrigerante - R$ 1.50`,
      examples: [
        { input: "1 4", output: "Total: R$ 16.00" },
        { input: "5 5", output: "Total: R$ 7.50" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "2.2",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.2: Fórmula de Bhaskara",
      description: `Ler os valores dos três coeficientes "a", "b" e "c" de uma equação do segundo grau (ax² + bx + c = 0). Em seguida, mostrar os valores das raízes da equação, conforme exemplos, usando a fórmula de Bhaskara. Se a equação não possuir raízes (o valor de "a" não pode ser zero, e o valor de "delta" não pode ser negativo), mostrar uma mensagem "Impossivel calcular".\n\nFórmula: x = (-b ± √Δ) / 2a onde: Δ = b² - 4ac`,
      examples: [
        { input: "5.0 10.0 2.0", output: "X1 = -0.22543\nX2 = -1.77457" },
        { input: "0.0 5.0 3.0", output: "Impossivel calcular" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "2.3",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.3: Classificação de Idade",
      description: `Leia a idade de uma pessoa e classifique-a como:\n- Criança: 0 a 12 anos\n- Adolescente: 13 a 17 anos\n- Adulto: 18 a 64 anos\n- Idoso: 65 anos ou mais\n\nMostre a classificação correspondente.`,
      examples: [
        { input: "8", output: "Crianca" },
        { input: "16", output: "Adolescente" },
        { input: "25", output: "Adulto" },
        { input: "68", output: "Idoso" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "3.1",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.1: Validação de Senha",
      description: `Escreva um programa que repita a leitura de uma senha até que ela seja válida. Para cada leitura de senha incorreta informada, escrever a mensagem "Senha Invalida". Quando a senha for informada corretamente deve ser impressa a mensagem "Acesso Permitido" e o algoritmo encerrado. Considere que a senha correta é o valor 2002.`,
      examples: [
        { input: "1234\n5678\n2002", output: "Senha Invalida\nSenha Invalida\nAcesso Permitido" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "3.2",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.2: Valores no Intervalo",
      description: `Leia um valor inteiro N. Este valor será a quantidade de valores inteiros X que serão lidos em seguida. Mostre quantos destes valores X estão dentro do intervalo [10,20] e quantos estão fora do intervalo, mostrando essas informações conforme exemplo (use a palavra "in" para dentro do intervalo, e "out" para fora do intervalo).`,
      examples: [
        { input: "3\n15\n25\n5", output: "1 in\n2 out" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "3.3",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.3: Soma de Números Pares",
      description: `Leia um valor inteiro N. Em seguida, calcule e mostre a soma de todos os números pares de 1 até N (inclusive). Se N for menor que 2, mostre 0.`,
      examples: [
        { input: "8", output: "20" },
        { input: "15", output: "56" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    }
  ],
  3: [
    // Versão 3 - Mesmas questões mas com valores diferentes
    {
      id: "1.1",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.1: Cálculo de Valor a Pagar",
      description: `Fazer um programa para ler o código de uma peça 1, o número de peças 1, o valor unitário de cada peça 1, o código de uma peça 2, o número de peças 2 e o valor unitário de cada peça 2. Calcule e mostre o valor a ser pago.`,
      examples: [
        { input: "25 3 2.50\n30 1 6.00", output: "VALOR A PAGAR: R$ 13.50" },
        { input: "8 4 1.25\n12 2 3.75", output: "VALOR A PAGAR: R$ 12.50" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "1.2",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.2: Área do Círculo",
      description: `Faça um programa para ler o valor do raio de um círculo, e depois mostrar o valor da área deste círculo com quatro casas decimais conforme exemplos.\n\nFórmula: A = π * r²\n\nConsidere o valor de π = 3.14159`,
      examples: [
        { input: "4.50", output: "A=63.6173" },
        { input: "75.30", output: "A=17801.2800" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "1.3",
      part: "PARTE 1",
      partTitle: "ESTRUTURA SEQUENCIAL",
      title: "Exercício 1.3: Média Ponderada",
      description: `Leia três valores (A, B e C) e calcule a média ponderada onde A tem peso 2, B tem peso 3 e C tem peso 5. Mostre o resultado com 1 casa decimal.`,
      examples: [
        { input: "8.0\n7.5\n9.0", output: "MEDIA = 8.3" },
        { input: "6.5\n7.0\n8.5", output: "MEDIA = 7.6" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "2.1",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.1: Lanchonete",
      description: `Com base na tabela de preços abaixo, faça um programa que leia o código de um item e a quantidade deste item. A seguir, calcule e mostre o valor da conta a pagar.\n\nTabela:\n1 - Cachorro Quente - R$ 4.00\n2 - X-Salada - R$ 4.50\n3 - X-Bacon - R$ 5.00\n4 - Torrada simples - R$ 2.00\n5 - Refrigerante - R$ 1.50`,
      examples: [
        { input: "4 6", output: "Total: R$ 12.00" },
        { input: "3 1", output: "Total: R$ 5.00" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "2.2",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.2: Fórmula de Bhaskara",
      description: `Ler os valores dos três coeficientes "a", "b" e "c" de uma equação do segundo grau (ax² + bx + c = 0). Em seguida, mostrar os valores das raízes da equação, conforme exemplos, usando a fórmula de Bhaskara. Se a equação não possuir raízes (o valor de "a" não pode ser zero, e o valor de "delta" não pode ser negativo), mostrar uma mensagem "Impossivel calcular".\n\nFórmula: x = (-b ± √Δ) / 2a onde: Δ = b² - 4ac`,
      examples: [
        { input: "2.0 8.0 3.0", output: "X1 = -0.41886\nX2 = -3.58114" },
        { input: "1.0 2.0 5.0", output: "Impossivel calcular" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "2.3",
      part: "PARTE 2",
      partTitle: "ESTRUTURA CONDICIONAL",
      title: "Exercício 2.3: Classificação de Idade",
      description: `Leia a idade de uma pessoa e classifique-a como:\n- Criança: 0 a 12 anos\n- Adolescente: 13 a 17 anos\n- Adulto: 18 a 64 anos\n- Idoso: 65 anos ou mais\n\nMostre a classificação correspondente.`,
      examples: [
        { input: "5", output: "Crianca" },
        { input: "14", output: "Adolescente" },
        { input: "40", output: "Adulto" },
        { input: "75", output: "Idoso" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "3.1",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.1: Validação de Senha",
      description: `Escreva um programa que repita a leitura de uma senha até que ela seja válida. Para cada leitura de senha incorreta informada, escrever a mensagem "Senha Invalida". Quando a senha for informada corretamente deve ser impressa a mensagem "Acesso Permitido" e o algoritmo encerrado. Considere que a senha correta é o valor 2002.`,
      examples: [
        { input: "1111\n2222\n3333\n2002", output: "Senha Invalida\nSenha Invalida\nSenha Invalida\nAcesso Permitido" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "3.2",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.2: Valores no Intervalo",
      description: `Leia um valor inteiro N. Este valor será a quantidade de valores inteiros X que serão lidos em seguida. Mostre quantos destes valores X estão dentro do intervalo [10,20] e quantos estão fora do intervalo, mostrando essas informações conforme exemplo (use a palavra "in" para dentro do intervalo, e "out" para fora do intervalo).`,
      examples: [
        { input: "6\n12\n18\n25\n30\n5\n15", output: "3 in\n3 out" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    },
    {
      id: "3.3",
      part: "PARTE 3",
      partTitle: "ESTRUTURAS REPETITIVAS",
      title: "Exercício 3.3: Soma de Números Pares",
      description: `Leia um valor inteiro N. Em seguida, calcule e mostre a soma de todos os números pares de 1 até N (inclusive). Se N for menor que 2, mostre 0.`,
      examples: [
        { input: "12", output: "42" },
        { input: "20", output: "110" }
      ],
      template: `using System;

class Program {
    static void Main() {
        // Seu código aqui
    }
}`
    }
  ]
};

export default function ProvaLogicaProgramacaoPage() {
  const { showToast } = useToast();
  const [userId] = useState(() => getLocalUserId());
  const [userName, setUserName] = useState(() => getLocalUserName());
  const [studentId, setStudentId] = useState("");
  const [showIdentification, setShowIdentification] = useState(true);
  const [provaVersion, setProvaVersion] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>({});
  const [violations, setViolations] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Selecionar versão aleatória da prova baseada no ID do aluno
  useEffect(() => {
    if (studentId && !provaVersion) {
      // Usar hash simples do studentId para determinar versão (1, 2 ou 3)
      const hash = studentId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const version = (hash % 3) + 1;
      setProvaVersion(version);
    }
  }, [studentId, provaVersion]);

  // Auto-salvar respostas periodicamente
  useEffect(() => {
    if (!autoSaveEnabled || !provaVersion || Object.keys(answers).length === 0) return;

    const autoSaveInterval = setInterval(async () => {
      await saveAnswers(false);
      setLastSaved(new Date());
    }, 30000); // Salvar a cada 30 segundos

    return () => clearInterval(autoSaveInterval);
  }, [answers, provaVersion, autoSaveEnabled]);

  // Contador de tempo decorrido
  useEffect(() => {
    if (!startTime || submitted) return;

    const timeInterval = setInterval(() => {
      if (startTime) {
        const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [startTime, submitted]);

  // Prevenir saída acidental da página
  useEffect(() => {
    if (submitted || showIdentification) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitted, showIdentification]);

  const handleIdentificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      showToast("Por favor, informe sua identificação", "warning");
      return;
    }
    setShowIdentification(false);
    setStartTime(new Date());
    setLocalUserName(studentId.trim());
    setUserName(studentId.trim());
    showToast("Prova iniciada! Boa sorte!", "success");
  };

  const handleAnswerChange = (questionId: string, code: string) => {
    if (!provaVersion) return;
    
    // Não salvar se for apenas o template (sem modificações do aluno)
    const questions = provaVersions[provaVersion];
    const currentQ = questions.find(q => q.id === questionId);
    
    if (currentQ && code.trim() === currentQ.template.trim()) {
      // Se o código for igual ao template, não salvar como resposta
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
      return;
    }
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  };

  const handleViolation = (type: string) => {
    setViolations((prev) => {
      if (!prev.includes(type)) {
        return [...prev, type];
      }
      return prev;
    });
  };

  const saveAnswers = async (showMessage = true) => {
    if (!provaVersion) return;

    try {
      const response = await fetch("/api/prova-logica-programacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          studentId,
          userName,
          provaVersion,
          answers,
          violations,
          startTime: startTime?.toISOString(),
          lastSaved: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLastSaved(new Date());
        if (showMessage) {
          if (data.warning) {
            // Não mostrar aviso para auto-salvamento, apenas para envio final
            console.log("Auto-salvamento: Firebase não disponível, salvo localmente");
          } else {
            showToast("Respostas salvas automaticamente", "success");
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "Erro ao salvar");
      }
    } catch (error: any) {
      console.error("Erro ao salvar respostas:", error);
      // Não mostrar erro para auto-salvamento silencioso
      if (showMessage) {
        showToast("Erro ao salvar respostas", "error");
      }
    }
  };

  const handleSubmit = async () => {
    if (!provaVersion) return;

    const questions = provaVersions[provaVersion];
    // Filtrar respostas que são apenas o template (não consideradas respostas válidas)
    const validAnswers = Object.entries(answers).filter(([qId, code]) => {
      const question = questions.find(q => q.id === qId);
      return question && code && code.trim() !== "" && code.trim() !== question.template.trim();
    });
    
    const unansweredQuestions = questions.filter((q) => {
      const answer = answers[q.id];
      return !answer || answer.trim() === "" || answer.trim() === q.template.trim();
    });

    if (unansweredQuestions.length > 0) {
      setShowConfirmModal(true);
      return;
    }

    handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    if (!provaVersion) return;
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const endTime = new Date();
      const response = await fetch("/api/prova-logica-programacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          studentId,
          userName,
          provaVersion,
          answers,
          violations,
          startTime: startTime?.toISOString(),
          endTime: endTime.toISOString(),
          submitted: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitted(true);
        showToast("Prova enviada com sucesso! 🎉", "success");
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || errorData.error || "Erro ao enviar prova";
        const suggestion = errorData.suggestion || "";
        
        // Se for erro de configuração do Firebase, mostrar mensagem mais clara
        if (errorMessage.includes("Firebase não configurado") || errorMessage.includes("FIREBASE_SERVICE_ACCOUNT_KEY")) {
          showToast(
            "Erro: Firebase não está configurado. Verifique a configuração.",
            "error"
          );
          console.error("Erro de configuração do Firebase:", errorMessage);
          console.error("Sugestão:", suggestion);
          alert(
            "⚠️ Firebase não está configurado!\n\n" +
            "Para salvar as provas no Firebase, você precisa:\n\n" +
            "1. Configurar FIREBASE_SERVICE_ACCOUNT_KEY nas variáveis de ambiente\n" +
            "2. Ou configurar NEXT_PUBLIC_FIREBASE_* para usar Client SDK\n\n" +
            "Veja a documentação em: docs/CONFIGURACAO_FIREBASE.md"
          );
        } else {
          throw new Error(errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Erro ao enviar prova:", error);
      showToast(
        error?.message || "Erro ao enviar prova. Tente novamente.", 
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = provaVersion ? provaVersions[provaVersion] : [];
  const currentQ = questions[currentQuestion];
  
  // Calcular progresso
  const answeredCount = questions.filter((q) => {
    const answer = answers[q.id];
    return answer && answer.trim() !== "" && answer.trim() !== q.template.trim();
  }).length;
  
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  
  // Formatar tempo decorrido
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Formatar última vez salvo
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    if (diff < 60) return "agora mesmo";
    if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
    return `há ${Math.floor(diff / 3600)} h`;
  };

  if (showIdentification) {
    return (
      <div className="min-h-screen bg-senai-blueDark flex items-center justify-center p-4">
        <div className="bg-senai-dark border border-senai-blue rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <BookOpen className="w-16 h-16 text-senai-orange mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Prova de Lógica de Programação</h1>
            <p className="text-gray-300">Avaliação de Conhecimentos em C#</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-semibold mb-1">Instruções Importantes:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-100">
                  <li>Você receberá uma versão única da prova</li>
                  <li>Você pode navegar livremente entre as questões - não há limite de tempo</li>
                  <li>O sistema detecta tentativas de cola</li>
                  <li>As respostas são salvas automaticamente</li>
                  <li><strong className="text-red-300">ATENÇÃO:</strong> Ctrl+C, Ctrl+V e Ctrl+X estão bloqueados durante a prova</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleIdentificationSubmit} className="space-y-4">
            <div>
              <label htmlFor="studentId" className="block text-sm font-semibold text-white mb-2">
                Identificação do Aluno <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Digite seu nome ou número de matrícula"
                className="w-full bg-senai-blueDark border border-senai-blue rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange"
                required
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">
                Use seu nome completo ou número de matrícula para identificação
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-senai-orange to-senai-blueLight text-slate-950 rounded-lg px-6 py-3 font-semibold hover:shadow-lg transition-all"
            >
              Iniciar Prova
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-senai-blueDark flex items-center justify-center p-4">
        <div className="bg-senai-dark border-2 border-senai-blueLight rounded-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-senai-blueLight mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Prova Enviada com Sucesso! 🎉</h2>
          <p className="text-gray-300 mb-6">
            Suas respostas foram salvas e serão avaliadas pelo professor.
          </p>
          <div className="bg-senai-blueDark rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">
              <strong className="text-senai-orange">Aluno:</strong> {studentId}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <strong className="text-senai-orange">Versão da Prova:</strong> {provaVersion}
            </p>
            {violations.length > 0 && (
              <p className="text-sm text-yellow-400 mt-2">
                <strong>Avisos de Segurança:</strong> {violations.length} evento(s) registrado(s)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-senai-blueDark">
      <AntiCheatProtection onViolation={handleViolation} enabled={true} />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-senai-blueDark via-orange-800 to-senai-blue rounded-lg p-4 mb-4 text-white">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-2xl font-bold">Prova de Lógica de Programação</h1>
              <p className="text-sm text-gray-200">
                Aluno: <strong>{studentId}</strong> | Versão: <strong>{provaVersion}</strong>
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <FileText className="w-4 h-4" />
                <span className="text-sm">{answeredCount}/{questions.length} respondidas</span>
              </div>
              {lastSaved && (
                <div className="text-xs text-white/70">
                  Salvo {formatLastSaved()}
                </div>
              )}
              {violations.length > 0 && (
                <div className="flex items-center gap-2 text-yellow-300">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{violations.length} aviso(s)</span>
                </div>
              )}
              <button
                onClick={() => saveAnswers(true)}
                className="flex items-center gap-2 px-4 py-2 bg-senai-blue hover:bg-orange-800 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm">Salvar</span>
              </button>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-white/80 mb-1">
              <span>Progresso: {answeredCount} de {questions.length} questões</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-senai-blueDark/50 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navegação de Questões */}
        <div className="bg-senai-dark border border-senai-blue rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Questões</h2>
            <p className="text-xs text-gray-400">
              Você pode navegar livremente entre as questões
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => {
              const answer = answers[q.id];
              // Verificar se há resposta válida (diferente do template)
              const hasValidAnswer = answer && 
                                    answer.trim() !== "" && 
                                    answer.trim() !== q.template.trim();
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? "bg-senai-orange text-slate-950"
                      : hasValidAnswer
                      ? "bg-senai-blueLight/20 text-senai-blueLight border border-senai-blueLight"
                      : "bg-senai-blueDark text-gray-300 border border-senai-blue hover:bg-senai-blue"
                  }`}
                  title={`Questão ${q.id} - ${hasValidAnswer ? "Respondida" : "Não respondida"}`}
                >
                  {q.id} {hasValidAnswer && "✓"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questão Atual - Layout Lado a Lado */}
        {currentQ && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 h-[calc(100vh-300px)]">
            {/* Coluna Esquerda: Enunciado da Questão */}
            <div className="bg-senai-dark border border-senai-blue rounded-lg p-6 overflow-y-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-senai-blue text-white rounded-lg text-sm font-semibold">
                  {currentQ.part}
                </span>
                <span className="text-sm text-gray-400">{currentQ.partTitle}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{currentQ.title}</h3>
              <p className="text-gray-300 whitespace-pre-line mb-4 leading-relaxed">{currentQ.description}</p>

              {/* Exemplos */}
              <div className="bg-senai-blueDark rounded-lg p-4">
                <h4 className="text-sm font-semibold text-senai-orange mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Exemplos:
                </h4>
                <div className="space-y-3">
                  {currentQ.examples.map((ex, idx) => (
                    <div key={idx} className="border-l-2 border-senai-blue pl-3">
                      <p className="text-xs text-gray-400 mb-1 font-semibold">
                        Exemplo {idx + 1}:
                      </p>
                      <p className="text-xs text-gray-400 mb-1">
                        <strong>Entrada:</strong>
                      </p>
                      <pre className="text-xs text-gray-300 bg-senai-dark p-2 rounded mb-2 font-mono overflow-x-auto">
                        {ex.input}
                      </pre>
                      <p className="text-xs text-gray-400 mb-1">
                        <strong>Saída:</strong>
                      </p>
                      <pre className="text-xs text-senai-blueLight bg-senai-dark p-2 rounded font-mono overflow-x-auto">
                        {ex.output}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Direita: Editor de Código (Maior) */}
            <div className="bg-senai-dark border border-senai-blue rounded-lg p-4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Seu Código C#:
                </label>
                {(() => {
                  const answer = answers[currentQ.id];
                  const hasValidAnswer = answer && 
                                        answer.trim() !== "" && 
                                        answer.trim() !== currentQ.template.trim();
                  return hasValidAnswer && (
                    <span className="text-xs text-senai-blueLight flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Respondida
                    </span>
                  );
                })()}
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  value={
                    // Se já interagiu com esta questão, usar a resposta (mesmo que vazia)
                    // Caso contrário, mostrar o template inicial
                    hasInteracted[currentQ.id] 
                      ? (answers[currentQ.id] ?? "") 
                      : (answers[currentQ.id] || currentQ.template)
                  }
                  onChange={(code) => {
                    const questionId = currentQ.id;
                    // Marcar que o aluno interagiu com esta questão
                    if (!hasInteracted[questionId]) {
                      setHasInteracted((prev) => ({
                        ...prev,
                        [questionId]: true,
                      }));
                    }

                    // Sempre salvar o código atual (mesmo que vazio)
                    // Se for igual ao template e não houver resposta anterior, não salvar como resposta válida
                    if (code.trim() === currentQ.template.trim() && !answers[questionId]) {
                      // Não salvar template como resposta
                      setAnswers((prev) => {
                        const newAnswers = { ...prev };
                        delete newAnswers[questionId];
                        return newAnswers;
                      });
                    } else {
                      // Salvar a resposta (pode ser vazia se o aluno apagou tudo)
                      setAnswers((prev) => ({
                        ...prev,
                        [questionId]: code,
                      }));
                    }
                  }}
                  language="csharp"
                />
              </div>
            </div>
          </div>
        )}

        {/* Botões de Navegação e Envio */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-senai-blueDark border border-senai-blue text-white rounded-lg hover:bg-senai-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1}
              className="px-4 py-2 bg-senai-blueDark border border-senai-blue text-white rounded-lg hover:bg-senai-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-senai-blueLight to-senai-orange text-slate-950 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Enviar Prova</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-senai-dark border-2 border-yellow-600 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Confirmar Envio</h3>
                <p className="text-gray-300 mb-4">
                  Você ainda não respondeu {questions.filter((q) => {
                    const answer = answers[q.id];
                    return !answer || answer.trim() === "" || answer.trim() === q.template.trim();
                  }).length} questão(ões). Deseja enviar mesmo assim?
                </p>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-senai-blueDark border border-senai-blue text-white rounded-lg hover:bg-senai-blue transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-senai-blueLight to-senai-orange text-slate-950 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando..." : "Sim, Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

