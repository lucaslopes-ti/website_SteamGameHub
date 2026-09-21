---
id: performance-02
title: "Como os índices funcionam"
summary: "Entenda o custo O(log(n)) dos índices B-tree e quando vale a pena indexar."
chapter: 11
chapterSlug: performance
lesson: 2
difficulty: intermediario
xp: 28
prerequisites:
  - performance-01
hints:
  - "Releia no contexto a explicação sobre a estrutura de um índice e sobre o custo de mantê-lo."
  - "Ao avaliar quais colunas já estão indexadas, pense em quais tipos de restrição o banco cria por padrão."
  - "Na pergunta sobre a regra prática, reflita sobre o equilíbrio entre ganho nas buscas e custo nas alterações."
references:
  - label: "SQLite — Query Optimizer Overview"
    url: "https://www.sqlite.org/optoverview.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre índices e desempenho."
  questions:
    - prompt: "Um índice B-tree faz com que as buscas sejam..."
      options:
        - "O(n^2)"
        - "O(n*log(n))"
        - "O(n)"
        - "O(log(n))"
      answer: 3
      explanation: "A B-tree mantém os valores ordenados e divide a busca a cada nível, resultando em complexidade O(log(n))."
    - prompt: "Por que não devemos indexar todas as colunas de uma tabela?"
      options:
        - "Porque o SQLite só permite um índice por tabela"
        - "Porque cada índice ocupa memória e deixa INSERT/UPDATE mais lentos"
        - "Porque índices impedem o uso de JOINs"
        - "Porque índices só funcionam em chaves estrangeiras"
      answer: 1
      explanation: "Vários índices incham o uso de memória e obrigam cada escrita a atualizar várias árvores."
    - prompt: "Quais colunas já vêm indexadas automaticamente?"
      options:
        - "Apenas colunas do tipo TEXT"
        - "As colunas que aceitam valores NULL"
        - "As colunas PRIMARY KEY"
        - "Nenhuma coluna"
      answer: 2
      explanation: "As colunas PRIMARY KEY são indexadas por padrão, o que torna a busca por id muito rápida."
    - prompt: "Qual é a regra prática sobre índices?"
      options:
        - "Indexar todas as colunas para garantir velocidade"
        - "Indexar as colunas usadas com frequência em buscas e deixar o resto sem índice"
        - "Nunca criar índices em produção"
        - "Criar índices apenas em colunas booleanas"
      answer: 1
      explanation: "Adicione índices às colunas em que você fará buscas frequentes; você sempre pode adicionar outro depois."
---

## Contexto

Como vimos, um índice é uma estrutura de dados que permite buscas rápidas.

Ao indexar uma coluna, criamos uma nova estrutura em memória, geralmente uma
**B-tree**, na qual os valores da coluna ficam ordenados na árvore para manter
as buscas rápidas. Em termos de complexidade **Big-O**, um índice B-tree garante
que as buscas sejam **O(log(n))**.

### Não deveríamos indexar tudo?

Apesar de deixarem certos tipos de busca muito mais rápidos, os índices também
adicionam **overhead**: eles podem deixar o banco mais lento em outros aspectos.

Pense bem: se você indexar todas as colunas, poderá ter centenas de B-trees na
memória! Isso incha desnecessariamente o uso de memória do banco. Também
significa que, a cada registro inserido, esse registro precisa ser adicionado a
muitas árvores, deixando o INSERT mais lento.

A regra prática é simples:

> Adicione índices às colunas em que você sabe que fará buscas frequentes.
> Deixe todo o resto sem índice. Você sempre pode adicionar outro depois.

## Sua vez

Responda às perguntas sobre como os índices funcionam e quando valem a pena.

- Pense no ganho de velocidade nas leituras e no custo nas escritas.
- Considere que colunas de chave primária já vêm indexadas.

Depois de enviar, leia as explicações para revisar.
