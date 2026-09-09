---
id: filtros-07
title: "Filtrando por uma lista de valores com IN"
summary: "Use IN para verificar se um valor está entre vários valores possíveis."
chapter: 5
chapterSlug: filtros
lesson: 7
difficulty: iniciante
xp: 40
prerequisites:
  - filtros-06
hints:
  - "Use WHERE country_code IN ('US', 'CA', 'MX')."
  - "SELECT name, age, country_code FROM users WHERE country_code IN ('US', 'CA', 'MX');"
references:
  - label: "SQLite — Expressions"
    url: "https://www.sqlite.org/lang_expr.html"
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
    (7, 'Aiko', 31, 'JP', 'AikoOps', 'sakuraCloud7', false),
    (8, 'Isabella', 22, 'MX', 'IsaMX', 'tacosQL', false),
    (9, 'Noah', 41, 'AU', 'NoahRoot', 'koalaKernel', true),
    (10, 'Emma', 16, 'CA', 'EmmaDev', 'mapleSQL', false),
    (11, 'Sofia', 15, 'MX', 'SofiaMX', 'mexicoPass', false);
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
challenge:
  kind: exact
  instruction: "Escreva uma instrução SELECT que retorne os campos `name`, `age` e `country_code` de todos os usuários da tabela `users` com `country_code` igual a US, CA ou MX."
  expectedColumns:
    - name
    - age
    - country_code
  expectedRows:
    - ["David", 34, "US"]
    - ["John", 39, "CA"]
    - ["Hunter", 30, "US"]
    - ["Allan", 27, "US"]
    - ["Isabella", 22, "MX"]
    - ["Emma", 16, "CA"]
    - ["Sofia", 15, "MX"]
  orderSensitive: false
---

## Contexto

Outra variação da cláusula `WHERE` que podemos usar é o operador `IN`. `IN`
retorna `true` se o primeiro operando corresponde a qualquer um dos valores do
segundo operando, e `false` caso contrário. O operador `IN` é uma abreviação
para várias condições `OR`.

Estas duas consultas são equivalentes:

```sql
SELECT
  product_name,
  shipment_status
FROM
  products
WHERE
  shipment_status IN ('shipped', 'preparing', 'out of stock');
```

```sql
SELECT
  product_name,
  shipment_status
FROM
  products
WHERE
  shipment_status = 'shipped'
  OR shipment_status = 'preparing'
  OR shipment_status = 'out of stock';
```

Esperamos que você esteja começando a ver como consultar dados específicos com
cláusulas SQL bem ajustadas ajuda a revelar insights importantes! Quanto maior
uma tabela fica, mais difícil é analisá-la sem consultas adequadas.

## Sua vez

Queremos saber quais dos nossos usuários são dos Estados Unidos, do Canadá ou
do México.

Escreva uma instrução `SELECT` que retorne os campos `name`, `age` e
`country_code` de todos os usuários da tabela `users` com `country_code` igual
a `US`, `CA` ou `MX`.