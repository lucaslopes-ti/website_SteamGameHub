---
id: subqueries-02
title: "Prática: transações de administradores"
summary: "Use uma subquery com IN para filtrar transações cujos donos são administradores."
chapter: 8
chapterSlug: subqueries
lesson: 2
difficulty: intermediario
xp: 41
prerequisites:
  - subqueries-01
hints:
  - "A missão é listar as transações cujo dono é administrador."
  - "Primeiro, uma subquery deve devolver a lista de ids de todos os administradores."
  - "Na consulta externa, use o operador que testa se o valor pertence a essa lista (o mesmo usado com listas de valores)."
  - "A consulta externa lê todas as colunas de `transactions` e filtra `user_id` contra a subquery."
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
  instruction: "Retorne todas as colunas da tabela `transactions` cujo `user_id` pertence a um administrador (`is_admin` verdadeiro), usando uma subquery com IN."
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
    - [11, 8, 8, 5, "invoice #2210", 55, 1]
    - [12, 9, 9, 1, "tax refund", 33, 1]
  orderSensitive: false
---

## Contexto

A grande vantagem de uma subquery é poder **consultar o resultado de uma
consulta aninhada**. Isso permite usar informações de uma tabela para filtrar
outra, sem precisar fazer um `JOIN`.

```sql
SELECT
  id,
  song_name
FROM
  songs
WHERE
  artist_id IN (
    SELECT
      id
    FROM
      artists
    WHERE
      artist_name LIKE 'Rick%'
  );
```

Neste exemplo, a subquery retorna **vários** `id`s, então usamos o operador
`IN`. Se a subquery retornasse um único valor, poderíamos usar `=`.

O time de operações do Senai Pay quer auditar as movimentações feitas pelos
administradores da plataforma.

## Sua vez

A missão é buscar as transações feitas por administradores do Senai Pay.

Sua consulta deve:

- ler todas as colunas da tabela `transactions`;
- usar uma subquery com o operador de lista para obter os ids dos administradores;
- filtrar as transações cujo `user_id` pertence a essa lista.

A subquery responde a pergunta 'quem é administrador?'; a consulta externa usa a resposta para filtrar.
