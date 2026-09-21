---
id: normalizacao-01
title: "Relacionamentos entre tabelas"
summary: "Conheça os relacionamentos 1:1, 1:N e N:N e como as chaves estrangeiras os representam."
chapter: 9
chapterSlug: normalizacao
lesson: 1
difficulty: intermediario
xp: 28
prerequisites:
  - subqueries-05
hints:
  - "Releia as definições dos três tipos de relacionamento no contexto."
  - "Para classificar cada exemplo, conte quantos itens do outro lado podem estar ligados a um único item e vice-versa."
  - "Na pergunta sobre N:N, pense em como o banco relaciona vários registros de um lado com vários do outro lado."
  - "Depois de responder, use as explicações para conferir a classificação."
references:
  - label: "SQLite — Foreign Keys"
    url: "https://www.sqlite.org/foreignkeys.html"
images:
  - alt: "Diagrama de cardinalidade com exemplos de relacionamentos um-para-um, um-para-muitos e muitos-para-muitos"
    src: "cardinalidade.png"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre relacionamentos entre tabelas."
  questions:
    - prompt: "Qual é um exemplo de relacionamento um-para-um (1:1) no Senai Pay?"
      options:
        - "As transações de um usuário"
        - "Os professores de uma universidade"
        - "A anotação (note) de uma transação"
        - "Os filhos de um pai"
      answer: 2
      explanation: "Cada transação tem no máximo uma anotação, então há exatamente um valor ligado a cada transação."
    - prompt: "Qual é um exemplo de relacionamento um-para-muitos (1:N)?"
      options:
        - "Um usuário e sua senha"
        - "Um usuário e seus dispositivos de acesso"
        - "Uma transação e sua anotação"
        - "Um país e seu código de duas letras"
      answer: 1
      explanation: "Um usuário pode acessar de vários dispositivos, mas cada dispositivo pertence a um único usuário."
    - prompt: "Em um relacionamento muitos-para-muitos (N:N), como representamos a ligação no banco?"
      options:
        - "Adicionando country_code à tabela users"
        - "Adicionando user_id à tabela countries"
        - "Criando uma tabela de junção com as chaves das duas entidades"
        - "Guardando uma lista de identificadores em uma única coluna TEXT"
      answer: 2
      explanation: "A tabela de junção guarda pares de chaves estrangeiras, permitindo que ambos os lados tenham vários registros relacionados."
    - prompt: "O que uma tabela precisa ter para se relacionar com outra?"
      options:
        - "Uma chave estrangeira que referencia a chave primária da outra tabela"
        - "O mesmo número de colunas da outra tabela"
        - "Exatamente o mesmo nome da outra tabela"
        - "Um índice de texto em todas as colunas"
      answer: 0
      explanation: "O relacionamento é criado por uma chave estrangeira que aponta para a chave primária (ou coluna única) da outra tabela."
---

## Contexto

Bancos de dados relacionais são poderosos justamente por causa dos
**relacionamentos** entre as tabelas. Esses relacionamentos mantêm o banco
limpo e eficiente, e assumem que uma das tabelas tem uma **chave estrangeira**
(foreign key) que referencia a chave primária de outra tabela.

### Três tipos de relacionamento

Existem três tipos principais de relacionamentos em um banco relacional:

- **Um para um (1:1)**;
- **Um para muitos (1:N)**;
- **Muitos para muitos (N:N)**.

### Um para um (1:1)

Um relacionamento 1:1 costuma aparecer como um campo (ou conjunto de campos) da
própria linha. No Senai Pay, todo usuário tem exatamente **uma** senha e
exatamente **uma** preferência de e-mail.

Do mesmo modo, cada transação tem exatamente **uma** anotação (`note`).

### Um para muitos (1:N)

O relacionamento mais comum é o 1:N. Ele acontece quando um único registro de
uma tabela se relaciona com vários registros de outra.

Um usuário pode ter **muitos** dispositivos de acesso, mas cada dispositivo
pertence a **um** único usuário. A relação só vai em uma direção: um registro
da segunda tabela não pode se ligar a vários registros da primeira.

### Muitos para muitos (N:N)

Um relacionamento N:N ocorre quando vários registros de uma tabela podem se
relacionar com vários registros da outra. Um usuário pode ter vários bancos, e
cada banco pode atender vários usuários.

Nesses casos, a ligação **não** cabe em nenhuma das duas tabelas: criamos uma
terceira tabela, chamada **tabela de junção**, com as chaves das duas
entidades.

## Sua vez

Responda às perguntas do desafio sobre os tipos de relacionamento.
