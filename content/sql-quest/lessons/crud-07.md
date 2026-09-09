---
id: crud-07
title: "Encontrando valores NULL"
summary: "Aprenda a usar IS NULL e IS NOT NULL para encontrar valores ausentes."
chapter: 4
chapterSlug: crud
lesson: 7
difficulty: iniciante
xp: 30
prerequisites:
  - crud-06
hints: []
references:
  - label: "SQLite — NULL"
    url: "https://www.sqlite.org/lang_expr.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual operador encontra linhas onde uma coluna não tem valor?"
      options:
        - "= NULL"
        - "IS NULL"
        - "== NULL"
        - "NULL()"
      answer: 1
      explanation: "Comparar com = ou <> nunca encontra NULL; use IS NULL."
    - prompt: "O que NULL significa em SQL?"
      options:
        - "O número zero"
        - "Uma string vazia"
        - "Ausência de valor"
        - "O valor booleano falso"
      answer: 2
      explanation: "NULL indica que o valor está ausente — não é zero nem string vazia."
---

## Contexto

`NULL` significa "sem valor" — não é zero e não é uma string vazia. Comparar
com `=` ou `<>` **nunca** encontra NULL. Use `IS NULL` e `IS NOT NULL`:

```sql
SELECT * FROM users WHERE country_code IS NULL;

SELECT * FROM users WHERE country_code IS NOT NULL;
```

## Sua vez

Responda às perguntas do desafio.