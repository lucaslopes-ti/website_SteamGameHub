---
id: select-07
title: "Tipagem flexível do SQLite"
summary: "Descubra que o SQLite não impõe checagem de tipos e entenda por que isso exige cuidado."
chapter: 1
chapterSlug: select
lesson: 7
difficulty: iniciante
xp: 50
prerequisites:
  - select-06
hints:
  - "Crie a tabela users com as colunas id, name e age."
  - "O segundo INSERT deve usar o valor 1 (inteiro) na coluna name."
  - "Termine com um SELECT * FROM users;"
references:
  - label: "SQLite — Datatypes"
    url: "https://www.sqlite.org/datatype3.html"
setupSql: |
  -- Nenhum setup necessário: nesta unidade você cria a tabela do zero.
challenge:
  kind: schema
  instruction: "Crie a tabela `users` com as colunas `id` (INTEGER), `name` (TEXT) e `age` (INTEGER). Depois insira dois registros: o primeiro com name 'Ana Souza' e o segundo com o valor inteiro 1 na coluna name. Finalize com um SELECT * FROM users."
  expectedTables:
    - name: users
      columns:
        - name: id
          type: INTEGER
        - name: name
          type: TEXT
        - name: age
          type: INTEGER
---

## Contexto

Vamos comparar alguns bancos SQL bem estabelecidos. Os mais populares hoje
incluem PostgreSQL, MySQL, Microsoft SQL Server e SQLite. Embora todos usem
SQL, cada banco define regras e estratégias próprias.

O SQLite é um sistema de gerenciamento de banco de dados (DBMS) **sem
servidor**: ele roda dentro da própria aplicação. Já o PostgreSQL usa o modelo
cliente-servidor e exige um servidor instalado e escutando na rede, parecido
com um servidor HTTP.

### O SQLite não impõe checagem de tipos

Observe o `CREATE TABLE` abaixo: a coluna `name` é definida como `TEXT`.

```sql
CREATE TABLE users (id INTEGER, name TEXT, age INTEGER);
INSERT INTO users (id, name, age) VALUES (1, 'Ana Souza', 21);
INSERT INTO users (id, name, age) VALUES (2, 1, 33);
SELECT * FROM users;
```

Repare que, mesmo definindo `name` como `TEXT`, o SQLite **permitiu** guardar o
inteiro `1` nessa coluna. Assim como Python e JavaScript, o SQLite tem um
sistema de tipos flexível: você pode armazenar qualquer tipo de dado em
qualquer campo, independentemente de como ele foi definido.

**Lembre-se:** só porque você *pode* fazer algo, não significa que *deve*.
Na prática, manter os tipos consistentes evita bugs silenciosos.

## Sua vez

Crie a tabela `users` com as colunas `id` (INTEGER), `name` (TEXT) e `age`
(INTEGER). Insira dois registros — o segundo deve ter o valor inteiro `1` na
coluna `name` — e finalize com um `SELECT * FROM users;`.