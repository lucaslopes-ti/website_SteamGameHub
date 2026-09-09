---
id: filtros-05
title: "Combinando condições com AND"
summary: "Use AND para combinar condições e refinar ainda mais suas consultas."
chapter: 5
chapterSlug: filtros
lesson: 5
difficulty: iniciante
xp: 40
prerequisites:
  - filtros-04
hints:
  - "Combine country_code = 'CA' com age < 18 usando AND."
  - "SELECT * FROM users WHERE country_code = 'CA' AND age < 18;"
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
    (7, 'Noah', 41, 'AU', 'NoahRoot', 'koalaKernel', true);
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
  instruction: "Escreva uma consulta que retorne todas as colunas dos usuários da tabela `users` que são do Canadá (CA) e têm menos de 18 anos."
  expectedColumns:
    - id
    - name
    - age
    - country_code
    - username
    - password
    - is_admin
  expectedRows:
    - [4, "Emma", 16, "CA", "EmmaDev", "mapleSQL", 0]
    - [6, "Mia", 17, "CA", "MiaDev", "firstAdult", 0]
  orderSensitive: false
---

## Contexto

Muitas vezes precisamos usar várias condições para recuperar exatamente a
informação que queremos. Podemos começar a estruturar consultas muito mais
complexas usando várias condições juntas para reduzir os resultados da nossa
consulta.

O operador lógico `AND` pode ser usado para reduzir ainda mais o nosso conjunto
de resultados!

### Operador AND

```sql
SELECT
  product_name,
  quantity,
  shipment_status
FROM
  products
WHERE
  shipment_status = 'pending'
  AND quantity BETWEEN 0 and 10;
```

Isso recupera apenas os registros em que o `shipment_status` é `"pending"` E a
`quantity` está entre 0 e 10.

### Operadores de comparação

Todos os operadores a seguir são suportados em SQL. O `=` é o principal para
ficar de olho — não é `==` como em muitas outras linguagens! O SQLite até
permite `==`, mas não é um bom hábito, pois outros dialetos de SQL não
reconhecem `==` como sintaxe válida.

- `=`
- `<`
- `>`
- `<=`
- `>=`
- `<>` ou `!=`

## Sua vez

As restrições legais no Canadá mudaram! A forma como precisamos lidar com as
transações de menores de idade canadenses no Senai Pay está mais regulamentada.
Precisamos encontrar todos esses usuários para ver quantos essa mudança afeta!

Escreva uma consulta que recupere todas as colunas dos usuários da tabela
`users` que são do Canadá (CA) e têm menos de 18 anos.