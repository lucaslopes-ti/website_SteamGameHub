---
id: subqueries-03
title: "Prática: subquery de faturas"
summary: "Encontre usuários não administradores que usaram a conta pessoal para despesas de negócio."
chapter: 8
chapterSlug: subqueries
lesson: 3
difficulty: intermediario
xp: 41
prerequisites:
  - subqueries-02
hints:
  - "A subquery busca sender_id em transactions onde note LIKE '%invoice%' OR note LIKE '%tax%'."
  - "A consulta externa busca em users com id IN (...)."
  - "Combine com AND is_admin = false para excluir administradores."
  - "SELECT * FROM users WHERE id IN (SELECT sender_id FROM transactions WHERE note LIKE '%invoice%' OR note LIKE '%tax%') AND is_admin = false;"
references:
  - label: "SQLite — SELECT"
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
    (6, 'Allan', 27, 'US', 'Alires', 'welovebootdev', true),
    (7, 'Al', 44, 'JP', 'quickCoder', 'SQLrocks', false),
    (8, 'Tiffany', 28, 'US', 'TiffT', 'tiffanyPass', true),
    (9, 'Marta', 36, 'ES', 'MartaDBA', 'spainPass', true),
    (10, 'Yuki', 58, 'JP', 'YukiSensei', 'retireSoon', false);

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
    (4, 2, NULL, 4, 'invoice #1042', 15, true),
    (5, 3, 3, 5, 'Lunch', 10, true),
    (6, 3, 3, 6, 'tax payment', 40, true),
    (7, 4, 4, 1, 'Lunch', 22, true),
    (8, 5, 5, 2, 'Lunch', 18, true),
    (9, 6, 6, 3, 'Rent', 12, true),
    (10, 6, 6, 4, 'Lunch', 27, false),
    (11, 8, 8, 5, 'invoice #2210', 55, true),
    (12, 9, 9, 1, 'tax refund', 33, true),
    (13, 10, 10, 2, 'Lunch', 8, true),
    (14, 4, 4, 6, 'invoice #3099', 70, true);
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
  instruction: "Usando as tabelas `transactions` e `users`, escreva uma instrução SQL com subquery que retorne todos os campos do usuário para cada usuário que: tenha o `id` igual a algum `sender_id` de uma transação cujo `note` contenha 'invoice' ou 'tax'; e não seja administrador (`is_admin` falso)."
  expectedColumns:
    - id
    - name
    - age
    - country_code
    - username
    - password
    - is_admin
  expectedRows:
    - [3, "John", 39, "CA", "Jjdev21", "sqlMaster2024", 0]
    - [4, "Ram", 42, "IN", "Ram11c", "queryNinja", 0]
  orderSensitive: false
---

## Contexto

Alguns clientes estão usando suas contas pessoais do Senai Pay para despesas
de negócio. O time comercial quer contatá-los para oferecer contas
empresariais.

Para encontrá-los, precisamos de uma subquery: primeiro descobrimos **quem
enviou** transações com menção a "invoice" ou "tax"; depois buscamos os
registros completos desses usuários.

```sql
SELECT
  *
FROM
  users
WHERE
  id IN (
    SELECT
      sender_id
    FROM
      transactions
    WHERE
      note LIKE '%invoice%'
  );
```

Observe que a coluna filtrada na consulta externa (`users.id`) é diferente da
coluna usada na subquery (`transactions.sender_id`) — é justamente isso que a
subquery permite relacionar.

## Sua vez

Usando as tabelas `transactions` e `users`, escreva uma instrução SQL com
subquery que retorne **todos os campos do usuário** para cada usuário que:

- Tenha o `id` igual a algum `sender_id` de uma transação cujo `note` contenha
  `invoice` **ou** `tax`.
- **Não** seja administrador (`is_admin` falso).
