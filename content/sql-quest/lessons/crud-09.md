---
id: crud-09
title: "O perigo de excluir dados"
summary: "Conheça backups e soft deletes, as estratégias para proteger dados valiosos."
chapter: 4
chapterSlug: crud
lesson: 9
difficulty: iniciante
xp: 21
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
    - prompt: "Você ____ deve ter backups automatizados de um banco de dados de produção."
      options:
        - "Às vezes"
        - "Nunca"
        - "Quase nunca"
        - "Quase sempre"
      answer: 3
      explanation: "Backups automatizados são essenciais para proteger dados valiosos contra erros de desenvolvimento."
    - prompt: "Um soft delete é quando você ____"
      options:
        - "Marca uma linha como excluída em vez de remover os dados de verdade"
        - "Exclui alguns dados, mas eles não são removidos do banco por 30 dias"
        - "Exclui dados pedindo gentilmente ao banco, geralmente com um 'por favor'"
        - "Exclui dados de um snapshot"
      answer: 0
      explanation: "No soft delete, marcamos a linha (ex.: com uma data em deleted_at) e ignoramos linhas marcadas nas consultas."
---

## Contexto

Excluir dados pode ser uma operação perigosa. Uma vez removidos, os dados podem
ser muito difíceis — se não impossíveis — de restaurar! Vamos falar sobre
algumas formas comuns de engenheiros backend protegerem contra a perda de dados
valiosos de clientes.

> **Dica:** ao escrever um DELETE manual, primeiro rode um `SELECT` com a mesma
> cláusula `WHERE` para pré-visualizar as linhas afetadas.

### Estratégia 1 — Backups

Se você usa um serviço de nuvem, deve sempre ativar backups automatizados. Eles
tiram um snapshot automático de todo o banco em algum intervalo e o mantêm por
algum tempo. O banco do Senai Pay tem um snapshot de backup diário, retido por
30 dias. Se alguém acidentalmente rodar uma consulta que exclua dados valiosos,
podemos restaurar a partir do backup.

Você deve ter uma estratégia de backup para bancos de dados de produção.

### Estratégia 2 — Soft Deletes

Um "soft delete" é quando você não exclui os dados do banco de verdade, mas
apenas "marca" os dados como excluídos. Por exemplo, você pode definir uma data
`deleted_at` na linha que quer excluir. Depois, nas suas consultas, você ignora
qualquer coisa que tenha uma data `deleted_at` definida. A ideia é que isso
permite que sua aplicação se comporte como se estivesse excluindo dados, mas
você sempre pode voltar e restaurar qualquer dado removido.

Você provavelmente só deve usar soft delete se tiver um motivo específico para
isso. Backups automatizados devem ser "suficientes" para a maioria das
aplicações que só querem se proteger contra erros de desenvolvimento.

## Sua vez

Responda às perguntas do desafio.