---
id: joins-01
title: "IntroduÃ§Ã£o aos JOINs"
summary: "Aprenda a consultar vÃ¡rias tabelas ao mesmo tempo com INNER JOIN."
chapter: 10
chapterSlug: joins
lesson: 1
difficulty: intermediario
xp: 60
prerequisites:
  - crud-13
hints:
  - "Use INNER JOIN entre users e countries, nessa ordem."
  - "A condiÃ§Ã£o de junÃ§Ã£o Ã© countries.country_code = users.country_code."
  - "SELECT * FROM users INNER JOIN countries ON countries.country_code = users.country_code;"
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
  instruction: "Escreva um INNER JOIN entre `users` e `countries` (nessa ordem), retornando todos os campos das duas tabelas. A junÃ§Ã£o deve ser feita pelo campo `country_code`."
  expectedColumns:
    - id
    - name
    - age
    - country_code
    - username
    - password
    - is_admin
    - id
    - country_code
    - name
  expectedRows:
    - [1, "David", 34, "US", "DavidDev", "insertPractice", 0, 1, "US", "United States"]
    - [2, "Samantha", 29, "BR", "Sammy93", "addingRecords!", 0, 5, "BR", "Brazil"]
    - [3, "John", 39, "CA", "Jjdev21", "sqlMaster2024", 0, 2, "CA", "Canada"]
    - [4, "Ram", 42, "IN", "Ram11c", "queryNinja", 0, 3, "IN", "India"]
    - [5, "Hunter", 30, "US", "Hdev92", "backendDev", 0, 1, "US", "United States"]
    - [6, "Allan", 27, "US", "Alires", "adminPass1", 1, 1, "US", "United States"]
    - [7, "Al", 39, "JP", "quickCoder", "snake_case", 0, 4, "JP", "Japan"]
  orderSensitive: false
---

## Contexto

Os **JOINs** sÃ£o um dos recursos mais importantes do SQL. Eles nos permitem
usar os relacionamentos que configuramos entre as tabelas: em resumo, os JOINs
permitem consultar **vÃ¡rias tabelas ao mesmo tempo**.

### INNER JOIN

O tipo de JOIN mais simples e comum Ã© o `INNER JOIN`. Por padrÃ£o, um comando
`JOIN` Ã© um `INNER JOIN`. Ele retorna todos os registros da tabela A que tÃªm
registros correspondentes na tabela B.

### A clÃ¡usula ON

Para fazer um JOIN, precisamos dizer ao banco como "combinar" as linhas de cada
tabela. A clÃ¡usula `ON` especifica as colunas de cada tabela que devem ser
comparadas.

Quando o mesmo nome de coluna existe nas duas tabelas, precisamos especificar
de qual tabela cada coluna vem, usando o nome da tabela (ou um apelido) seguido
de um ponto (`.`) antes do nome da coluna:

```sql
SELECT *
FROM employees
INNER JOIN departments ON employees.department_id = departments.id;
```

Nesta consulta:

- `employees.department_id` se refere Ã  coluna `department_id` da tabela
  `employees`;
- `departments.id` se refere Ã  coluna `id` da tabela `departments`;
- A clÃ¡usula `ON` garante que as linhas sejam combinadas com base nessas
  colunas, criando um relacionamento entre as duas tabelas.

O `INNER` afeta apenas o **nÃºmero de linhas** retornadas, nÃ£o o nÃºmero de
colunas. O `SELECT *` garante que todas as colunas das duas tabelas sejam
incluÃ­das.

### Por que isso Ã© importante?

Em muitos bancos, tabelas diferentes podem ter colunas com o mesmo nome, como
`id`. Se vocÃª nÃ£o especificar o nome da tabela (ou apelido) para uma coluna, o
banco nÃ£o saberÃ¡ qual coluna usar no JOIN. Por exemplo, escrever `ON id = id`
nÃ£o funciona, porque o banco nÃ£o consegue distinguir as colunas `id` de cada
tabela.

### O contexto do Senai Pay

O time de frontend estÃ¡ trabalhando em uma pÃ¡gina de perfil e gostaria de
exibir o **nome do paÃ­s** do usuÃ¡rio em vez de apenas o cÃ³digo de duas letras.
Vamos comeÃ§ar escrevendo um JOIN simples entre as tabelas `users` e
`countries`.

## Sua vez

Escreva um `INNER JOIN` entre `users` e `countries`, nessa ordem. Retorne todos
os campos das duas tabelas. A junÃ§Ã£o deve ser feita pelo campo `country_code`.