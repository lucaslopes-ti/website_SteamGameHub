---
id: normalizacao-08
title: "Terceira forma normal (3NF)"
summary: "Calcule o tamanho da empresa na consulta em vez de armazená-lo."
chapter: 9
chapterSlug: normalizacao
lesson: 8
difficulty: intermediario
xp: 41
prerequisites:
  - normalizacao-07
hints:
  - "Primeiro remova a coluna: ALTER TABLE companies DROP COLUMN size;"
  - "Calcule o valor com CASE WHEN num_employees > 100 THEN 'large' ELSE 'small' END."
  - "Dê o apelido (alias) size à expressão calculada."
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE companies (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    num_employees INTEGER NOT NULL,
    size TEXT
  );

  INSERT INTO companies (id, name, num_employees, size) VALUES
    (1, 'Pfizer', 10000, 'large'),
    (2, 'WorldBanc', 80, 'small'),
    (3, 'Fantasy Quest', 30, 'small'),
    (4, 'Walmart', 1000, 'large');
starterSql: |
  -- Remova a coluna armazenada e calcule o size na consulta.
  SELECT id, name, num_employees, size FROM companies;
tables:
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
      - name: size
        type: TEXT
challenge:
  kind: exact
  instruction: "Remova a coluna armazenada `size` (ALTER TABLE companies DROP COLUMN size) e escreva uma consulta que retorne `id`, `name` e `num_employees` e calcule uma coluna `size`: 'large' quando `num_employees` for maior que 100, senão 'small'."
  expectedColumns:
    - id
    - name
    - num_employees
    - size
  expectedRows:
    - [1, "Pfizer", 10000, "large"]
    - [2, "WorldBanc", 80, "small"]
    - [3, "Fantasy Quest", 30, "small"]
    - [4, "Walmart", 1000, "large"]
  orderSensitive: false
---

## Contexto

Uma tabela na **terceira forma normal** (3NF) segue todas as regras da segunda
forma normal e mais uma:

> Todas as colunas que não fazem parte da chave primária dependem **somente**
> da chave primária.

A diferença para a 2NF é sutil: na 2NF uma coluna não pode depender apenas de
**parte** da chave primária; na 3NF, uma coluna não pode depender de **nada**
que não seja a chave primária.

### Exemplo na 2NF, mas não na 3NF

Nesta tabela, a chave primária é a coluna `id`:

| id | name | first_initial | email |
|---|---|---|---|
| 1 | Lane | l | lane.works@example.com |
| 2 | Breanna | b | breanna@example.com |
| 3 | Lane | l | lane.right@example.com |

Ela está na 2NF porque `first_initial` não depende de parte da chave primária.
Porém, como depende da coluna `name`, não adere à 3NF. A correção é criar uma
tabela que mapeie `name` para `first_initial`.

### O contexto do Senai Pay

A tabela `companies` guarda um campo `size` que é **redundante**. Se uma empresa
tem mais de 100 funcionários, ela é "large"; caso contrário, é "small". Isso
pode ser **calculado** a partir de `num_employees`, sem armazenar o valor.

Na 3NF, não guardamos dados completamente dependentes de outros: calculamos na
hora em que precisamos.

## Sua vez

Remova a coluna `size` armazenada e escreva uma consulta que retorne `id`,
`name` e `num_employees` e calcule uma coluna `size`, valendo `'large'` quando
`num_employees` for maior que 100 e `'small'` caso contrário.
