---
id: filtros-04
title: "Removendo duplicatas com DISTINCT"
summary: "Use SELECT DISTINCT para obter apenas valores únicos."
chapter: 5
chapterSlug: filtros
lesson: 4
difficulty: iniciante
xp: 40
prerequisites:
  - filtros-03
hints:
  - "Use a palavra-chave DISTINCT logo após SELECT."
  - "SELECT DISTINCT country_code FROM users;"
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
    (6, 'Allan', 27, 'US', 'Alires', 'adminPass1', true),
    (7, 'Lance', 20, 'US', 'LanChr', 'lancePass', false),
    (8, 'Tiffany', 28, 'US', 'Tifferoon', 'autoincrement', true),
    (9, 'Aiko', 31, 'JP', 'AikoOps', 'sakuraCloud7', false),
    (10, 'Marta', 36, 'ES', 'MartaDBA', 'oliveSQLtree', true),
    (11, 'Kwame', 24, 'GH', 'KDev24', 'accraAPI', false),
    (12, 'Noah', 41, 'AU', 'NoahRoot', 'koalaKernel', true);
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
  instruction: "Execute uma consulta DISTINCT para obter todos os `country_code` únicos da tabela `users`."
  expectedColumns:
    - country_code
  expectedRows:
    - ["US"]
    - ["BR"]
    - ["CA"]
    - ["IN"]
    - ["JP"]
    - ["ES"]
    - ["GH"]
    - ["AU"]
  orderSensitive: false
---

## Contexto

Às vezes queremos recuperar registros de uma tabela sem receber duplicatas.

Por exemplo, podemos querer saber todas as empresas diferentes em que nossos
funcionários já trabalharam, mas não queremos ver a mesma empresa várias vezes
no relatório.

### SELECT DISTINCT

O SQL nos oferece a palavra-chave `DISTINCT`, que remove registros duplicados
do resultado da consulta:

```sql
SELECT DISTINCT
  previous_company
FROM
  employees;
```

Isso retorna apenas uma linha para cada valor único de `previous_company`.

## Sua vez

Os executivos do Senai Pay querem saber em quais países temos clientes.
Armazenamos o dado `country_code` como uma coluna na tabela `users`.

Execute uma consulta `DISTINCT` para obter todos os `country_code` únicos da
tabela `users`.