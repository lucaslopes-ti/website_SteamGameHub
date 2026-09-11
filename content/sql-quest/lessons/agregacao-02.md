---
id: agregacao-02
title: "Somando valores com SUM"
summary: "Use SUM() para calcular o saldo de um usuário a partir das transações bem-sucedidas."
chapter: 7
chapterSlug: agregacao
lesson: 2
difficulty: iniciante
xp: 35
prerequisites:
  - agregacao-01
hints:
  - "Use a função agregada SUM sobre a coluna amount."
  - "Filtre com WHERE user_id = 9 AND was_successful = true."
  - "SELECT SUM(amount) FROM transactions WHERE user_id = 9 AND was_successful = true;"
references:
  - label: "SQLite — Aggregate Functions"
    url: "https://www.sqlite.org/lang_aggfunc.html"
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
    (8, 4, 4, 2, 'Lunch', 18, true),
    (9, 5, 5, 3, 'Lunch', 12, true),
    (10, 6, 6, 4, 'Lunch', 15, true),
    (11, 6, 6, 5, 'Lunch', 12, true),
    (12, 7, 7, 6, 'Lunch', 8, true),
    (13, 8, 8, 7, 'Lunch', 20, true),
    (14, 9, 9, 8, 'Lunch', 100, true),
    (15, 9, 9, 1, 'Lunch', 250, true),
    (16, 10, 10, 2, 'Lunch', 5, true),
    (17, 11, 11, 3, 'Lunch', 50, false);
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
  instruction: "Escreva uma consulta que retorne a soma (SUM) dos valores (amount) de todas as transações bem-sucedidas do Bob (user_id = 9)."
  expectedColumns:
    - SUM(amount)
  expectedRows:
    - [350]
  orderSensitive: false
---

## Contexto

A função de agregação `SUM` retorna a **soma** de um conjunto de valores.

Por exemplo, a consulta abaixo retorna um único registro com um único campo. O
valor retornado é igual ao total de salários de todos os funcionários da tabela
`employees`:

```sql
SELECT SUM(salary) FROM employees;
```

Que retorna:

| SUM(salary) |
| ----------- |
| 2483        |

### O contexto do Senai Pay

Precisamos calcular o saldo atual de um usuário, porque ainda não guardamos o
saldo corrente em cada registro individual de transação.

## Sua vez

Escreva uma consulta que retorne a agregação `SUM` dos valores (`amount`) de
todas as transações bem-sucedidas do Bob (`user_id` é `9`). Consulte o SQL de
setup para ver os detalhes da tabela.