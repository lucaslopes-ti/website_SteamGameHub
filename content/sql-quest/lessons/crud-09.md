---
id: crud-09
title: "O perigo de excluir dados"
summary: "Conheça os padrões que protegem sistemas reais contra exclusões acidentais."
chapter: 4
chapterSlug: crud
lesson: 9
difficulty: iniciante
xp: 30
prerequisites:
  - crud-08
hints: []
references:
  - label: "SQLite — DELETE"
    url: "https://www.sqlite.org/lang_delete.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual padrão marca linhas como excluídas sem removê-las de verdade?"
      options:
        - "Hard delete"
        - "Soft delete com uma coluna deleted_at"
        - "Backup diário"
        - "Cache em memória"
      answer: 1
      explanation: "O soft delete usa uma coluna (ex.: deleted_at) para marcar a linha como excluída."
    - prompt: "Qual prática ajuda a evitar um DELETE sem WHERE em produção?"
      options:
        - "Rodar um SELECT antes com o mesmo WHERE para pré-visualizar as linhas"
        - "Nunca usar WHERE no DELETE"
        - "Excluir a tabela e recriar"
        - "Usar DELETE em todas as tabelas ao mesmo tempo"
      answer: 0
      explanation: "Pré-visualizar com SELECT e depois usar o mesmo WHERE reduz o risco de apagar linhas demais."
---

## Contexto

`DELETE` é irreversível dentro do próprio banco. Sistemas de produção se
protegem com:

- **Soft deletes**: uma coluna `deleted_at` marca as linhas em vez de removê-las;
- **Backups** antes de operações destrutivas;
- **Permissões restritas**: a maioria dos usuários da aplicação não pode
  executar `DELETE`;
- **Foreign keys com `ON DELETE RESTRICT`**, impedindo linhas órfãs
  relacionadas.

### Lição do mundo real

Um administrador rodou um script sem `WHERE` e perdeu dados de clientes; a
recuperação levou dias. **Regra de ouro:** primeiro rode um `SELECT` para
pré-visualizar as linhas e depois faça o `DELETE` com o mesmo `WHERE`.

## Sua vez

Responda às perguntas do desafio.