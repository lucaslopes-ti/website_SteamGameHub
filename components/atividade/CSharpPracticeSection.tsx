"use client";

import React, { useState } from "react";
import { Code, CheckCircle, Download, Play, XCircle, BookOpen, Lightbulb } from "lucide-react";
import CodeEditor from "./CodeEditor";

interface CSharpPracticeSectionProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
  unlocked: boolean;
}

// Componentes de teoria como funções (evita problemas de serialização)
const TheoryContent1 = () => (
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
);

const TheoryContent2 = () => (
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
);

const TheoryContent3 = () => (
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
);

const TheoryContent4 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">O que são loops for?</h4>
      <p className="text-gray-300">
        O loop <code className="text-steam-green">for</code> repete um bloco de código um número específico de vezes. 
        É perfeito quando você sabe quantas vezes quer repetir algo.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Sintaxe do for</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm">
          for (inicialização; condição; incremento) {'{'}<br />
          &nbsp;&nbsp;// código que repete<br />
          {'}'}
        </code>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">for</span> (<span className="text-steam-blueLight">int</span> i = <span className="text-yellow-400">0</span>; i &lt; <span className="text-yellow-400">10</span>; i++) {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">Console</span>.<span className="text-steam-green">WriteLine</span>(i);<br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          Este loop imprime números de 0 a 9. A variável i começa em 0, continua enquanto i &lt; 10, e incrementa i++ a cada repetição.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>i++ é o mesmo que i = i + 1</li>
        <li>i-- decrementa (diminui) o valor</li>
        <li>Use i, j, k como nomes comuns para variáveis de loop</li>
        <li>Cuidado com loops infinitos! Sempre tenha uma condição que eventualmente seja falsa</li>
      </ul>
    </div>
  </div>
);

const TheoryContent5 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">O que são loops while?</h4>
      <p className="text-gray-300">
        O loop <code className="text-steam-green">while</code> repete um bloco de código enquanto uma condição for verdadeira. 
        É útil quando você não sabe quantas vezes precisa repetir.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Sintaxe do while</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm">
          while (condição) {'{'}<br />
          &nbsp;&nbsp;// código que repete enquanto condição for true<br />
          {'}'}
        </code>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">int</span> count = <span className="text-yellow-400">0</span>;<br />
          <span className="text-steam-blueLight">while</span> (count &lt; <span className="text-yellow-400">5</span>) {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">Console</span>.<span className="text-steam-green">WriteLine</span>(<span className="text-yellow-400">"Contagem: "</span> + count);<br />
          &nbsp;&nbsp;count++;<br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          Este loop imprime "Contagem: 0" até "Contagem: 4". Importante: sempre incremente a variável dentro do loop!
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>Certifique-se de que a condição eventualmente se torne falsa</li>
        <li>Se não, você terá um loop infinito!</li>
        <li>Use while quando não souber quantas vezes repetir</li>
        <li>Use for quando souber o número exato de repetições</li>
      </ul>
    </div>
  </div>
);

const TheoryContent6 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">O que são arrays?</h4>
      <p className="text-gray-300">
        Arrays são coleções de elementos do mesmo tipo armazenados em sequência. 
        Cada elemento tem um índice (posição) começando em 0.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Como declarar arrays</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm mb-2">
          tipo[] nomeDoArray = new tipo[tamanho];
        </code>
        <p className="text-gray-400 text-sm mb-3">Ou inicializar diretamente:</p>
        <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm">
          tipo[] nomeDoArray = {'{'}valor1, valor2, valor3{'}'};
        </code>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">int</span>[] scores = <span className="text-steam-blueLight">new</span> <span className="text-steam-blueLight">int</span>[<span className="text-yellow-400">5</span>];<br />
          scores[<span className="text-yellow-400">0</span>] = <span className="text-yellow-400">100</span>;<br />
          scores[<span className="text-yellow-400">1</span>] = <span className="text-yellow-400">200</span>;<br />
          <br />
          <span className="text-gray-500">// Ou inicializar diretamente:</span><br />
          <span className="text-steam-blueLight">int</span>[] scores = {'{'}<span className="text-yellow-400">100</span>, <span className="text-yellow-400">200</span>, <span className="text-yellow-400">150</span>{'}'};
        </code>
        <p className="text-gray-400 text-sm mt-2">
          O primeiro elemento está no índice 0, o segundo no índice 1, e assim por diante.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>Índices sempre começam em 0, não em 1!</li>
        <li>Use scores.Length para obter o tamanho do array</li>
        <li>Cuidado com índices fora dos limites (erro comum!)</li>
        <li>Arrays têm tamanho fixo após criação</li>
      </ul>
    </div>
  </div>
);

