---
id: normalizacao-07
title: "Segunda forma normal (2NF)"
summary: "Mova `revenue` da tabela de junção para `companies` e elimine a dependência parcial."
chapter: 9
chapterSlug: normalizacao
lesson: 7
difficulty: intermediario
xp: 34
prerequisites:
  - normalizacao-06
hints:
  - "A informação revenue descreve a empresa, não a ligação entre usuário e empresa."
  - "Adicione a coluna à empresa: ALTER TABLE companies ADD COLUMN revenue REAL;"
  - "Remova da junção: ALTER TABLE users_companies DROP COLUMN revenue;"
references:
  - label: "SQLite — ALTER TABLE"
    url: "https://www.sqlite.org/lang_altertable.html"
setupSql: |
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, age INTEGER NOT NULL);
  CREATE TABLE companies (id INTEGER PRIMARY KEY, name TEXT NOT NULL, num_employees INTEGER NOT NULL);
  CREATE TABLE users_companies (
    user_id INTEGER,
    company_id INTEGER,
    revenue REAL,
    UNIQUE (user_id, company_id)
  );

  INSERT INTO users (id, name, age) VALUES (1, 'David', 34), (2, 'Samantha', 29);
  INSERT INTO companies (id, name, num_employees) VALUES (1, 'WorldBanc', 80);
  INSERT INTO users_companies (user_id, company_id, revenue) VALUES (1, 1, 1500.0);
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
  - name: companies
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: name
        type: TEXT
        notNull: true
      - name: num_employees
        type: INTEGER
        notNull: true
  - name: users_companies
    columns:
      - name: user_id
        type: INTEGER
        references: { table: users, column: id }
      - name: company_id
        type: INTEGER
        references: { table: companies, column: id }
      - name: revenue
        type: REAL
challenge:
  kind: schema
  instruction: "Mova a coluna que está fora de lugar para a tabela correta: adicione `revenue` como a última coluna de `companies` e remova `revenue` da tabela de junção `users_companies`."
  expectedTables:
    - name: companies
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
        - name: name
          type: TEXT
          notNull: true
        - name: num_employees
          type: INTEGER
          notNull: true
        - name: revenue
          type: REAL
    - name: users_companies
      columns:
        - name: user_id
          type: INTEGER
        - name: company_id
          type: INTEGER
      forbidColumns:
        - revenue
---

## Contexto

Uma tabela na **segunda forma normal** (2NF) segue todas as regras da primeira
forma normal e mais uma, que só se aplica a **chaves primárias compostas**:

> Todas as colunas que não fazem parte da chave primária dependem da chave
> primária **inteira**, e não apenas de uma parte dela.

### Exemplo na 1NF, mas não na 2NF

Na tabela abaixo, a chave primária é a combinação de `first_name` +
`last_name`:

| first_name | last_name | first_initial |
|---|---|---|
| Lane | Wagner | l |
| Lane | Small | l |
| Allan | Wagner | a |

Ela não está na 2NF: `first_initial` depende apenas de `first_name`, o que a
torna redundante. Uma forma de corrigir é criar uma tabela separada que mapeia
`first_name` para `first_initial`.

### O contexto do Senai Pay

Outro desenvolvedor do time criou a tabela de junção para o relacionamento
muitos-para-muitos entre `companies` e `users`, mas cometeu um deslize: incluiu
**informações sobre a empresa** na tabela de junção!

Uma boa tabela de junção contém apenas os IDs das entidades do relacionamento.
Ela gerencia a relação e nada mais. Qualquer informação sobre as entidades
pertence às tabelas delas.

Mova a coluna que está fora de lugar para a tabela correta. Adicione-a como a
**última coluna** dessa tabela.

## Sua vez

Faça a alteração descrita no desafio.
