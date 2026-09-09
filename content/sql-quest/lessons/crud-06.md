---
id: crud-06
title: "Filtrando com WHERE"
summary: "Aprenda a filtrar linhas com a cláusula WHERE e seus operadores de comparação e lógica."
chapter: 4
chapterSlug: crud
lesson: 6
difficulty: iniciante
xp: 30
prerequisites:
  - crud-05
hints: []
references:
  - label: "SQLite — WHERE"
    url: "https://www.sqlite.org/lang_expr.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual cláusula filtra as linhas antes de serem retornadas?"
      options:
        - "ORDER BY"
        - "WHERE"
        - "GROUP BY"
        - "HAVING"
      answer: 1
      explanation: "WHERE filtra quais linhas uma instrução afeta ou retorna."
    - prompt: "Qual operador representa 'diferente de' em SQL?"
      options:
        - "="
        - "<>"
        - "LIKE"
        - "IN"
      answer: 1
      explanation: "Os operadores de comparação incluem =, <>, !=, <, >, <= e >=."
---

## Contexto

`WHERE` filtra quais linhas uma instrução afeta ou retorna. Ela funciona com
`SELECT`, `UPDATE` e `DELETE`.

```sql
SELECT * FROM users WHERE country_code = 'BR';
```

Operadores de comparação: `=`, `<>`, `!=`, `<`, `>`, `<=`, `>=`.
Operadores lógicos: `AND`, `OR`, `NOT`.

```sql
SELECT name, age FROM users WHERE age >= 30 AND country_code = 'US';
```

## Sua vez

Responda às perguntas do desafio.