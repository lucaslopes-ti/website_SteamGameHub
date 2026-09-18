---
id: ordenacao-01
title: "Limitando resultados com LIMIT"
summary: "Use LIMIT para limitar a quantidade de registros retornados por uma consulta."
chapter: 6
chapterSlug: ordenacao
lesson: 1
difficulty: iniciante
xp: 35
prerequisites:
  - filtros-11
hints:
  - "Adicione a cláusula LIMIT no final da consulta."
  - "Filtre as transações cujo note contém 'lunch': WHERE note LIKE '%lunch%'."
  - "SELECT * FROM transactions WHERE note LIKE '%lunch%' LIMIT 5;"
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
  instruction: "Escreva uma consulta que retorne todos os campos da tabela `transactions` em que a coluna `note` contém a palavra `lunch`. A consulta deve retornar no máximo 5 registros."
  expectedColumns:
    - id
    - user_id
    - sender_id
    - recipient_id
    - note
    - amount
    - was_successful
  expectedRows:
    - [1, 1, 1, 2, "Lunch with client", 25, 1]
    - [3, 2, 2, 1, "Lunch", 30, 1]
    - [4, 2, null, 4, "Lunch", 15, 1]
    - [5, 3, 3, 5, "Lunch", 10, 1]
    - [7, 4, 4, 1, "Lunch", 22, 1]
  orderSensitive: false
---

## Contexto

Em uma aplicação real, uma tabela de produção pode ter milhões de registros.
Buscar **todos** eles de uma vez pode sobrecarregar a rede e até derrubar o
sistema. A cláusula `LIMIT` resolve isso: ela define um teto para a quantidade
de registros retornados.

```sql
SELECT
  *
FROM
  products
WHERE
  product_name LIKE '%berry%'
LIMIT
  50;
```

A consulta acima retorna, no máximo, 50 produtos cujo nome contém "berry". Se
existirem menos de 50 registros correspondentes, o `LIMIT` não tem efeito — ele
é um **limite máximo**, não uma garantia de quantidade.

No Senai Pay, muitos usuários usam a plataforma para pagar o almoço uns aos
outros. Vamos examinar uma amostra dessas transações.

## Sua vez

Escreva uma consulta que retorne **todos os campos** da tabela `transactions`
para os registros em que a coluna `note` contém a palavra `lunch`. A consulta
deve retornar **no máximo 5** registros.
