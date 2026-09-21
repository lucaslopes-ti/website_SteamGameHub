---
id: ordenacao-03
title: "Ordenando resultados com ORDER BY"
summary: "Ordene o resultado das consultas com ORDER BY, em ordem crescente ou decrescente."
chapter: 6
chapterSlug: ordenacao
lesson: 3
difficulty: iniciante
xp: 35
prerequisites:
  - ordenacao-02
hints:
  - "A missão é listar as transações com valor entre 10 e 80, da maior para a menor."
  - "Use um operador de faixa no filtro, incluindo os extremos."
  - "Ordene pela coluna de valor em ordem decrescente; a ordenação vem depois do filtro."
  - "Selecione todas as colunas da tabela `transactions`."
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    sender_id INTEGER,
    recipient_id INTEGER,
    note TEXT,
    amount INTEGER NOT NULL,
    was_successful BOOLEAN NOT NULL
  );

  INSERT INTO transactions (id, user_id, sender_id, recipient_id, note, amount, was_successful) VALUES
    (1, 1, 1, 2, 'Lunch with client', 25, true),
    (2, 1, 1, 3, 'Coffee', 5, true),
    (3, 2, 2, 1, 'Lunch', 30, true),
    (4, 2, NULL, 4, 'Lunch', 15, true),
    (5, 3, 3, 5, 'Lunch', 10, true),
    (6, 3, 3, 6, 'Groceries', 40, true),
    (7, 4, 4, 1, 'Lunch', 22, true),
    (8, 5, 5, 2, 'Lunch', 18, true),
    (9, 6, 6, 3, 'Rent', 12, true),
    (10, 6, 6, 4, 'Lunch', 27, false);
tables:
  - name: transactions
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: user_id
        type: INTEGER
        notNull: true
      - name: sender_id
        type: INTEGER
      - name: recipient_id
        type: INTEGER
      - name: note
        type: TEXT
      - name: amount
        type: INTEGER
        notNull: true
      - name: was_successful
        type: BOOLEAN
        notNull: true
challenge:
  kind: exact
  instruction: "Retorne todas as colunas da tabela `transactions` cujo `amount` está ENTRE 10 e 80 (inclusive), ordenadas por `amount` em ordem decrescente."
  expectedColumns:
    - id
    - user_id
    - sender_id
    - recipient_id
    - note
    - amount
    - was_successful
  expectedRows:
    - [6, 3, 3, 6, "Groceries", 40, 1]
    - [3, 2, 2, 1, "Lunch", 30, 1]
    - [10, 6, 6, 4, "Lunch", 27, 0]
    - [1, 1, 1, 2, "Lunch with client", 25, 1]
    - [7, 4, 4, 1, "Lunch", 22, 1]
    - [8, 5, 5, 2, "Lunch", 18, 1]
    - [4, 2, null, 4, "Lunch", 15, 1]
    - [9, 6, 6, 3, "Rent", 12, 1]
    - [5, 3, 3, 5, "Lunch", 10, 1]
  orderSensitive: true
---

## Contexto

Até agora, a ordem das linhas retornadas não era garantida. A cláusula
`ORDER BY` permite **classificar** o resultado por uma ou mais colunas.

Por padrão, o `ORDER BY` ordena em ordem **crescente** (`ASC`). Para inverter e
ordenar do maior para o menor, usamos `DESC`.

```sql
SELECT
  name,
  price,
  quantity
FROM
  products
ORDER BY
  price;
```

Essa consulta retorna os produtos ordenados pelo preço, do menor para o maior.
Já a consulta abaixo ordena pela quantidade, do maior para o menor:

```sql
SELECT
  name,
  price,
  quantity
FROM
  products
ORDER BY
  quantity DESC;
```

## Sua vez

Retorne **todas as colunas** da tabela `transactions` cujo `amount` está
**ENTRE 10 e 80** (inclusive). Ordene o resultado por `amount` em ordem
**decrescente**.
