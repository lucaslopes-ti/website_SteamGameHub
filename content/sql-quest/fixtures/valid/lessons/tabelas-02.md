---
id: tabelas-02
title: "Renomeando colunas com ALTER TABLE"
summary: "Use ALTER TABLE para renomear uma coluna e alinhar nomes ao negócio."
chapter: 2
chapterSlug: tabelas
lesson: 2
difficulty: intermediario
xp: 60
prerequisites:
  - tabelas-01
hints:
  - "Use ALTER TABLE cartoes com RENAME COLUMN."
  - "A ordem é: nome atual primeiro, nome novo depois do TO."
references:
  - label: "SQLite — ALTER TABLE"
    url: "https://www.sqlite.org/lang_altertable.html"
setupSql: |
  CREATE TABLE cartoes (
    id INTEGER PRIMARY KEY,
    numero TEXT,
    bandeira TEXT
  );

  INSERT INTO cartoes (id, numero, bandeira) VALUES
    (1, '4111111111111111', 'Visa'),
    (2, '5500000000000004', 'Mastercard');
tables:
  - name: cartoes
    columns:
      - name: id
        type: INTEGER
        primaryKey: true
      - name: numero
        type: TEXT
      - name: bandeira
        type: TEXT
challenge:
  kind: schema
  instruction: "Renomeie a coluna `numero` da tabela `cartoes` para `codigo`."
  expectedTables:
    - name: cartoes
      columns:
        - name: codigo
          type: TEXT
      forbidColumns:
        - numero
---

## Contexto

Com o tempo, nomes de colunas podem ficar desatualizados. Para renomear uma
coluna em uma tabela que já existe, o SQLite oferece:

```sql
ALTER TABLE tabela RENAME COLUMN nome_atual TO nome_novo;
```

Apenas o nome muda: os valores e o tipo permanecem intactos.

## Sua vez

No NexoPay, a equipe de cartões percebeu que `numero` é genérico demais — o
campo identifica o código do cartão. Renomeie a coluna `numero` para `codigo`.