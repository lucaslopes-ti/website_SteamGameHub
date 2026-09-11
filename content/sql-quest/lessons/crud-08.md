---
id: crud-08
title: "Excluindo registros com DELETE"
summary: "Use DELETE com WHERE para remover um registro específico da tabela."
chapter: 4
chapterSlug: crud
lesson: 8
difficulty: iniciante
xp: 34
prerequisites:
  - crud-07
hints:
  - "Use DELETE FROM users seguido de WHERE."
  - "Filtre pelo nome da usuária: WHERE name = 'Samantha'."
  - "DELETE FROM users WHERE name = 'Samantha';"
references:
  - label: "SQLite — DELETE"
    url: "https://www.sqlite.org/lang_delete.html"
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
    (3, 'John', 39, 'CA', 'Jjdev21', 'sqlMaster2024', false);
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
  instruction: "Samantha, uma das usuárias do Senai Pay, optou por excluir a conta dela. Remova o registro dela da tabela `users`."
  expectedTables:
    - name: users
      columns: [id, name, age, country_code, username, password, is_admin]
      rows:
        - [1, "David", 34, "US", "DavidDev", "insertPractice", 0]
        - [3, "John", 39, "CA", "Jjdev21", "sqlMaster2024", 0]
      orderSensitive: false
---

## Contexto

Quando um usuário exclui a conta dele em uma rede social, ou exclui um
comentário em um vídeo, esses dados precisam ser removidos do banco de dados
correspondente.

### Instrução DELETE

Uma instrução `DELETE` remove todos os registros de uma tabela que correspondem
à cláusula `WHERE`. Por exemplo:

```sql
DELETE FROM employees
WHERE
  id = 251;
```

Esta instrução DELETE remove todos os registros da tabela `employees` que têm
`id` igual a 251!

## Sua vez

Samantha, uma das usuárias do Senai Pay, optou por excluir a conta dela e parar
de usar o aplicativo... o que nos deixa tristes. De qualquer forma, precisamos
remover o registro dela do banco de dados!

Exclua o registro da Samantha da tabela `users`.