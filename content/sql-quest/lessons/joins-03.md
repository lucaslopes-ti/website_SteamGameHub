---
id: joins-03
title: "LEFT JOIN"
summary: "Aprenda a manter todos os registros da tabela da esquerda, mesmo sem correspondÃªncia na direita."
chapter: 10
chapterSlug: joins
lesson: 3
difficulty: intermediario
xp: 60
prerequisites:
  - joins-02
hints:
  - "Use LEFT JOIN entre users e transactions."
  - "Agrupe por users.id e some os valores com SUM."
  - "NÃ£o use apelidos de tabela nesta consulta."
references:
  - label: "SQLite â€” JOIN"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    country_code TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, country_code, username, password, is_admin) VALUES
    (1, 'David', 34, 'US', 'DavidDev', 'insertPractice', false),
    (2, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false),
    (3, 'John', 39, 'CA', 'Jjdev21', 'sqlMaster2024', false),
    (4, 'Ram', 42, 'IN', 'Ram11c', 'queryNinja', false),
    (5, 'Hunter', 30, 'US', 'Hdev92', 'backendDev', false),
    (6, 'Allan', 27, 'US', 'Alires', 'adminPass1', true),
    (7, 'Al', 39, 'JP', 'quickCoder', 'snake_case', false);

  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    recipient_id INTEGER,
    sender_id INTEGER,
    note TEXT,
    amount REAL,
    was_successful BOOLEAN
  );

  INSERT INTO transactions (id, user_id, recipient_id, sender_id, note, amount, was_successful) VALUES
    (1, 1, NULL, 4, 'Testando transaÃ§Ã£o!', 10.50, true),
    (2, 3, 10, NULL, 'Valeu pelo almoÃ§o!', 9.56, true),
    (3, 1, NULL, 2, 'Problemas com o carro', 256.21, false),
    (4, 10, 2, NULL, 'Feliz aniversÃ¡rio!!', 50, true);
tables:
  - name: users
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: name
        type: TEXT
        notNull: true
      - name: age
        type: INTEGER
        notNull: true
      - name: country_code
        type: TEXT
        notNull: true
      - name: username
        type: TEXT
        unique: true
        notNull: true
      - name: password
        type: TEXT
        notNull: true
      - name: is_admin
        type: BOOLEAN
  - name: transactions
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: user_id
        type: INTEGER
        notNull: true
      - name: recipient_id
        type: INTEGER
      - name: sender_id
        type: INTEGER
      - name: note
        type: TEXT
      - name: amount
        type: REAL
      - name: was_successful
        type: BOOLEAN
challenge:
  kind: exact
  instruction: "Junte as tabelas `users` e `transactions` com LEFT JOIN em `users.id = transactions.user_id`. Retorne o nome do usuÃ¡rio (como `name`), a soma dos valores das transaÃ§Ãµes (como `transaction_sum`) e a contagem de transaÃ§Ãµes (como `transaction_count`). Agrupe por `users.id` e ordene pela soma em ordem decrescente. UsuÃ¡rios sem transaÃ§Ãµes tambÃ©m devem aparecer. NÃ£o use apelidos de tabela."
  expectedColumns:
    - name
    - transaction_sum
    - transaction_count
  expectedRows:
    - ["David", 266.71, 2]
    - ["John", 9.56, 1]
    - ["Samantha", null, 0]
    - ["Ram", null, 0]
    - ["Hunter", null, 0]
    - ["Allan", null, 0]
    - ["Al", null, 0]
  orderSensitive: true
---

## Contexto

Um `LEFT JOIN` retorna **todos** os registros da tabela da esquerda (table_a),
independentemente de haver correspondÃªncia na tabela da direita (table_b).
TambÃ©m retorna os registros correspondentes da tabela da direita, quando
existem.

### Apelidos de tabela

Um truque para facilitar a escrita da consulta Ã© definir um **apelido** para
cada tabela:

```sql
SELECT
  e.name,
  d.name
FROM
  employees e
  LEFT JOIN departments d ON e.department_id = d.id;
```

Repare nas declaraÃ§Ãµes simples `e` e `d` para `employees` e `departments`.
Alguns desenvolvedores fazem isso para deixar as consultas menos verbosas.
Neste curso, porÃ©m, **nÃ£o use apelidos de tabela** â€” nomes completos sÃ£o mais
fÃ¡ceis de entender.

### O relatÃ³rio do Senai Pay

O time do Senai Pay precisa de um relatÃ³rio com todas as transaÃ§Ãµes que um
usuÃ¡rio jÃ¡ fez. UsuÃ¡rios **sem** transaÃ§Ãµes tambÃ©m devem aparecer no relatÃ³rio
â€” por isso usamos `LEFT JOIN`.

## Sua vez

Junte as tabelas `users` e `transactions` em `users.id = transactions.user_id`.
Sua consulta deve retornar os seguintes 3 campos:

- O nome do usuÃ¡rio, como `name`
- A soma de todos os valores das transaÃ§Ãµes dele, como `transaction_sum`
- A contagem de todas as transaÃ§Ãµes dele, como `transaction_count`

Agrupe os dados pelo `id` do usuÃ¡rio. Ordene os dados pela soma em ordem
decrescente. Garanta que usuÃ¡rios sem transaÃ§Ãµes tambÃ©m apareÃ§am. **NÃ£o use
apelidos de tabela.**