const TheoryContent7 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Operadores Lógicos</h4>
      <p className="text-gray-300">
        Operadores lógicos permitem combinar múltiplas condições em uma única expressão.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Operadores principais</h4>
      <div className="bg-steam-dark rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">&&</code>
          <p className="text-gray-300 text-sm">E (AND) - ambas condições devem ser verdadeiras</p>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">||</code>
          <p className="text-gray-300 text-sm">OU (OR) - pelo menos uma condição deve ser verdadeira</p>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">!</code>
          <p className="text-gray-300 text-sm">NÃO (NOT) - inverte o valor booleano</p>
        </div>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">int</span> score = <span className="text-yellow-400">150</span>;<br />
          <span className="text-steam-blueLight">bool</span> hasPowerUp = <span className="text-yellow-400">true</span>;<br />
          <br />
          <span className="text-steam-blueLight">if</span> (score &gt;= <span className="text-yellow-400">100</span> && hasPowerUp) {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">Console</span>.<span className="text-steam-green">WriteLine</span>(<span className="text-yellow-400">"Você ganhou!"</span>);<br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          Este código só executa se score for maior ou igual a 100 E hasPowerUp for true.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>&& significa "e" - ambas condições precisam ser verdadeiras</li>
        <li>|| significa "ou" - pelo menos uma precisa ser verdadeira</li>
        <li>! inverte: !true = false, !false = true</li>
        <li>Use parênteses para agrupar condições complexas</li>
      </ul>
    </div>
  </div>
);

const TheoryContent8 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">O que é switch/case?</h4>
      <p className="text-gray-300">
        O <code className="text-steam-green">switch</code> é uma alternativa ao if/else quando você precisa verificar múltiplos valores da mesma variável.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Sintaxe do switch</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm">
          switch (variável) {'{'}<br />
          &nbsp;&nbsp;case valor1:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;// código<br />
          &nbsp;&nbsp;&nbsp;&nbsp;break;<br />
          &nbsp;&nbsp;case valor2:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;// código<br />
          &nbsp;&nbsp;&nbsp;&nbsp;break;<br />
          &nbsp;&nbsp;default:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;// código padrão<br />
          {'}'}
        </code>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">int</span> level = <span className="text-yellow-400">2</span>;<br />
          <span className="text-steam-blueLight">switch</span> (level) {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">case</span> <span className="text-yellow-400">1</span>:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-steam-blueLight">Console</span>.<span className="text-steam-green">WriteLine</span>(<span className="text-yellow-400">"Nível 1"</span>);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-steam-blueLight">break</span>;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">case</span> <span className="text-yellow-400">2</span>:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-steam-blueLight">Console</span>.<span className="text-steam-green">WriteLine</span>(<span className="text-yellow-400">"Nível 2"</span>);<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-steam-blueLight">break</span>;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">default</span>:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-steam-blueLight">Console</span>.<span className="text-steam-green">WriteLine</span>(<span className="text-yellow-400">"Outro nível"</span>);<br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          O switch verifica o valor de level e executa o código correspondente. O default é executado se nenhum case corresponder.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>Sempre use break após cada case (exceto em casos especiais)</li>
        <li>default é opcional mas recomendado</li>
        <li>Use switch quando tiver muitas condições para a mesma variável</li>
        <li>Mais legível que múltiplos if/else aninhados</li>
      </ul>
    </div>
  </div>
);

