---
id: crud-03
title: "Auto incremento de IDs"
summary: "Deixe o banco gerar os ids automaticamente omitindo a coluna id no INSERT."
chapter: 4
chapterSlug: crud
lesson: 3
difficulty: iniciante
xp: 50
prerequisites:
  - crud-02
hints:
  - "Omita a coluna id no INSERT para o banco gerar o próximo valor."
  - "No SQLite, INTEGER PRIMARY KEY auto-incrementa quando o id é omitido."
  - "INSERT INTO users (name, age, country_code, username, password, is_admin) VALUES ('Lance', 20, 'US', 'LanChr', 'lancePass', false);"
references:
  - label: "SQLite — Autoincrement"
    url: "https://www.sqlite.org/autoinc.html"
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
    (2, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false);
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
  kind: data
  instruction: "Adicione mais dois registros à tabela `users` SEM informar o id, deixando o banco incrementar automaticamente: (1) Lance, 20, US, LanChr, lancePass, não admin; (2) Tiffany, 28, US, Tifferoon, autoincrement, admin."
  expectedTables:
    - name: users
      columns: [id, name, age, country_code, username, password, is_admin]
      rows:
        - [1, "David", 34, "US", "DavidDev", "insertPractice", 0]
        - [2, "Samantha", 29, "BR", "Sammy93", "addingRecords!", 0]
        - [3, "Lance", 20, "US", "LanChr", "lancePass", 0]
        - [4, "Tiffany", 28, "US", "Tifferoon", "autoincrement", 1]
      orderSensitive: false
---

## Contexto

Muitos dialetos de SQL suportam um recurso de **AUTO INCREMENT**. Ao inserir
registros em uma tabela com AUTO INCREMENT habilitado, o banco atribui o
próximo valor automaticamente. No SQLite, um campo `id` inteiro com a
constraint `PRIMARY KEY` auto-incrementa por padrão!

### IDs

Dependendo de como seu banco é configurado, você pode usar ids tradicionais ou
UUIDs. O SQL não suporta auto-incrementar um UUID, então se seu banco usa UUIDs
o servidor terá que lidar com a geração dos ids de cada registro.

### Usando AUTO INCREMENT no SQLite

Estamos usando ids tradicionais no nosso banco, então podemos aproveitar o
recurso de auto incremento. Diferentes dialetos de SQL implementam esse recurso
de formas diferentes, mas no SQLite qualquer coluna com a constraint `INTEGER
PRIMARY KEY` auto-incrementa! Então podemos omitir o campo `id` na instrução
INSERT e deixar o banco adicionar esse campo automaticamente.

## Sua vez

Vamos adicionar mais alguns registros à tabela `users`, mas permitindo que o
banco incremente o campo `id` automaticamente. Adicione os seguintes registros:

**Registro 1**
- `name`: 'Lance'
- `age`: 20
- `country_code`: 'US'
- `username`: 'LanChr'
- `password`: 'lancePass'
- `is_admin`: false

**Registro 2**
- `name`: 'Tiffany'
- `age`: 28
- `country_code`: 'US'
- `username`: 'Tifferoon'
- `password`: 'autoincrement'
- `is_admin`: true