---
id: filtros-10
title: "Quiz: curingas % e _"
summary: "Teste seu entendimento dos curingas % e _ com um quiz."
chapter: 5
chapterSlug: filtros
lesson: 10
difficulty: intermediario
xp: 28
prerequisites:
  - filtros-09
hints: []
references:
  - label: "SQLite — Expressions"
    url: "https://www.sqlite.org/lang_expr.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual das opções descreve os valores que correspondem ao exemplo 1 (`name LIKE 'or_%'`)?"
      options:
        - "Valores que começam com 'or' e têm exatamente 3 caracteres."
        - "Valores que começam com 'or' e têm pelo menos 3 caracteres."
        - "Valores que terminam com 'or' e têm pelo menos 3 caracteres."
        - "Valores que terminam com 'or' e têm exatamente 3 caracteres."
      answer: 1
      explanation: "O padrão 'or_%' exige 'or' seguido de pelo menos um caractere (_) e depois qualquer quantidade (%). Ou seja, os valores começam com 'or' e têm no mínimo 3 caracteres."
    - prompt: "Qual das opções NÃO corresponderia ao exemplo 2 (`name LIKE '__ing'`)?"
      options:
        - "thing"
        - "sling"
        - "singing"
        - "bling"
      answer: 2
      explanation: "'__ing' corresponde a palavras com exatamente 5 caracteres que terminam em 'ing'. 'singing' tem 7 caracteres e não corresponde ao padrão."
---

## Contexto

Vamos revisar os curingas com dois exemplos.

**Exemplo 1:**

```sql
SELECT
  *
FROM
  users
WHERE
  name LIKE 'or_%';
```

**Exemplo 2:**

```sql
SELECT
  *
FROM
  users
WHERE
  name LIKE '__ing';
```

## Sua vez

Responda às perguntas do desafio.