const TheoryContent9 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">O que são classes?</h4>
      <p className="text-gray-300">
        Classes são modelos (templates) para criar objetos. Elas definem propriedades (variáveis) e métodos (funções) que os objetos terão.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Sintaxe básica</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm">
          <span className="text-steam-blueLight">class</span> NomeDaClasse {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> tipo propriedade;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> tipoRetorno Metodo() {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;// código<br />
          &nbsp;&nbsp;{'}'}<br />
          {'}'}
        </code>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">class</span> <span className="text-steam-green">Player</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">string</span> name;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">int</span> score;<br />
          <br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">void</span> <span className="text-steam-green">AddScore</span>(<span className="text-steam-blueLight">int</span> points) {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;score += points;<br />
          &nbsp;&nbsp;{'}'}<br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          Esta classe Player tem duas propriedades (name e score) e um método (AddScore). Você pode criar objetos Player usando: Player p = new Player();
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>public significa que pode ser acessado de fora da classe</li>
        <li>Use new para criar objetos: Player p = new Player();</li>
        <li>Classes são a base da programação orientada a objetos</li>
        <li>Propriedades armazenam dados, métodos fazem ações</li>
      </ul>
    </div>
  </div>
);

const TheoryContent10 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Métodos de String</h4>
      <p className="text-gray-300">
        Strings em C# têm muitos métodos úteis para manipular texto. Você pode concatenar, converter, verificar tamanho e muito mais.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Métodos comuns</h4>
      <div className="bg-steam-dark rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">.Length</code>
          <p className="text-gray-300 text-sm">Retorna o tamanho da string</p>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">.ToUpper()</code>
          <p className="text-gray-300 text-sm">Converte para maiúsculas</p>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">.ToLower()</code>
          <p className="text-gray-300 text-sm">Converte para minúsculas</p>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">.Contains()</code>
          <p className="text-gray-300 text-sm">Verifica se contém um texto</p>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">+</code>
          <p className="text-gray-300 text-sm">Concatena strings</p>
        </div>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">string</span> name = <span className="text-yellow-400">"Jogador"</span>;<br />
          <span className="text-steam-blueLight">string</span> upper = name.<span className="text-steam-green">ToUpper</span>(); <span className="text-gray-500">// "JOGADOR"</span><br />
          <span className="text-steam-blueLight">int</span> length = name.<span className="text-steam-green">Length</span>; <span className="text-gray-500">// 7</span><br />
          <span className="text-steam-blueLight">bool</span> hasJ = name.<span className="text-steam-green">Contains</span>(<span className="text-yellow-400">"J"</span>); <span className="text-gray-500">// true</span><br />
          <span className="text-steam-blueLight">string</span> full = name + <span className="text-yellow-400">" #1"</span>; <span className="text-gray-500">// "Jogador #1"</span>
        </code>
        <p className="text-gray-400 text-sm mt-2">
          Métodos de string retornam novos valores sem modificar a string original (strings são imutáveis).
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>Use + para juntar strings: "Olá" + " " + "Mundo"</li>
        <li>Length não tem parênteses (é uma propriedade, não método)</li>
        <li>ToUpper() e ToLower() retornam novas strings</li>
        <li>Contains() retorna true ou false</li>
      </ul>
    </div>
  </div>
);

const TheoryContent11 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Posicionamento em Jogos</h4>
      <p className="text-gray-300">
        Em jogos digitais, precisamos rastrear a posição dos objetos na tela usando coordenadas X e Y. 
        Essas coordenadas representam a posição horizontal (X) e vertical (Y) do objeto.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Sistema de Coordenadas</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <p className="text-gray-300 mb-2">Em jogos 2D:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 mb-3">
          <li>X aumenta da esquerda para a direita</li>
          <li>Y aumenta de cima para baixo (ou de baixo para cima, dependendo do sistema)</li>
          <li>Posição (0, 0) geralmente é o canto superior esquerdo</li>
        </ul>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">class</span> <span className="text-steam-green">Player</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> x; <span className="text-gray-500">// Posição horizontal</span><br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> y; <span className="text-gray-500">// Posição vertical</span><br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">string</span> name;<br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          Use float para posições porque permite movimentação suave com valores decimais (ex: 10.5, 23.7).
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>float permite valores decimais (ex: 10.5f)</li>
        <li>Use nomes descritivos: x, y são padrão para coordenadas</li>
        <li>Inicialize posições com valores como 0.0f ou 100.0f</li>
        <li>Em C#, números float precisam do sufixo 'f': 10.5f</li>
      </ul>
    </div>
  </div>
);

