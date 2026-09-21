---
id: normalizacao-10
title: "Revisão de normalização"
summary: "Consolide as regras práticas de design de banco que as formas normais ensinam."
chapter: 9
chapterSlug: normalizacao
lesson: 10
difficulty: intermediario
xp: 28
prerequisites:
  - normalizacao-09
hints:
  - "Releia no contexto a orientação sobre a ordem de prioridades ao estruturar um banco."
  - "Ao avaliar o nome da chave, pense em qual convenção é mais comum e mais simples em bancos."
  - "Na pergunta sobre desnormalização, reflita sobre o momento adequado para tomar essa decisão."
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre as regras práticas de normalização."
  questions:
    - prompt: "O que você deve otimizar primeiro em um banco de dados?"
      options:
        - "Velocidade"
        - "Reduzir dados duplicados"
      answer: 1
      explanation: "Otimize primeiro a integridade e a desduplicação; a velocidade vem depois, se necessário."
    - prompt: "Quando não é preciso uma chave composta, qual deve ser o nome da coluna da chave primária?"
      options:
        - "skeleton_key"
        - "key"
        - "identifier"
        - "id"
      answer: 3
      explanation: "Na grande maioria dos casos, a chave primária é uma única coluna chamada id."
    - prompt: "O que é mais importante para a sua carreira em desenvolvimento back-end?"
      options:
        - "Memorizar as definições exatas de 1NF, 2NF, 3NF e BCNF"
        - "Internalizar regras práticas simples sobre normalização de banco de dados"
      answer: 1
      explanation: "As definições exatas importam menos do que os princípios de integridade e desduplicação que elas ensinam."
    - prompt: "Quando vale a pena desnormalizar o banco?"
      options:
        - "Sempre, logo no início do projeto"
        - "Nunca, em nenhuma hipótese"
        - "Quando começarem a aparecer problemas de desempenho"
        - "Quando a tabela não tiver chave primária"
      answer: 2
      explanation: "Desnormalize apenas de forma pontual, quando a performance se tornar um problema real."
---

## Contexto

Na opinião deste curso, as definições exatas da 1ª, 2ª, 3ª e da forma de
Boyce-Codd não são tão importantes no dia a dia de quem desenvolve back-end.

O que importa é entender os **princípios de integridade e redundância** que as
formas normais ensinam. Vamos revisar algumas regras práticas que vale a pena
memorizar — elas ajudam a projetar bancos e também em entrevistas de emprego.

### Regras práticas de design de banco de dados

- Toda tabela deve ter um **identificador único** (chave primária).
- Em cerca de 90% dos casos, esse identificador é uma única coluna chamada
  `id`.
- Evite **dados duplicados**.
- Evite armazenar dados que dependem completamente de outros dados. Em vez
  disso, calcule-os quando precisar.
- Mantenha o schema o mais **simples** que conseguir. Otimize para um banco
  normalizado primeiro; só desnormalize em nome da velocidade quando começar a
  enfrentar problemas de desempenho.

## Sua vez

Responda às perguntas sobre regras práticas de normalização.

- Priorize integridade e ausência de duplicação antes de buscar velocidade.
- Prefira convenções simples e amplamente usadas ao nomear chaves.

Depois de enviar, leia as explicações para revisar.
