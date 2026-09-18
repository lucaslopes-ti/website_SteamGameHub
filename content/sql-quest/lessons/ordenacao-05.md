---
id: ordenacao-05
title: "Prática: corrigindo ORDER BY com LIMIT"
summary: "Corrija a ordem das cláusulas e combine ORDER BY com LIMIT para pegar os maiores valores."
chapter: 6
chapterSlug: ordenacao
lesson: 5
difficulty: intermediario
xp: 41
prerequisites:
  - ordenacao-04
hints:
  - "No SQL, o ORDER BY deve vir antes do LIMIT."
  - "Filtre com amount BETWEEN 10 AND 80 e ordene com ORDER BY amount DESC."
  - "SELECT * FROM transactions WHERE amount BETWEEN 10 AND 80 ORDER BY amount DESC LIMIT 4;"
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
  instruction: "Corrija a consulta quebrada e retorne todas as colunas da tabela `transactions` cujo `amount` está ENTRE 10 e 80, ordenadas por `amount` em ordem decrescente e limitadas aos 4 maiores valores."
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
  orderSensitive: true
---

## Contexto

Um funcionário de RH entrou no repositório Git onde as consultas ficam
armazenadas e tentou atualizar uma delas sozinho. O resultado foi a consulta
abaixo, que não executa:

```sql
SELECT
  *
FROM
  transactions
WHERE
  amount BETWEEN 10 AND 80
LIMIT
  4
ORDER BY
  amount DESC;
```

O problema é a **ordem das cláusulas**. Quando `ORDER BY` e `LIMIT` aparecem
juntos, o `ORDER BY` **deve vir primeiro**. Só depois de ordenar o resultado é
que faz sentido limitar quantas linhas retornar.

## Sua vez

Corrija a consulta acima para retornar **todas as colunas** da tabela
`transactions` em que `amount` está **ENTRE 10 e 80**, ordenadas por `amount`
em ordem **decrescente**, com `LIMIT` de **4** registros.
