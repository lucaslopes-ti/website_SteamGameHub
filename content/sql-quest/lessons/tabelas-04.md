---
id: tabelas-04
title: "Introdução a migrações"
summary: "Entenda o que são migrações de banco e por que elas precisam ser pequenas e seguras."
chapter: 2
chapterSlug: tabelas
lesson: 4
difficulty: iniciante
xp: 40
prerequisites:
  - tabelas-03
hints: []
references:
  - label: "SQLite — ALTER TABLE"
    url: "https://www.sqlite.org/lang_altertable.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual das afirmações sobre migrações é FALSA?"
      options:
        - "Você pode ser descuidado ao escrever migrações — uma migração ruim é fácil de corrigir"
        - "Migrações bem escritas são reversíveis"
        - "Migrações são mudanças incrementais feitas no banco de dados"
        - "Uma boa migração considera os sistemas que dependem do schema existente"
      answer: 0
      explanation: "Migrações ruins são perigosas: podem quebrar sistemas que dependem do schema antigo e são difíceis de reverter."
---

## Contexto

Uma **migração de banco** é uma mudança na estrutura de um banco de dados
relacional. Você pode pensar nela como um *commit* no Git, mas para o schema do
banco: cada migração registra como a estrutura dos seus dados evolui ao longo
do tempo.

Quando usamos `ALTER TABLE` para adicionar uma coluna, por exemplo, estamos
fazendo uma migração.

Migrações são essenciais para adaptar o banco a novos requisitos, corrigir
erros e lançar novos recursos. Em um time, elas garantem que todos apliquem as
mesmas mudanças na mesma ordem.

### Exemplo de migração ruim

Digamos que o backend do Senai Pay execute esta consulta regularmente:

```sql
SELECT * FROM people;
```

Se renomearmos a tabela `people` para `users` em uma migração, mas esquecermos
de atualizar o código, essa consulta vai quebrar — a tabela `people` não existe
mais!

### Uma abordagem mais segura

Distribua as mudanças de schema e de aplicação em fases **compatíveis com
versões anteriores**: mantenha o schema antigo disponível até que nenhum código
em execução dependa dele.

## Sua vez

Responda às perguntas do desafio.