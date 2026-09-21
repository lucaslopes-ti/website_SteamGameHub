---
id: subqueries-04
title: "Prática: convertendo anos em dias com subquery"
summary: "Use uma subquery sem tabela para converter 40 anos em dias e filtrar usuários."
chapter: 8
chapterSlug: subqueries
lesson: 4
difficulty: intermediario
xp: 41
prerequisites:
  - subqueries-03
hints:
  - "A missão é listar os usuários com mais de 40 anos, sabendo que a idade está guardada em dias."
  - "Você precisa comparar a coluna de dias com um valor calculado; calcule 40 vezes 365 dentro de uma subquery."
  - "A subquery não precisa de tabela: ela só faz a multiplicação."
  - "A condição da consulta externa compara a coluna de idade em dias com o resultado da subquery, usando maior que."
references:
  - label: "SQLite — Expressions"
    url: "https://www.sqlite.org/lang_expr.html"
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
  instruction: "Retorne todas as colunas da tabela `users` para os usuários com mais de 40 anos, sabendo que `age_in_days` guarda a idade em dias. Use uma subquery para converter 40 anos em dias (considere cada ano com 365 dias) e filtre por esse valor."
  expectedColumns:
    - id
    - name
    - age_in_days
  expectedRows:
    - [4, "Ram", 15330]
    - [7, "Al", 16060]
    - [10, "Yuki", 21170]
  orderSensitive: false
---

## Contexto

Nem sempre precisamos de uma tabela para executar SQL. O SQL é uma linguagem
de programação completa e também permite **calcular valores livremente**, sem
consultar nenhuma tabela:

```sql
SELECT
  5 + 10 AS sum;

-- 15
```

Esse recurso é útil dentro de subqueries: podemos calcular um valor uma única
vez e usá-lo na condição da consulta externa.

O time financeiro do Senai Pay descobriu que a tabela `users` guarda a idade
dos usuários de um jeito esquisito: na coluna `age_in_days`, a idade é
armazenada em **dias**, não em anos.

## Sua vez

A missão é encontrar os usuários com mais de 40 anos, mas a idade está armazenada em dias.

Sua consulta deve:

- ler todas as colunas da tabela `users`;
- usar uma subquery para converter 40 anos em dias, considerando 365 dias por ano;
- filtrar quem tem a idade em dias maior que esse valor.

A subquery serve para deixar o cálculo explícito dentro da própria consulta.
