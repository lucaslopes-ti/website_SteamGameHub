---
id: restricoes-06
title: "Bancos de dados relacionais"
summary: "Entenda como tabelas se relacionam por chaves primárias e estrangeiras."
chapter: 3
chapterSlug: restricoes
lesson: 6
difficulty: iniciante
xp: 40
prerequisites:
  - restricoes-05
hints: []
references:
  - label: "SQLite — Foreign Keys"
    url: "https://www.sqlite.org/foreignkeys.html"
challenge:
  kind: quiz
  instruction: "Considere o banco abaixo e responda às perguntas."
  questions:
    - prompt: "Quantos cursos Ana está matriculada?"
      options:
        - "5"
        - "4"
        - "2"
        - "1"
      answer: 2
      explanation: "Ana (id 2) aparece em 2 registros da tabela StudentCourses: os cursos 2 e 3."
    - prompt: "Quantos alunos estão no curso Banco de Dados?"
      options:
        - "5"
        - "4"
        - "3"
        - "1"
      answer: 2
      explanation: "O curso Banco de Dados (id 3) tem 3 alunos: os ids 1, 2 e 3 na tabela StudentCourses."
---

## Contexto

Temos usado o termo **relacional** bastante. Está na hora de entender o que ele
significa de verdade!

Um banco de dados relacional é um tipo de banco que armazena dados de forma que
eles possam ser facilmente **relacionados** a outros dados. Por exemplo, um
usuário pode ter muitas publicações. Existe um relacionamento entre um usuário
e as publicações dele.

Em um banco de dados relacional:

- Os dados são normalmente representados em **tabelas**;
- Cada tabela tem **colunas** (ou campos) que guardam atributos do registro;
- Cada linha (ou entrada) da tabela é chamada de **registro**;
- Normalmente, cada registro tem um ID único chamado **chave primária**.

### Exemplo

Aqui está um exemplo de um pequeno banco relacional. Ele tem 3 tabelas:
`Students`, `Courses` e `StudentCourses`. A tabela `StudentCourses` gerencia o
relacionamento entre as tabelas `Students` e `Courses`.

**Students**

| id | name  |
|----|-------|
| 1  | Bruno |
| 2  | Ana   |
| 3  | Carla |
| 4  | Diego |
| 5  | Elisa |

**Courses**

| id | name                |
|----|---------------------|
| 1  | Lógica de Programação |
| 2  | Redes               |
| 3  | Banco de Dados      |
| 4  | Segurança           |

**StudentCourses**

| student_id | course_id |
|------------|-----------|
| 1          | 1         |
| 1          | 3         |
| 2          | 2         |
| 2          | 3         |
| 3          | 1         |
| 3          | 2         |
| 3          | 3         |
| 4          | 4         |
| 5          | 4         |

**Exemplo 1 — Ana:** Ana tem o id 2. Podemos descobrir os cursos de Ana
procurando na tabela `StudentCourses` os registros que correspondem ao
`student_id` dela.

**Exemplo 2 — Banco de Dados:** o curso "Banco de Dados" tem o id 3. Podemos
descobrir todos os alunos matriculados no curso verificando a coluna
`course_id` na tabela `StudentCourses`.

## Sua vez

Responda às perguntas do desafio.