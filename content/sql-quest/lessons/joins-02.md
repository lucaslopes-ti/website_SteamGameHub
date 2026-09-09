---
id: joins-02
title: "Namespacing em tabelas"
summary: "Especifique a tabela de cada coluna e use apelidos (aliases) para deixar o resultado legível."
chapter: 5
chapterSlug: joins
lesson: 2
difficulty: intermediario
xp: 60
prerequisites:
  - joins-01
hints:
  - "Use users.name, users.age e countries.name AS country_name."
  - "Ordene por country_name em ordem crescente."
  - "SELECT users.name, users.age, countries.name AS country_name FROM users INNER JOIN countries ON countries.country_code = users.country_code ORDER BY country_name ASC;"
references:
  - label: "SQLite — JOIN"
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

  CREATE TABLE countries (
    id INTEGER PRIMARY KEY,
    country_code TEXT,
    name TEXT
  );

  INSERT INTO countries (id, country_code, name) VALUES
    (1, 'US', 'United States'),
    (2, 'CA', 'Canada'),
    (3, 'IN', 'India'),
    (4, 'JP', 'Japan'),
    (5, 'BR', 'Brazil');
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
  - name: countries
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: country_code
        type: TEXT
      - name: name
        type: TEXT
challenge:
  kind: exact
  instruction: "Ajuste a consulta para: (1) retornar os campos `name` e `age` da tabela `users`; (2) retornar o campo `name` da tabela `countries` renomeado para `country_name`; (3) ordenar por `country_name` em ordem crescente."
  expectedColumns:
    - name
    - age
    - country_name
  expectedRows:
    - ["Samantha", 29, "Brazil"]
    - ["John", 39, "Canada"]
    - ["Ram", 42, "India"]
    - ["Al", 39, "Japan"]
    - ["David", 34, "United States"]
    - ["Hunter", 30, "United States"]
    - ["Allan", 27, "United States"]
  orderSensitive: true
---

## Contexto

Ao trabalhar com várias tabelas, você pode especificar a qual tabela um campo
pertence usando um ponto (`.`). Por exemplo:

```sql
SELECT
  students.name,
  classes.name
FROM
  students
  INNER JOIN classes ON classes.class_id = students.class_id;
```

A consulta acima retorna o campo `name` da tabela `students` e o campo `name`
da tabela `classes`.

### Apelidos (aliases)

Também podemos dar **apelidos** às colunas do resultado com `AS`, deixando o
resultado mais legível:

```sql
SELECT countries.name AS country_name FROM countries;
```

## Sua vez

Ajuste a consulta para:

1. Retornar os campos `name` e `age` da tabela `users`.
2. Retornar o campo `name` da tabela `countries`, renomeado para
   `country_name`.
3. Ordenar por `country_name` em ordem crescente.