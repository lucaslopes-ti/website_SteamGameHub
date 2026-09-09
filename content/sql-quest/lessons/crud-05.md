---
id: crud-05
title: "Contando registros com COUNT"
summary: "Aprenda a usar a função agregada COUNT para contar linhas de uma tabela."
chapter: 4
chapterSlug: crud
lesson: 5
difficulty: iniciante
xp: 30
prerequisites:
  - crud-04
hints: []
references:
  - label: "SQLite — Aggregates"
    url: "https://www.sqlite.org/lang_aggfunc.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual função agregada retorna o número de linhas?"
      options:
        - "SUM"
        - "COUNT"
        - "AVG"
        - "MAX"
      answer: 1
      explanation: "COUNT colapsa muitas linhas em um único valor: a quantidade de linhas."
    - prompt: "O que COUNT(coluna) faz de diferente de COUNT(*)?"
      options:
        - "Conta apenas as linhas onde a coluna não é NULL"
        - "Conta apenas as linhas onde a coluna é NULL"
        - "Conta as colunas da tabela"
        - "Não faz nada diferente"
      answer: 0
      explanation: "COUNT(coluna) ignora linhas onde a coluna é NULL; COUNT(*) conta todas as linhas."
---

## Contexto

`COUNT` é uma **função agregada**: ela colapsa muitas linhas em um único valor
resumido.

```sql
SELECT COUNT(*) FROM users;
```

`COUNT(coluna)` conta apenas as linhas onde aquela coluna **não é NULL**.

```sql
SELECT COUNT(username) FROM users;
```

## Sua vez

Responda às perguntas do desafio.