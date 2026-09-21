---
id: normalizacao-06
title: "Primeira forma normal (1NF)"
summary: "Adicione uma chave primária à tabela companies para atingir a 1NF."
chapter: 9
chapterSlug: normalizacao
lesson: 6
difficulty: intermediario
xp: 34
prerequisites:
  - normalizacao-05
hints:
  - "A missão é reconstruir a tabela `companies` para que ela tenha uma chave primária."
  - "No SQLite não dá para transformar uma coluna existente em chave primária; é preciso recriar a tabela."
  - "Remova a tabela atual e crie-a de novo, com `id` INTEGER PRIMARY KEY como primeira coluna."
  - "Mantenha `name` e `num_employees` como NOT NULL, com os mesmos tipos."
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
setupSql: |
  CREATE TABLE companies (name TEXT NOT NULL, num_employees INTEGER NOT NULL);

  INSERT INTO companies (name, num_employees) VALUES
    ('WorldBanc', 80),
    ('WorldBanc', 80),
    ('Fantasy Quest', 30);
tables:
  - name: companies
    columns:
      - name: name
        type: TEXT
        notNull: true
      - name: num_employees
        type: INTEGER
        notNull: true
challenge:
  kind: schema
  instruction: "Coloque a tabela `companies` na primeira forma normal: recrie-a com um campo `id` INTEGER PRIMARY KEY como primeira coluna, mantendo `name` (TEXT NOT NULL) e `num_employees` (INTEGER NOT NULL)."
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
---

## Contexto

Para estar de acordo com a **primeira forma normal** (1NF), uma tabela precisa
seguir apenas duas regras:

1. Ter uma **chave primária única**;
2. Nenhuma célula pode ter uma **tabela aninhada** como valor (em alguns
   bancos isso nem é possível).

### Exemplo que NÃO está na 1NF

| name | age | email |
|---|---|---|
| Lane | 27 | lane@example.com |
| Lane | 27 | lane@example.com |
| Allan | 27 | allan@example.com |

Essa tabela não adere à 1NF: há duas linhas idênticas, então não existe uma
chave primária única para cada linha.

### Exemplo na 1NF

A forma mais simples (mas não a única) de chegar à 1NF é adicionar uma coluna
`id` única. Também vale criar a chave primária garantindo que duas colunas
sejam sempre únicas **em conjunto**.

### Quase sempre aderimos à 1NF

A primeira forma normal é simplesmente uma boa ideia — praticamente todo schema
real mantém cada tabela, no mínimo, na 1NF.

### O contexto do Senai Pay

Uma estagiária do Senai Pay criou a tabela `companies`, que guardará os dados
dos clientes empresariais. Infelizmente, ela cometeu o pecado imperdoável: **não
há chave primária** na tabela! Podemos ter linhas inteiras duplicadas.

Adicione um campo `id` como primeira coluna, do tipo inteiro e com a restrição
`PRIMARY KEY`. Ao final, a tabela `companies` estará na primeira forma normal.

## Sua vez

A missão é colocar a tabela `companies` na primeira forma normal, garantindo uma chave primária.

Seus passos:

1. remova a tabela atual;
2. recrie `companies` com `id` INTEGER PRIMARY KEY como primeira coluna;
3. mantenha `name` TEXT NOT NULL e `num_employees` INTEGER NOT NULL.

Lembre-se de que essa é uma tabela nova: os dados antigos não são preservados.
