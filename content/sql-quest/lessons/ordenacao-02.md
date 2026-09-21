---
id: ordenacao-02
title: "Prática: LIMIT é um teto, não uma garantia"
summary: "Pratique LIMIT entendendo que ele limita o máximo de linhas, mas não garante essa quantidade."
chapter: 6
chapterSlug: ordenacao
lesson: 2
difficulty: iniciante
xp: 28
prerequisites:
  - ordenacao-01
hints:
  - "A missão é listar as transações do usuário de `user_id` 6, com um teto de 3 linhas."
  - "O filtro identifica as linhas do usuário; a cláusula de limite define o teto."
  - "Use o coringa para trazer todas as colunas."
  - "Lembre-se de que o limite é um teto, não uma garantia: se o usuário tiver menos linhas que o teto, vêm menos."
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
  instruction: "Retorne todos os campos da tabela `transactions` para o usuário com `user_id` igual a 6, com um teto de 3 registros."
  expectedColumns:
    - id
    - user_id
    - sender_id
    - recipient_id
    - note
    - amount
    - was_successful
  expectedRows:
    - [9, 6, 6, 3, "Rent", 12, 1]
    - [10, 6, 6, 4, "Lunch", 27, 0]
  orderSensitive: false
---

## Contexto

Um erro comum é achar que `LIMIT 5` **sempre** retorna exatamente 5 registros.
Isso não é verdade: o `LIMIT` apenas define o número **máximo** de linhas que a
consulta pode devolver.

```sql
SELECT
  *
FROM
  products
WHERE
  product_name LIKE '%berry%'
LIMIT
  5;
```

Se a tabela tiver apenas 2 produtos com "berry" no nome, a consulta retorna
2 registros — o `LIMIT` não inventa linhas que não existem. Ele só evita que
uma consulta traga mais do que o necessário.

Por isso, ao testar uma consulta com `LIMIT`, o número de linhas do resultado
pode ser **menor ou igual** ao limite.

## Sua vez

Retorne **todos os campos** da tabela `transactions` para o usuário cujo
`user_id` é `6`. Use um `LIMIT` de `3` registros. Observe quantas linhas o
usuário realmente possui.
