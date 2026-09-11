---
id: agregacao-01
title: "O que são agregações? Contando com COUNT"
summary: "Entenda o conceito de agregação e use COUNT(*) para contar transações bem-sucedidas."
chapter: 7
chapterSlug: agregacao
lesson: 1
difficulty: iniciante
xp: 35
prerequisites:
  - crud-13
hints:
  - "Use a função agregada COUNT com o coringa *."
  - "Filtre com WHERE user_id = 6 AND was_successful = true."
  - "SELECT COUNT(*) FROM transactions WHERE user_id = 6 AND was_successful = true;"
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
  instruction: "Retorne o número de transações em que o user_id é 6 e was_successful é true."
  expectedColumns:
    - COUNT(*)
  expectedRows:
    - [2]
  orderSensitive: false
---

## Contexto

Uma **agregação** é um único valor derivado da combinação de vários outros
valores. Você já fez uma agregação antes, quando usou `COUNT` para contar o
número de registros de uma tabela.

### Por que usar agregações?

Os dados armazenados em um banco devem, em geral, ser guardados **crus** (da
forma como foram gerados). Quando precisamos calcular alguma informação extra a
partir desses dados crus, usamos uma agregação.

Veja esta agregação com `COUNT`:

```sql
SELECT COUNT(*) FROM products WHERE quantity = 0;
```

Essa consulta retorna o número de produtos com quantidade igual a 0. Poderíamos
guardar essa contagem em uma tabela separada e incrementá-la/decrementá-la a
cada mudança na tabela `products` — mas isso seria **redundante**.

É muito mais simples guardar os produtos em um único lugar (chamamos isso de
**fonte única da verdade** — *single source of truth*) e executar uma agregação
quando precisarmos derivar informações adicionais dos dados crus.

### O contexto do Senai Pay

O time de frontend está construindo uma página de dashboard no Senai Pay e
precisa saber o número de transações bem-sucedidas de um usuário.

## Sua vez

Retorne o número de transações em que o `user_id` é `6` e `was_successful` é
`true`. Lembre-se de usar o coringa `*` com `COUNT` a menos que as instruções
peçam especificamente outra coisa.