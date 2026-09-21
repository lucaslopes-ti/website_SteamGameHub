---
id: select-03
title: "Selecionando várias colunas"
summary: "Combine colunas em uma única consulta e descubra a ordem em que elas aparecem no resultado."
chapter: 1
chapterSlug: select
lesson: 3
difficulty: iniciante
xp: 28
prerequisites:
  - select-02
hints:
  - "A missão é devolver três colunas específicas, na ordem exata pedida no enunciado."
  - "Liste os nomes das colunas separados por vírgula. A vírgula separa colunas dentro da mesma linha, não linhas diferentes."
  - "As colunas são `age`, `name` e `balance`; a tabela é `users`."
  - "Confira a ordem antes de rodar: `age` primeiro, depois `name` e por fim `balance`. A comparação do resultado leva a ordem em conta."
references:
  - label: "SQLite — SELECT"
    url: "https://www.sqlite.org/lang_select.html"
setupSql: |
  CREATE TABLE users (
    id INTEGER,
    name TEXT,
    age INTEGER,
    balance REAL,
    is_admin BOOLEAN
  );

  INSERT INTO users (id, name, age, balance, is_admin) VALUES
    (1, 'Ana Souza', 28, 450, 1),
    (2, 'Bruno Lima', 27, 200, 1),
    (3, 'Carla Mendes', 33, 496.24, 0);
tables:
  - name: users
    columns:
      - name: id
        type: INTEGER
      - name: name
        type: TEXT
      - name: age
        type: INTEGER
      - name: balance
        type: REAL
      - name: is_admin
        type: BOOLEAN
challenge:
  kind: exact
  instruction: "Selecione as colunas `age`, `name` e `balance` da tabela `users`, nessa ordem."
  expectedColumns:
    - age
    - name
    - balance
  expectedRows:
    - [28, "Ana Souza", 450]
    - [27, "Bruno Lima", 200]
    - [33, "Carla Mendes", 496.24]
  orderSensitive: false
---

## Contexto

Se você consegue selecionar todas as colunas com `*` e uma única coluna pelo
nome, também consegue selecionar várias colunas pelo nome. Basta listá-las
separadas por vírgula:

```sql
SELECT coluna_um, coluna_dois, coluna_tres FROM nome_da_tabela;
```

A ordem em que você escreve as colunas é a ordem em que elas aparecem no
resultado. Por exemplo, se tivéssemos uma tabela de jogos, poderíamos escrever:

```sql
SELECT vida, dano, defesa FROM monstros;
```

**Importante:** toda instrução SQL termina com ponto e vírgula (`;`).

## Sua vez

A missão é escolher mais de uma coluna da tabela `users`, na ordem correta.

Sua consulta deve:

- consultar a tabela `users`;
- devolver as colunas `age`, `name` e `balance`, exatamente nessa ordem;
- devolver todas as linhas, sem filtros.

A ordem das colunas faz parte do resultado esperado, então não a inverta.