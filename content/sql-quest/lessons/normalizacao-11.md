---
id: normalizacao-11
title: "Prática: usuários e bancos"
summary: "Modele um relacionamento muitos-para-muitos entre users e banks."
chapter: 9
chapterSlug: normalizacao
lesson: 11
difficulty: intermediario
xp: 41
prerequisites:
  - normalizacao-10
hints:
  - "Crie banks sem o prefixo bank_: name, agency e account."
  - "Na junção users_banks, use UNIQUE (user_id, bank_id) para não repetir o par."
  - "Adicione FOREIGN KEY (user_id) REFERENCES users(id) e FOREIGN KEY (bank_id) REFERENCES banks(id)."
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
    is_admin BOOLEAN,
    bank_name TEXT,
    bank_agency TEXT,
    bank_account TEXT
  );

  INSERT INTO users (id, name, age, country_code, username, password, is_admin, bank_name, bank_agency, bank_account) VALUES
    (1, 'David', 34, 'US', 'DavidDev', 'insertPractice', false, 'Banco Central', '0001', '12345-6'),
    (2, 'Samantha', 29, 'BR', 'Sammy93', 'addingRecords!', false, 'Banco do Brasil', '1234', '98765-4');
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
      - name: bank_name
        type: TEXT
      - name: bank_agency
        type: TEXT
      - name: bank_account
        type: TEXT
challenge:
  kind: schema
  instruction: "Crie a tabela `banks` com as colunas de banco que estavam em `users`, sem o prefixo bank_ (`name`, `agency`, `account`) e `id` INTEGER PRIMARY KEY. Crie também `users_banks` com `user_id` e `bank_id`, uma restrição de unicidade sobre os dois juntos e chaves estrangeiras para `users(id)` e `banks(id)`."
  expectedTables:
    - name: banks
      columns:
        - name: id
          type: INTEGER
          primaryKey: true
        - name: name
          type: TEXT
        - name: agency
          type: TEXT
        - name: account
          type: TEXT
    - name: users_banks
      columns:
        - name: user_id
          type: INTEGER
        - name: bank_id
          type: INTEGER
      foreignKeys:
        - columns: [user_id]
          table: users
          referencedColumns: [id]
        - columns: [bank_id]
          table: banks
          referencedColumns: [id]
---

## Contexto

Alguém adicionou à tabela `users` do Senai Pay novas colunas com informações
sobre a instituição bancária do usuário. Infelizmente, quem fez essa mudança
assumiu que um usuário poderia ter **apenas um** banco.

Sabemos que um usuário pode ser cliente de **vários bancos**, e que cada banco
pode atender **muitos** usuários do Senai Pay. Sua tarefa é limpar a tabela
`users` e criar as tabelas adicionais necessárias para representar corretamente
esse relacionamento muitos-para-muitos entre bancos e usuários.

## Sua vez

Faça o seguinte:

1. Crie uma nova tabela chamada `banks` contendo as colunas relacionadas a
   banco que foram adicionadas incorretamente à tabela `users` com o prefixo
   `bank_`. Não use mais o prefixo `bank_` no nome das colunas. (Não se
   preocupe em alterar a tabela `users` agora.)
2. Crie uma tabela de junção chamada `users_banks` com as colunas `user_id` e
   `bank_id`. Adicione as restrições necessárias para que nunca exista uma
   linha duplicada com a mesma combinação de `user_id` e `bank_id`.
3. Adicione chaves estrangeiras para que `user_id` referencie `users(id)` e
   `bank_id` referencie `banks(id)`.
