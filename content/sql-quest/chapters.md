---
version: 1.0.0
chapters:
  - number: 1
    slug: select
    title: "Consultas com SELECT"
    description: "Dê os primeiros passos lendo dados do Senai Pay: aprenda a buscar todas as colunas de uma tabela, escolher colunas específicas, entender o que é SQL e como o SQLite armazena os dados."
  - number: 2
    slug: tabelas
    title: "Criando e alterando tabelas"
    description: "Nem tudo que o Senai Pay precisa armazenar já existe no banco. Neste capítulo você cria tabelas do zero, escolhe os tipos certos para cada dado, ajusta a estrutura com ALTER TABLE e aprende o básico de migrações."
  - number: 3
    slug: restricoes
    title: "Restrições e integridade dos dados"
    description: "Um banco de pagamentos não pode aceitar dados quebrados. Aprenda a aplicar regras com NOT NULL, UNIQUE, PRIMARY KEY e FOREIGN KEY para garantir que as informações do Senai Pay sejam sempre confiáveis."
  - number: 4
    slug: crud
    title: "CRUD: inserir, atualizar e excluir registros"
    description: "Ler dados é só o começo. Neste capítulo você aprende as quatro operações básicas de um banco — criar, ler, atualizar e excluir — com INSERT, UPDATE, DELETE e consultas com COUNT, WHERE e DISTINCT."
  - number: 5
    slug: joins
    title: "Juntando tabelas com JOIN"
    description: "Os dados do Senai Pay estão espalhados em várias tabelas. Aprenda a combiná-los com INNER JOIN, LEFT JOIN, RIGHT JOIN e FULL JOIN para montar relatórios completos sobre usuários, países e transações."
---

# Capítulos da SQL Quest

Este arquivo define apenas os **metadados dos capítulos** (número, slug,
título e descrição). As lições ficam em `lessons/*.md`, uma por arquivo.

> **Importante:** este arquivo é a fonte de verdade para `chapter` e
> `chapterSlug` usados no front matter das lições. Consulte
> `docs/SQL_QUEST_CONTENT.md` para o contrato completo.