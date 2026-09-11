---
id: filtros-06
title: "Combinando condições com OR"
summary: "Use OR para aceitar registros que atendam a qualquer uma das condições."
chapter: 5
chapterSlug: filtros
lesson: 6
difficulty: iniciante
xp: 28
prerequisites:
  - filtros-05
hints:
  - "Agrupe as condições de país com parênteses antes do AND."
  - "Use COUNT(*) com o alias junior_count."
  - "SELECT COUNT(*) AS junior_count FROM users WHERE (country_code = 'US' OR country_code = 'CA') AND age < 18;"
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
    (4, 'Emma', 16, 'CA', 'EmmaDev', 'mapleSQL', false),
    (5, 'Liam', 15, 'US', 'LiamCoder', 'usMinorPass', false),
    (6, 'Mia', 17, 'CA', 'MiaDev', 'firstAdult', false),
    (7, 'Ethan', 12, 'BR', 'EthanKid', 'childPass', false),
    (8, 'Sofia', 15, 'MX', 'SofiaMX', 'mexicoPass', false);
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
  instruction: "Escreva uma consulta que retorne a contagem de todos os usuários (com o alias `junior_count`) que são dos Estados Unidos ou do Canadá E têm menos de 18 anos."
  expectedColumns:
    - junior_count
  expectedRows:
    - [3]
  orderSensitive: false
---

## Contexto

Como você provavelmente já adivinhou, se o operador lógico `AND` é suportado,
o operador `OR` provavelmente também é.

```sql
SELECT
  product_name,
  quantity,
  shipment_status
FROM
  products
WHERE
  shipment_status = 'out of stock'
  OR quantity BETWEEN 10 and 100;
```

Essa consulta recupera registros em que a condição do `shipment_status` OU a
condição da `quantity` é atendida.

### Ordem das operações

Você pode agrupar operações lógicas com parênteses para especificar a ordem das
operações:

```sql
(
  this
  AND that
)
OR the_other
```

## Sua vez

As leis mudaram de novo! Agora precisamos ver quantos usuários afetados atendem
a estes critérios:

- Usuários que são dos Estados Unidos ou do Canadá, e têm menos de 18 anos.

Escreva uma consulta que recupere a contagem de todos os usuários (com o alias
`junior_count`) que correspondem às condições acima.