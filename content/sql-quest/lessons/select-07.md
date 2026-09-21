---
id: select-07
title: "Tipagem flexível do SQLite"
summary: "Descubra que o SQLite não impõe checagem de tipos e entenda por que isso exige cuidado."
chapter: 1
chapterSlug: select
lesson: 7
difficulty: iniciante
xp: 34
prerequisites:
  - select-06
hints:
  - "A missão tem três etapas na mesma consulta: criar a tabela, inserir duas linhas e, por fim, ler tudo."
  - "Ao criar a tabela, cada coluna recebe um nome e um tipo: `id` é inteiro, `name` é texto e `age` é inteiro."
  - "No segundo registro, coloque de propósito o valor inteiro `1` na coluna `name`; a ideia é testar a tipagem flexível do SQLite."
  - "Separe as três instruções com ponto e vírgula e termine lendo todos os registros da tabela."
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

A missão é criar uma tabela, inserir dois registros e ler o resultado para observar a tipagem flexível do SQLite.

Faça, nesta ordem:

1. crie a tabela `users` com `id` (INTEGER), `name` (TEXT) e `age` (INTEGER);
2. insira um registro com `name` igual a `Ana Souza`;
3. insira outro registro com o número inteiro `1` na coluna `name`;
4. finalize lendo todos os registros da tabela.

O objetivo é notar que o SQLite aceita guardar um inteiro onde o tipo declarado era TEXT.