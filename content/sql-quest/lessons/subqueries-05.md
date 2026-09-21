---
id: subqueries-05
title: "Prática: cálculos sem tabelas"
summary: "Escreva uma consulta que calcula um valor sem consultar nenhuma tabela."
chapter: 8
chapterSlug: subqueries
lesson: 5
difficulty: intermediario
xp: 28
prerequisites:
  - subqueries-04
hints:
  - "A missão é fazer um cálculo simples sem consultar nenhuma tabela."
  - "Quando não há tabela envolvida, a cláusula que normalmente indica a origem dos dados pode ser omitida."
  - "Multiplique 40 por 365 e dê à coluna o apelido `cutoff_days`."
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age_in_days INTEGER NOT NULL
  );

  INSERT INTO users (id, name, age_in_days) VALUES
    (1, 'David', 12410),
    (2, 'Samantha', 10585),
    (3, 'John', 14235),
    (4, 'Ram', 15330),
    (5, 'Hunter', 10950),
    (6, 'Allan', 9855),
    (7, 'Al', 16060),
    (8, 'Tiffany', 10220),
    (9, 'Marta', 13140),
    (10, 'Yuki', 21170);
tables:
  - name: users
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: name
        type: TEXT
        notNull: true
      - name: age_in_days
        type: INTEGER
        notNull: true
challenge:
  kind: exact
  instruction: "Sem consultar nenhuma tabela, escreva uma consulta que retorne 40 anos convertidos em dias (considere cada ano com 365 dias). A coluna do resultado deve se chamar `cutoff_days`."
  expectedColumns:
    - cutoff_days
  expectedRows:
    - [14600]
  orderSensitive: false
---

## Contexto

Uma dúvida comum: "o SQL só funciona com dados armazenados em tabelas?" A
resposta é **não**. O SQL é uma linguagem de programação completa e bastante
flexível. Você pode, por exemplo, selecionar informações que são simplesmente
**calculadas**, sem nenhuma tabela:

```sql
SELECT
  5 + 10 AS sum;

-- 15
```

Repare que a consulta **não tem** a cláusula `FROM`. Ainda assim, o resultado é
uma tabela com uma coluna (`sum`) e uma linha (`15`).

## Sua vez

A missão é calcular quantos dias há em 40 anos, sem tocar em nenhuma tabela.

Sua consulta deve:

- multiplicar 40 por 365;
- devolver uma única coluna chamada `cutoff_days`;
- não consultar nenhuma tabela.

Pense em como uma consulta sem origem de dados funciona: ela apenas calcula uma expressão.
