---
id: crud-01
title: "O que é CRUD?"
summary: "Conheça as quatro operações básicas de armazenamento persistente: criar, ler, atualizar e excluir."
chapter: 4
chapterSlug: crud
lesson: 1
difficulty: iniciante
xp: 30
prerequisites:
  - restricoes-08
hints: []
references:
  - label: "SQLite — Lang"
    url: "https://www.sqlite.org/lang.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual instrução SQL cria um novo registro?"
      options:
        - "SELECT"
        - "INSERT"
        - "DELETE"
        - "UPDATE"
      answer: 1
      explanation: "INSERT adiciona novos registros (Create)."
    - prompt: "O que significa a sigla CRUD?"
      options:
        - "Create, Read, Update, Delete"
        - "Copy, Run, Undo, Debug"
        - "Create, Remove, Update, Drop"
        - "Count, Read, Use, Delete"
      answer: 0
      explanation: "CRUD são as quatro operações básicas de armazenamento persistente."
---

## Contexto

**CRUD** é a sigla para *Create, Read, Update, Delete* — as quatro operações
básicas de armazenamento persistente:

- **Create** (criar): `INSERT` — adiciona novos registros.
- **Read** (ler): `SELECT` — consulta registros.
- **Update** (atualizar): `UPDATE` — modifica registros existentes.
- **Delete** (excluir): `DELETE` — remove registros.

Todo sistema que guarda dados — do Senai Pay a uma lista de compras — depende
dessas quatro operações. Neste capítulo vamos dominar cada uma delas.

## Sua vez

Responda às perguntas do desafio.