const TheoryContent12 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Movimentação de Personagem</h4>
      <p className="text-gray-300">
        Para mover um personagem em um jogo, você precisa atualizar suas coordenadas X e Y. 
        Isso é feito através de métodos que modificam essas posições baseado em direção e velocidade.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Conceitos Importantes</h4>
      <div className="bg-steam-dark rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">Velocidade</code>
          <p className="text-gray-300 text-sm">Quanto o objeto se move por frame/segundo</p>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">Direção</code>
          <p className="text-gray-300 text-sm">Para onde o objeto está se movendo (cima, baixo, esquerda, direita)</p>
        </div>
        <div className="flex items-start gap-3">
          <code className="text-steam-green font-mono text-sm">Atualização</code>
          <p className="text-gray-300 text-sm">Modificar x e y a cada frame do jogo</p>
        </div>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">class</span> <span className="text-steam-green">Player</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> x = <span className="text-yellow-400">0</span>;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> y = <span className="text-yellow-400">0</span>;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> speed = <span className="text-yellow-400">5.0f</span>;<br />
          <br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">void</span> <span className="text-steam-green">Move</span>(<span className="text-steam-blueLight">float</span> deltaX, <span className="text-steam-blueLight">float</span> deltaY) {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;x += deltaX * speed;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;y += deltaY * speed;<br />
          &nbsp;&nbsp;{'}'}<br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          O método Move recebe deltaX e deltaY (direção) e multiplica pela velocidade para atualizar a posição.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>x += valor é o mesmo que x = x + valor</li>
        <li>deltaX positivo move para direita, negativo para esquerda</li>
        <li>deltaY positivo move para baixo, negativo para cima</li>
        <li>Multiplique pela velocidade para controlar a rapidez do movimento</li>
      </ul>
    </div>
  </div>
);

const TheoryContent13 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Objetos em Movimento</h4>
      <p className="text-gray-300">
        Em jogos, muitos objetos se movem automaticamente: inimigos, projéteis, power-ups, etc. 
        Esses objetos precisam atualizar sua posição continuamente usando um método Update().
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Padrão Update</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <p className="text-gray-300 mb-2">
          Objetos em movimento geralmente têm um método Update() que é chamado a cada frame do jogo 
          para atualizar sua posição automaticamente.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">class</span> <span className="text-steam-green">Enemy</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> x, y;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> speed = <span className="text-yellow-400">2.0f</span>;<br />
          <br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">void</span> <span className="text-steam-green">Update</span>() {'{'}<br />
          &nbsp;&nbsp;&nbsp;&nbsp;x += speed; <span className="text-gray-500">// Move para a direita</span><br />
          &nbsp;&nbsp;{'}'}<br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          O método Update() é chamado a cada frame, fazendo o inimigo se mover automaticamente para a direita.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>Update() é chamado continuamente durante o jogo</li>
        <li>Use para movimentação automática de objetos</li>
        <li>Pode mover em qualquer direção: x += speed, y += speed, etc.</li>
        <li>Velocidade negativa move na direção oposta</li>
      </ul>
    </div>
  </div>
);

