---
id: agregacao-08
title: "Arredondando com ROUND"
summary: "Use ROUND() para arredondar o resultado de uma agregação para um número inteiro."
chapter: 7
chapterSlug: agregacao
lesson: 8
difficulty: iniciante
xp: 34
prerequisites:
  - agregacao-07
hints:
  - "Envolva a agregação AVG(age) com a função ROUND."
  - "Dê o apelido (alias) round_age à coluna retornada."
  - "SELECT ROUND(AVG(age)) AS round_age FROM users;"
references:
  - label: "SQLite — Core Functions"
    url: "https://www.sqlite.org/lang_corefunc.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    country_code TEXT NOT NULL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, country_code, is_admin) VALUES
    (1, 'David', 34, 'US', false),
    (2, 'Samantha', 29, 'BR', false),
    (3, 'John', 39, 'CA', false),
    (4, 'Ram', 42, 'IN', false),
    (5, 'Hunter', 30, 'US', false),
    (6, 'Allan', 27, 'US', true),
    (7, 'Al', 39, 'JP', false),
    (8, 'Tiffany', 28, 'US', true),
    (9, 'Marta', 36, 'ES', true),
    (10, 'Noah', 41, 'AU', true);
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
      - name: is_admin
        type: BOOLEAN
challenge:
  kind: exact
  instruction: "Corrija a consulta para que ela retorne a média como um número inteiro (arredondado). Renomeie a coluna resultante para round_age."
  expectedColumns:
    - round_age
  expectedRows:
    - [35]
  orderSensitive: false
---

## Contexto

Às vezes precisamos **arredondar** números, principalmente quando trabalhamos
com resultados de agregações. Podemos usar a função `ROUND()` para isso.

A função `ROUND()` do SQL permite especificar tanto o valor que você deseja
arredondar quanto o grau de precisão a ser aplicado:

```
ROUND(value, precision)
```

Se nenhuma precisão for informada, o SQL arredonda o valor para o inteiro mais
próximo:

```sql
SELECT ROUND(AVG(song_length)) FROM songs;
```

Essa consulta retorna a média de `song_length` da tabela `songs`, arredondada
para o número inteiro mais próximo.

Se informarmos uma precisão, o SQL arredonda para aquela quantidade de casas
decimais:

```sql
SELECT ROUND(AVG(song_length), 1) FROM songs;
```

A mesma consulta, mas arredondada para uma casa decimal.

### O contexto do Senai Pay

O time de produto quer a idade média dos usuários como um número inteiro.

## Sua vez

Corrija a consulta para que ela retorne a média como um número inteiro
(arredondado). Renomeie a coluna resultante para `round_age`.