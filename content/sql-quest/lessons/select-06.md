---
id: select-06
title: "SQL vs. NoSQL"
summary: "Entenda a diferença entre bancos relacionais (SQL) e não relacionais (NoSQL)."
chapter: 1
chapterSlug: select
lesson: 6
difficulty: iniciante
xp: 40
prerequisites:
  - select-05
hints: []
references:
  - label: "SQLite — Lang"
    url: "https://www.sqlite.org/lang.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Cada banco NoSQL tende a usar ____ linguagem(ns) de consulta."
      options:
        - "a mesma"
        - "diferentes"
      answer: 1
      explanation: "Cada sistema NoSQL costuma ter sua própria forma de escrever e executar consultas."
    - prompt: "Bancos compatíveis com ____ tendem a ser mais parecidos em funcionalidade do que bancos ____."
      options:
        - "SQL, NoSQL"
        - "NoSQL, SQL"
      answer: 0
      explanation: "Bancos relacionais são bastante parecidos entre si; bancos NoSQL tendem a ser únicos e voltados a propósitos específicos."
---

## Contexto

Ao falar de bancos SQL, precisamos mencionar o "elefante na sala": o **NoSQL**.

De forma simples, um banco NoSQL é um banco que **não usa SQL**. Cada sistema
NoSQL costuma ter sua própria forma de escrever e executar consultas. Por
exemplo, o MongoDB usa a MQL (MongoDB Query Language) e o ElasticSearch
simplesmente expõe uma API JSON.

Enquanto a maioria dos bancos relacionais é bastante parecida, os bancos NoSQL
tendem a ser únicos e são usados para propósitos mais específicos. As
principais diferenças entre SQL e NoSQL são:

- Bancos NoSQL geralmente são **não relacionais**; bancos SQL geralmente são
  **relacionais** (veremos o que isso significa mais adiante).
- Bancos SQL costumam ter um **schema definido**; bancos NoSQL costumam ter um
  schema dinâmico.
- Bancos SQL são baseados em **tabelas**; bancos NoSQL usam métodos variados de
  armazenamento, como documentos, chave-valor, grafos e colunas largas.

Exemplos de bancos NoSQL: MongoDB, Cassandra, CouchDB, DynamoDB e
ElasticSearch.

## Sua vez

Responda às perguntas do desafio.