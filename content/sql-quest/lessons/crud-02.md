---
id: crud-02
title: "A instrução INSERT"
summary: "Adicione registros a uma tabela com INSERT INTO, especificando as colunas e os valores."
chapter: 4
chapterSlug: crud
lesson: 2
difficulty: iniciante
xp: 34
prerequisites:
  - crud-01
hints:
  - "A missão é inserir dois usuários completos na tabela `users`, respeitando a ordem das colunas."
  - "Use o comando de inserção, informe entre parênteses a lista de colunas e depois a palavra que introduz os valores."
  - "Cada linha de valores segue a mesma ordem das colunas informadas: texto entre aspas; números e booleanos sem aspas."
  - "São duas linhas de dados. Como você informa todos os campos, os registros recebem `id` 1 e `id` 2."
references:
  - label: "SQLite — INSERT"
    url: "https://www.sqlite.org/lang_insert.html"
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
  instruction: "Insira os dois registros abaixo na tabela `users`, usando a estrutura do CREATE TABLE como referência: (1) David, 34, US, DavidDev, insertPractice, não admin; (2) Samantha, 29, BR, Sammy93, addingRecords!, não admin."
  expectedTables:
    - name: users
      columns: [id, name, age, country_code, username, password, is_admin]
      rows:
        - [1, "David", 34, "US", "DavidDev", "insertPractice", 0]
        - [2, "Samantha", 29, "BR", "Sammy93", "addingRecords!", 0]
      orderSensitive: false
---

## Contexto

Tabelas são praticamente inúteis sem dados! Em SQL, adicionamos registros a uma
tabela usando a instrução `INSERT INTO`. Ao usar um INSERT, precisamos primeiro
especificar a tabela em que vamos inserir o registro, seguida dos campos dessa
tabela que queremos preencher com `VALUES`.

Exemplo de instrução INSERT:

```sql
INSERT INTO
  employees (id, name, title)
VALUES
  (1, 'Allan', 'Engineer');
```

Vamos começar adicionando manualmente alguns registros à tabela `users` do
Senai Pay!

## Sua vez

Observe a instrução `CREATE TABLE` no código de setup para entender a estrutura
da tabela `users` e use essa informação para inserir os seguintes registros:

**Registro 1**
- `id`: 1
- `name`: 'David'
- `age`: 34
- `country_code`: 'US'
- `username`: 'DavidDev'
- `password`: 'insertPractice'
- `is_admin`: false

**Registro 2**
- `id`: 2
- `name`: 'Samantha'
- `age`: 29
- `country_code`: 'BR'
- `username`: 'Sammy93'
- `password`: 'addingRecords!'
- `is_admin`: false