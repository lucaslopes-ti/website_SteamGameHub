---
id: normalizacao-03
title: "Muitos para muitos: países"
summary: "Crie countries e a tabela de junção users_countries para ligar usuários e países."
chapter: 9
chapterSlug: normalizacao
lesson: 3
difficulty: intermediario
xp: 41
prerequisites:
  - normalizacao-02
hints:
  - "Remova a coluna: ALTER TABLE users DROP COLUMN country_code;"
  - "CREATE TABLE countries (id INTEGER PRIMARY KEY, country_code TEXT, name TEXT);"
  - "Na junção, some UNIQUE (country_id, user_id) e as duas FOREIGN KEY."
references:
  - label: "SQLite — Foreign Keys"
    url: "https://www.sqlite.org/foreignkeys.html"
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
  kind: schema
  instruction: "Faça a ligação muitos-para-muitos entre usuários e países: remova `country_code` de `users`; crie a tabela `countries` (id PRIMARY KEY, country_code TEXT, name TEXT); e crie `users_countries` com `country_id` e `user_id`, uma restrição única sobre os dois juntos e chaves estrangeiras para `countries(id)` e `users(id)`."
  expectedTables:
    - name: users
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
      forbidColumns:
        - country_code
    - name: countries
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
        - name: country_code
          type: TEXT
        - name: name
          type: TEXT
    - name: users_countries
      columns:
        - name: country_id
          type: INTEGER
        - name: user_id
          type: INTEGER
      foreignKeys:
        - columns: [country_id]
          table: countries
          referencedColumns: [id]
        - columns: [user_id]
          table: users
          referencedColumns: [id]
---

## Contexto

Um relacionamento **muitos para muitos** (N:N) acontece quando vários registros
de uma tabela podem se relacionar com vários registros de outra. Alguns
exemplos:

- uma tabela `products` e uma tabela `suppliers` — um produto pode ter vários
  fornecedores e um fornecedor pode fornecer vários produtos;
- uma tabela `classes` e uma tabela `students` — um aluno pode cursar várias
  turmas e uma turma tem vários alunos.

### Tabela de junção

Quando não há como guardar a ligação em nenhum dos dois lados, criamos uma
**tabela de junção**, que contém as chaves das duas entidades. Muitas vezes
queremos impedir que o mesmo par se repita, e para isso usamos uma restrição
`UNIQUE` **sobre as duas colunas juntas**:

```sql
CREATE TABLE product_suppliers (
  product_id INTEGER,
  supplier_id INTEGER,
  UNIQUE (product_id, supplier_id),
  FOREIGN KEY (product_id) REFERENCES products (id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
);
```

Isso permite que várias linhas compartilhem o mesmo `product_id` ou o mesmo
`supplier_id`, mas impede que duas linhas tenham **os dois** valores iguais.

### O contexto do Senai Pay

Originalmente, cada usuário tinha um único campo `country_code`. Mas muitos
usuários têm dupla cidadania!

Se simplesmente colocássemos um `user_id` na tabela `countries`, teríamos
registros de país duplicados: dois usuários dos Estados Unidos criariam dois
registros "Estados Unidos". É melhor que cada país tenha **um único** registro,
para atualizar seus dados em um só lugar.

Como um usuário pode ter vários países e um país pode ter vários usuários,
temos um relacionamento N:N. Vamos usar uma tabela de junção para ligar
`users` e `countries`.

## Sua vez

Faça o seguinte:

1. Remova o campo `country_code` da tabela `users`.
2. Crie a tabela `countries` com 3 campos: `id` (inteiro, chave primária),
   `country_code` (TEXT) e `name` (TEXT).
3. Crie a tabela `users_countries` com dois campos: `country_id` e `user_id`.
4. Adicione uma restrição de unicidade sobre os dois campos juntos.
5. Adicione chaves estrangeiras para que cada campo referencie o `id` da sua
   tabela (`countries` ou `users`).
