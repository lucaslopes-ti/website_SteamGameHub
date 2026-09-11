---
id: filtros-11
title: "Prática: programa de descontos"
summary: "Combine IIF com OR para criar uma coluna calculada de desconto."
chapter: 5
chapterSlug: filtros
lesson: 11
difficulty: intermediario
xp: 41
prerequisites:
  - filtros-10
hints:
  - "Use IIF com a condição age > 55 OR country_code = 'CA'."
  - "Selecione todas as colunas com * e adicione discount_percent no final."
  - "SELECT *, IIF(age > 55 OR country_code = 'CA', 10, 0) AS discount_percent FROM users;"
references:
  - label: "SQLite — Core Functions"
    url: "https://www.sqlite.org/lang_corefunc.html"
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
    (5, 'Yuki', 58, 'JP', 'YukiSensei', 'retireSoon', false),
    (6, 'Liam', 17, 'US', 'LiamCoder', 'usMinorPass', false),
    (7, 'Sofia', 15, 'MX', 'SofiaMX', 'mexicoPass', false),
    (8, 'Benjamin', 33, 'CA', 'BenjaSQL', 'canadaPass', false),
    (9, 'Miriam', 70, 'BR', 'MiriamDBA', 'seniorPass', false),
    (10, 'Hunter', 30, 'US', 'Hdev92', 'backendDev', false);
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
  instruction: "Escreva uma consulta que retorne todos os usuários da tabela `users`, incluindo todas as colunas, mais uma coluna adicional chamada `discount_percent`. O valor deve ser 10 ou 0 (inteiro), dependendo de o usuário atender a alguma condição de desconto: ter mais de 55 anos ou ser do Canadá (country_code 'CA')."
  expectedColumns:
    - id
    - name
    - age
    - country_code
    - username
    - password
    - is_admin
    - discount_percent
  expectedRows:
    - [1, "David", 34, "US", "DavidDev", "insertPractice", 0, 0]
    - [2, "Samantha", 29, "BR", "Sammy93", "addingRecords!", 0, 0]
    - [3, "John", 39, "CA", "Jjdev21", "sqlMaster2024", 0, 10]
    - [4, "Emma", 16, "CA", "EmmaDev", "mapleSQL", 0, 10]
    - [5, "Yuki", 58, "JP", "YukiSensei", "retireSoon", 0, 10]
    - [6, "Liam", 17, "US", "LiamCoder", "usMinorPass", 0, 0]
    - [7, "Sofia", 15, "MX", "SofiaMX", "mexicoPass", 0, 0]
    - [8, "Benjamin", 33, "CA", "BenjaSQL", "canadaPass", 0, 10]
    - [9, "Miriam", 70, "BR", "MiriamDBA", "seniorPass", 0, 10]
    - [10, "Hunter", 30, "US", "Hdev92", "backendDev", 0, 0]
  orderSensitive: false
---

## Contexto

O Senai Pay lançou dois programas de desconto:

- Todos os usuários com mais de 55 anos se qualificam para um desconto de
  idosos.
- Usuários do Canadá (`country_code` `'CA'`) se qualificam para um desconto do
  Canada Day.

Usuários que se qualificam para qualquer um dos descontos ganham 10% de
desconto.

## Sua vez

Escreva uma consulta que retorne todos os usuários da tabela `users`, incluindo
todas as colunas, mais uma coluna adicional chamada `discount_percent`.

A coluna `discount_percent` deve ter um valor inteiro de `10` ou `0`,
dependendo de o usuário atender a alguma condição de desconto listada acima.