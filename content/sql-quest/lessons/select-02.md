---
id: select-02
title: "Selecionando uma única coluna"
summary: "Aprenda a trocar o coringa * pelo nome de uma coluna para selecionar apenas o que precisa."
chapter: 1
chapterSlug: select
lesson: 2
difficulty: iniciante
xp: 40
prerequisites:
  - select-01
hints:
  - "Troque o * pelo nome da coluna que você quer."
  - "SELECT age FROM users;"
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER,
    name TEXT,
    age INTEGER,
    balance REAL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, balance, is_admin) VALUES
    (1, 'Ana Souza', 28, 450, 1),
    (2, 'Bruno Lima', 27, 200, 1),
    (3, 'Carla Mendes', 33, 496.24, 0);
tables:
  - name: users
    columns:
      - name: id
        type: INTEGER
      - name: name
        type: TEXT
      - name: age
        type: INTEGER
      - name: balance
        type: REAL
      - name: is_admin
        type: BOOLEAN
challenge:
  kind: exact
  instruction: "Atualize a consulta para selecionar apenas a coluna `age` da tabela `users`."
  expectedColumns:
    - age
  expectedRows:
    - [28]
    - [27]
    - [33]
  orderSensitive: false
---

## Contexto

Bancos de dados são feitos de tabelas, que são feitas de colunas (também
chamadas de "campos"). É como uma planilha: cada coluna guarda um tipo de
informação e cada linha é um registro.

A tabela `users` do Senai Pay tem estas colunas:

- `id` (inteiro)
- `name` (texto)
- `age` (inteiro)
- `balance` (decimal)
- `is_admin` (booleano: verdadeiro/falso)

Na lição anterior usamos o coringa `*` para trazer todas as colunas. Para
selecionar apenas uma coluna, trocamos o `*` pelo nome dela:

```sql
-- Traz todas as colunas
SELECT * FROM users;

-- Traz apenas a coluna name
SELECT name FROM users;
```

## Sua vez

Atualize a consulta para selecionar apenas a coluna `age` da tabela `users`.