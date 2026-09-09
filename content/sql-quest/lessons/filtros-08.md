---
id: filtros-08
title: "Buscando padrões de texto com LIKE"
summary: "Use LIKE com o curinga % para encontrar textos que começam, terminam ou contêm um padrão."
chapter: 5
chapterSlug: filtros
lesson: 8
difficulty: iniciante
xp: 40
prerequisites:
  - filtros-07
hints:
  - "Use LIKE 'Bo%' para nomes que começam com Bo."
  - "SELECT * FROM users WHERE name LIKE 'Bo%';"
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
    (2, 'Bonnie', 33, 'CA', 'BonnieSQL', 'bonniePass', false),
    (3, 'Bodhi', 26, 'US', 'BodhiApp', 'zenQuery', false),
    (4, 'Ram', 42, 'IN', 'Ram11c', 'queryNinja', false),
    (5, 'Bo', 40, 'US', 'BoCoder', 'boPass', false),
    (6, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false);
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
  instruction: "Escreva uma consulta que retorne todos os campos dos registros da tabela `users` em que o nome do usuário começa com Bo."
  expectedColumns:
    - id
    - name
    - age
    - country_code
    - username
    - password
    - is_admin
  expectedRows:
    - [2, "Bonnie", 33, "CA", "BonnieSQL", "bonniePass", 0]
    - [3, "Bodhi", 26, "US", "BodhiApp", "zenQuery", 0]
    - [5, "Bo", 40, "US", "BoCoder", "boPass", 0]
  orderSensitive: false
---

## Contexto

Às vezes não temos o luxo de saber exatamente o que precisamos consultar. Você
já quis procurar uma música ou um vídeo, mas só lembrava de parte do nome? O
SQL nos oferece uma opção para situações COMO essa.

A palavra-chave `LIKE` permite o uso dos operadores curinga `%` e `_`. Vamos
focar no `%` primeiro.

### Operador %

O operador `%` corresponde a zero ou mais caracteres. Podemos usá-lo dentro da
nossa string de consulta para encontrar mais do que apenas correspondências
exatas, dependendo de onde o colocamos.

**Produto que começa com "banana":**

```sql
SELECT
  *
FROM
  products
WHERE
  product_name LIKE 'banana%';
```

**Produto que termina com "banana":**

```sql
SELECT
  *
FROM
  products
WHERE
  product_name LIKE '%banana';
```

**Produto que contém "banana":**

```sql
SELECT
  *
FROM
  products
WHERE
  product_name LIKE '%banana%';
```

> **Dica:** o operador `LIKE` espera um valor de string. Certifique-se de que a
> expressão comparada esteja entre aspas, ou o SQL vai pensar que você está se
> referindo a uma coluna!

## Sua vez

O time de RH está lidando com um chamado de um dos nossos usuários, mas está
com dificuldade para encontrar o registro dele no banco. Eles têm quase certeza
de que o nome do usuário começa com Bo.

Escreva uma consulta que retorne todos os campos dos registros da tabela
`users` em que o nome do usuário começa com Bo.