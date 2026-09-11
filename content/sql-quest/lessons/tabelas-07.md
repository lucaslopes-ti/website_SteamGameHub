---
id: tabelas-07
title: "Revisão de migrações"
summary: "Analise um par de migrações up/down realista e entenda o papel das ferramentas de migração."
chapter: 2
chapterSlug: tabelas
lesson: 7
difficulty: iniciante
xp: 28
prerequisites:
  - tabelas-06
hints: []
references:
  - label: "SQLite — ALTER TABLE"
    url: "https://www.sqlite.org/lang_altertable.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Por que migrações 'boas' são escritas de forma reversível?"
      options:
        - "Elas não são"
        - "Para que, se algo der errado, as mudanças possam ser revertidas"
        - "Porque você deve sempre reverter as mudanças antes de aplicar novas"
      answer: 1
      explanation: "Migrações reversíveis permitem desfazer mudanças com segurança quando algo quebra."
    - prompt: "Migrações de banco costumam estar acopladas a atualizações de código da aplicação?"
      options:
        - "Sim"
        - "Não"
      answer: 0
      explanation: "Sim: se o schema muda, o código que usa o schema antigo pode quebrar. Por isso as mudanças costumam andar juntas."
---

## Contexto

Vamos analisar uma migração mais realista, que reflete uma evolução comum.

### Exemplo

A tabela `projects` está sendo renomeada para `initiatives` para refletir
melhor como os times planejam e acompanham o trabalho de longo prazo. Também
queremos registrar quando cada iniciativa foi lançada oficialmente.

**Migração up:**

```sql
ALTER TABLE projects RENAME TO initiatives;

ALTER TABLE initiatives ADD COLUMN launched_at TIMESTAMP;
```

**Migração down:**

```sql
ALTER TABLE initiatives DROP COLUMN launched_at;

ALTER TABLE initiatives RENAME TO projects;
```

Esse par de migrações é reversível e seguro. Se algo quebrar, podemos desfazer.

### Ferramentas de migração no mundo real

Em projetos reais, não executamos migrações SQL cruas. Usamos ferramentas que
ajudam a:

- Rastrear quais migrações já foram aplicadas;
- Organizar migrações em arquivos;
- Aplicar e reverter com segurança.

Exemplos: Goose (Go), Flyway (Java), Liquibase (Java), Alembic (Python),
Prisma Migrate (TypeScript) e Drizzle Kit (TypeScript).

### Fluxo de trabalho típico

1. Escreva os arquivos de migração, por exemplo:
   `001_add_columns_to_transactions.up.sql` e
   `001_add_columns_to_transactions.down.sql`.
2. Aplique-os usando uma CLI (ex.: `migrate up`).
3. A ferramenta registra quais migrações rodaram e evita duplicatas.

Os arquivos de migração são versionados como código: eles viajam com o projeto,
então seus colegas e o sistema de CI sempre aplicam as mesmas mudanças de
schema na ordem certa.

## Sua vez

Responda às perguntas do desafio.