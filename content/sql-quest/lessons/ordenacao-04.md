---
id: ordenacao-04
title: "Prática: do mais velho ao mais novo"
summary: "Pratique a ordenação decrescente com ORDER BY ... DESC."
chapter: 6
chapterSlug: ordenacao
lesson: 4
difficulty: iniciante
xp: 28
prerequisites:
  - ordenacao-03
hints:
  - "A missão é listar nome e idade dos usuários, do mais velho para o mais novo."
  - "Selecione apenas as colunas `name` e `age`."
  - "Use a cláusula de ordenação sobre a coluna de idade, em ordem decrescente."
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
    (6, 'Allan', 27, 'US', 'Alires', 'welovebootdev', true),
    (7, 'Al', 44, 'JP', 'quickCoder', 'SQLrocks', false),
    (8, 'Tiffany', 28, 'US', 'TiffT', 'tiffanyPass', true),
    (9, 'Marta', 36, 'ES', 'MartaDBA', 'spainPass', true),
    (10, 'Yuki', 58, 'JP', 'YukiSensei', 'retireSoon', false);
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
  instruction: "Retorne os campos `name` e `age` de todos os usuários da tabela `users`, ordenados da maior idade para a menor idade."
  expectedColumns:
    - name
    - age
  expectedRows:
    - ["Yuki", 58]
    - ["Al", 44]
    - ["Ram", 42]
    - ["John", 39]
    - ["Marta", 36]
    - ["David", 34]
    - ["Hunter", 30]
    - ["Samantha", 29]
    - ["Tiffany", 28]
    - ["Allan", 27]
  orderSensitive: true
---

## Contexto

O sentido da ordenação importa! Considere este resultado:

| name | age |
|---|---|
| Ashley | 20 |
| Rory | 22 |
| Lane | 27 |
| Preston | 30 |

Ele está ordenado por `age` em ordem **crescente** (`ASC`, o padrão do
`ORDER BY`), porque as idades vão de 20 até 30. A consulta que gera esse
resultado seria:

```sql
SELECT * FROM people ORDER BY age;
```

Para obter o resultado invertido — da maior idade para a menor — precisamos
explicitar `DESC`:

```sql
SELECT * FROM people ORDER BY age DESC;
```

## Sua vez

Retorne os campos `name` e `age` de todos os usuários da tabela `users`,
ordenados da **maior idade** para a **menor idade**.