const TheoryContent14 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Herança em C#</h4>
      <p className="text-gray-300">
        Herança permite criar uma classe base (pai) com propriedades e métodos comuns, 
        e classes filhas que herdam essas características. Isso evita repetição de código.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Sintaxe de Herança</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-steam-green font-mono text-sm">
          <span className="text-steam-blueLight">class</span> ClasseBase {'{'}<br />
          &nbsp;&nbsp;<span className="text-gray-500">// propriedades e métodos comuns</span><br />
          {'}'}<br />
          <br />
          <span className="text-steam-blueLight">class</span> ClasseFilha : ClasseBase {'{'}<br />
          &nbsp;&nbsp;<span className="text-gray-500">// propriedades e métodos específicos</span><br />
          {'}'}
        </code>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">class</span> <span className="text-steam-green">GameObject</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> x, y;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> speed;<br />
          {'}'}<br />
          <br />
          <span className="text-steam-blueLight">class</span> <span className="text-steam-green">Player</span> : <span className="text-steam-green">GameObject</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-gray-500">// Herda x, y, speed automaticamente</span><br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">string</span> name;<br />
          {'}'}<br />
          <br />
          <span className="text-steam-blueLight">class</span> <span className="text-steam-green">Enemy</span> : <span className="text-steam-green">GameObject</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-gray-500">// Também herda x, y, speed</span><br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          Player e Enemy herdam x, y e speed de GameObject, evitando repetir código comum.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>Use : para indicar herança: class Filha : Pai</li>
        <li>Classes filhas herdam todas as propriedades e métodos públicos</li>
        <li>Herança evita repetição de código comum</li>
        <li>GameObject é um nome comum para classe base em jogos</li>
      </ul>
    </div>
  </div>
);

const TheoryContent15 = () => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Colisão em Jogos</h4>
      <p className="text-gray-300">
        Detectar colisão é essencial em jogos: quando o jogador coleta um item, quando um projétil acerta um inimigo, etc. 
        Uma forma simples é verificar se dois objetos estão próximos o suficiente.
      </p>
    </div>
    
    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Detecção de Colisão Simples</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <p className="text-gray-300 mb-2">
          Para detectar colisão, comparamos as posições dos objetos. 
          Se estiverem muito próximos (dentro de uma distância mínima), há colisão.
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Exemplo prático</h4>
      <div className="bg-steam-dark rounded-lg p-4">
        <code className="block bg-steam-darker p-3 rounded text-sm font-mono">
          <span className="text-steam-blueLight">class</span> <span className="text-steam-green">Player</span> {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">public</span> <span className="text-steam-blueLight">float</span> x, y;<br />
          {'}'}<br />
          <br />
          <span className="text-steam-blueLight">bool</span> <span className="text-steam-green">CheckCollision</span>(<span className="text-steam-green">Player</span> p, <span className="text-steam-green">Enemy</span> e) {'{'}<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">float</span> distanceX = p.x - e.x;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">float</span> distanceY = p.y - e.y;<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">float</span> distance = <span className="text-steam-blueLight">Math</span>.<span className="text-steam-green">Sqrt</span>(distanceX * distanceX + distanceY * distanceY);<br />
          &nbsp;&nbsp;<span className="text-steam-blueLight">return</span> distance &lt; <span className="text-yellow-400">10.0f</span>; <span className="text-gray-500">// Colisão se distância menor que 10</span><br />
          {'}'}
        </code>
        <p className="text-gray-400 text-sm mt-2">
          Calcula a distância entre dois objetos e retorna true se estiverem muito próximos (distância menor que 10).
        </p>
      </div>
    </div>

    <div>
      <h4 className="text-lg font-bold text-steam-blueLight mb-2">Dicas</h4>
      <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
        <li>Math.Sqrt() calcula a raiz quadrada (precisa de using System;)</li>
        <li>Distância = √((x1-x2)² + (y1-y2)²) - fórmula matemática</li>
        <li>Compare a distância com um valor limite (ex: 10.0f)</li>
        <li>Retorna true se colidindo, false caso contrário</li>
      </ul>
    </div>
  </div>
);

