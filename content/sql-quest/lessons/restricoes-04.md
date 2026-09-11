---
id: restricoes-04
title: "Chaves estrangeiras (FOREIGN KEY)"
summary: "Entenda como as chaves estrangeiras conectam tabelas e corrija um INSERT que viola a FK."
chapter: 3
chapterSlug: restricoes
lesson: 4
difficulty: iniciante
xp: 34
prerequisites:
  - restricoes-03
hints:
  - "O código 'IND' não existe na tabela countries."
  - "Use 'IN', que é o código cadastrado."
  - "Depois dos INSERTs, selecione todos os registros com SELECT * FROM users;"
references:
  - label: "SQLite — FOREIGN KEY"
    url: "https://www.sqlite.org/foreignkeys.html"
setupSql: |
  CREATE TABLE countries (
    id INTEGER PRIMARY KEY,
    country_code TEXT UNIQUE,
    name TEXT NOT NULL
  );

  INSERT INTO countries (id, country_code, name) VALUES
    (1, 'US', 'Estados Unidos'),
    (2, 'IN', 'Índia'),
    (3, 'BR', 'Brasil');

  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    country_code TEXT NOT NULL,
    FOREIGN KEY (country_code) REFERENCES countries(country_code)
  );
tables:
  - name: countries
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: country_code
        type: TEXT
        unique: true
      - name: name
        type: TEXT
        notNull: true
  - name: users
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: name
        type: TEXT
        notNull: true
      - name: country_code
        type: TEXT
        notNull: true
        references: { table: countries, column: country_code }
challenge:
  kind: exact
  instruction: "Corrija o segundo INSERT: o código 'IND' não existe na tabela `countries`. Use o código correto e depois selecione todos os registros da tabela `users`."
  expectedColumns:
    - id
    - name
    - country_code
  expectedRows:
    - [1, "Jerry", "US"]
    - [2, "Amit", "IN"]
  orderSensitive: false
---

## Contexto

As chaves estrangeiras são o que tornam os bancos de dados relacionais
**relacionais**! Elas definem os relacionamentos entre tabelas. De forma
simples, uma **FOREIGN KEY** é um campo em uma tabela que referencia a PRIMARY
KEY (ou uma coluna UNIQUE) de outra tabela.

### Criando uma FOREIGN KEY no SQLite

A criação da FOREIGN KEY no SQLite acontece na criação da tabela. Depois de
definir os campos e constraints, adicionamos a constraint que define a coluna
da FK e seu `REFERENCES`. Exemplo:

```sql
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  department_name TEXT NOT NULL
);

CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER,
  CONSTRAINT fk_departments
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
);
```

Nesse exemplo, um funcionário tem um `department_id`, que deve ser igual ao
campo `id` de um registro da tabela `departments`. `fk_departments` é o nome
dado à constraint.

### O problema

A tabela `users` do Senai Pay guarda o país de origem de cada usuário em um
campo `country_code`. O time de "localizações" criou a tabela `countries`, e
podemos ligar um usuário ao seu país definindo uma chave estrangeira na tabela
`users`. Criar uma chave estrangeira **sem** a palavra `CONSTRAINT` faz com que
o nome da constraint seja atribuído automaticamente.

Dê uma olhada no código: há um problema nos INSERTs de novo! O código `'IND'`
não existe na tabela `countries` — o código cadastrado é `'IN'`.

## Sua vez

Corrija o INSERT do Amit para que nenhuma constraint de chave estrangeira seja
violada. Depois, selecione todos os registros da tabela `users`.