const exercises = [
  {
    id: "1",
    title: "Variáveis e Tipos",
    description: "Crie variáveis para armazenar a pontuação do jogador e o nome do jogador.",
    theory: {
      title: "Variáveis e Tipos de Dados em C#",
      content: TheoryContent1,
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
      content: TheoryContent2,
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
      content: TheoryContent3,
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
  {
    id: "4",
    title: "Loop For",
    description: "Use um loop for para imprimir números de 0 a 9.",
    theory: {
      title: "Loops For em C#",
      content: TheoryContent4,
    },
    template: `// Exercício 4: Loop for
// Tarefa: Crie um loop for que imprime números de 0 a 9
// Use Console.WriteLine(i) dentro do loop

`,
    tests: (code: string) => {
      return code.includes("for") && code.includes("int") && (code.includes("i++") || code.includes("i = i + 1"));
    },
    xp: 30,
  },
  {
    id: "5",
    title: "Loop While",
    description: "Use um loop while para contar de 0 a 4.",
    theory: {
      title: "Loops While em C#",
      content: TheoryContent5,
    },
    template: `// Exercício 5: Loop while
// Tarefa: Crie um loop while que conta de 0 a 4
// Use uma variável count e incremente dentro do loop

int count = 0;

`,
    tests: (code: string) => {
      return code.includes("while") && code.includes("count") && (code.includes("count++") || code.includes("count = count + 1"));
    },
    xp: 30,
  },
  {
    id: "6",
    title: "Arrays",
    description: "Crie um array de inteiros com 3 elementos e acesse o primeiro elemento.",
    theory: {
      title: "Arrays em C#",
      content: TheoryContent6,
    },
    template: `// Exercício 6: Arrays
// Tarefa: Crie um array de int chamado 'scores' com 3 elementos
// Atribua valores aos elementos e acesse scores[0]

`,
    tests: (code: string) => {
      return code.includes("int[]") && code.includes("scores") && code.includes("[0]");
    },
    xp: 40,
  },
  {
    id: "7",
    title: "Operadores Lógicos",
    description: "Use operadores lógicos (&& ou ||) para combinar duas condições.",
    theory: {
      title: "Operadores Lógicos em C#",
      content: TheoryContent7,
    },
    template: `// Exercício 7: Operadores lógicos
// Tarefa: Crie um if que verifica se score >= 100 E hasPowerUp == true
// Use o operador && para combinar as condições

int score = 150;
bool hasPowerUp = true;

`,
    tests: (code: string) => {
      return code.includes("if") && (code.includes("&&") || code.includes("||")) && code.includes("score");
    },
    xp: 35,
  },
  {
    id: "8",
    title: "Switch/Case",
    description: "Use switch/case para verificar o valor de uma variável level.",
    theory: {
      title: "Switch/Case em C#",
      content: TheoryContent8,
    },
    template: `// Exercício 8: Switch/Case
// Tarefa: Crie um switch que verifica o valor de 'level'
// Adicione cases para valores 1, 2 e um default

int level = 2;

`,
    tests: (code: string) => {
      return code.includes("switch") && code.includes("case") && code.includes("break");
    },
    xp: 40,
  },
  {
    id: "9",
    title: "Classes Básicas",
    description: "Crie uma classe Player com uma propriedade 'name' do tipo string.",
    theory: {
      title: "Classes em C#",
      content: TheoryContent9,
    },
    template: `// Exercício 9: Classes
// Tarefa: Crie uma classe chamada 'Player'
// Adicione uma propriedade pública 'name' do tipo string

`,
    tests: (code: string) => {
      return code.includes("class") && code.includes("Player") && code.includes("public") && code.includes("string");
    },
    xp: 50,
  },
  {
    id: "10",
    title: "Métodos de String",
    description: "Use métodos de string como ToUpper() ou Length em uma variável string.",
    theory: {
      title: "Métodos de String em C#",
      content: TheoryContent10,
    },
    template: `// Exercício 10: Métodos de String
// Tarefa: Crie uma string 'name' e use um método como ToUpper() ou Length
// Exemplo: string upper = name.ToUpper();

string name = "Jogador";

`,
    tests: (code: string) => {
      return code.includes("string") && (code.includes("ToUpper") || code.includes("ToLower") || code.includes("Length") || code.includes("Contains"));
    },
    xp: 35,
  },
  {
    id: "11",
    title: "Classe Player com Posição",
    description: "Crie uma classe Player com propriedades x e y do tipo float para representar a posição do jogador.",
    theory: {
      title: "Posicionamento em Jogos Digitais",
      content: TheoryContent11,
    },
    template: `// Exercício 11: Classe Player com Posição
// Tarefa: Crie uma classe Player com propriedades públicas:
// - x (float) - posição horizontal
// - y (float) - posição vertical
// - name (string) - nome do jogador

`,
    tests: (code: string) => {
      return code.includes("class") && code.includes("Player") && code.includes("float") && code.includes("x") && code.includes("y");
    },
    xp: 60,
  },
  {
    id: "12",
    title: "Movimentação do Personagem",
    description: "Adicione um método Move() na classe Player que recebe deltaX e deltaY e atualiza a posição multiplicando pela velocidade.",
    theory: {
      title: "Movimentação de Personagem em Jogos",
      content: TheoryContent12,
    },
    template: `// Exercício 12: Movimentação do Personagem
// Tarefa: Na classe Player, adicione:
// - Uma propriedade speed (float) com valor 5.0f
// - Um método Move(float deltaX, float deltaY) que atualiza x e y
// Use: x += deltaX * speed; e y += deltaY * speed;

class Player {
    public float x = 0;
    public float y = 0;
    
    // Adicione speed e método Move aqui
    
}

`,
    tests: (code: string) => {
      return code.includes("Move") && code.includes("speed") && (code.includes("x +=") || code.includes("x = x +")) && (code.includes("y +=") || code.includes("y = y +"));
    },
    xp: 70,
  },
  {
    id: "13",
    title: "Objetos em Movimento Automático",
    description: "Crie uma classe Enemy com propriedades x, y, speed e um método Update() que move o inimigo automaticamente para a direita.",
    theory: {
      title: "Objetos em Movimento em Jogos",
      content: TheoryContent13,
    },
    template: `// Exercício 13: Objetos em Movimento Automático
// Tarefa: Crie uma classe Enemy com:
// - Propriedades públicas: x (float), y (float), speed (float = 2.0f)
// - Método Update() que atualiza x: x += speed;

`,
    tests: (code: string) => {
      return code.includes("class") && code.includes("Enemy") && code.includes("Update") && code.includes("speed") && (code.includes("x +=") || code.includes("x = x +"));
    },
    xp: 65,
  },
  {
    id: "14",
    title: "Herança - Classe Base GameObject",
    description: "Crie uma classe base GameObject com x, y, speed. Depois crie uma classe Player que herda de GameObject.",
    theory: {
      title: "Herança em Programação Orientada a Objetos",
      content: TheoryContent14,
    },
    template: `// Exercício 14: Herança - Classe Base GameObject
// Tarefa: 
// 1. Crie uma classe GameObject com propriedades públicas: x (float), y (float), speed (float)
// 2. Crie uma classe Player que herda de GameObject usando ':'
// Exemplo: class Player : GameObject { }

`,
    tests: (code: string) => {
      return code.includes("class") && code.includes("GameObject") && code.includes("class") && code.includes("Player") && code.includes(":") && code.includes("GameObject");
    },
    xp: 80,
  },
  {
    id: "15",
    title: "Sistema de Colisão Básico",
    description: "Crie uma função CheckCollision que recebe dois objetos Player e Enemy e retorna true se a distância entre eles for menor que 10.0f.",
    theory: {
      title: "Detecção de Colisão em Jogos",
      content: TheoryContent15,
    },
    template: `// Exercício 15: Sistema de Colisão Básico
// Tarefa: Crie uma função CheckCollision que:
// - Recebe Player p e Enemy e como parâmetros
// - Calcula a distância entre eles usando: Math.Sqrt((p.x - e.x) * (p.x - e.x) + (p.y - e.y) * (p.y - e.y))
// - Retorna true se a distância for menor que 10.0f
// Use: using System; no início do código

using System;

class Player {
    public float x, y;
}

class Enemy {
    public float x, y;
}

// Crie a função CheckCollision aqui

`,
    tests: (code: string) => {
      return code.includes("CheckCollision") && code.includes("bool") && code.includes("Math.Sqrt") && code.includes("return") && code.includes("10.0f");
    },
    xp: 75,
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
            <div className="text-gray-200 mb-6">
              {exercise.theory.content && React.createElement(exercise.theory.content)}
            </div>
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

