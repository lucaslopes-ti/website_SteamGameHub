---
id: normalizacao-04
title: "Normalização de banco de dados"
summary: "Entenda integridade dos dados e redundância antes de partir para as formas normais."
chapter: 9
chapterSlug: normalizacao
lesson: 4
difficulty: intermediario
xp: 28
prerequisites:
  - normalizacao-03
hints:
  - "Dados brutos não mudam; dados pré-calculados ficam desatualizados."
  - "Redundância é guardar a mesma informação em mais de um lugar."
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre integridade e redundância."
  questions:
    - prompt: "Para melhorar a integridade dos dados, os dados devem, em geral, ser armazenados de qual forma?"
      options:
        - "Bruta (raw)"
        - "Pré-calculada (precomputed)"
      answer: 0
      explanation: "Dados brutos nunca mudam. Um dado derivado, como a idade, fica desatualizado com o tempo."
    - prompt: "Qual é o melhor exemplo de redundância de dados?"
      options:
        - "Duas tabelas que têm um campo booleano"
        - "Cada tabela ter um campo id como chave primária"
        - "O endereço de um usuário estar armazenado em duas tabelas diferentes"
        - "Uma tabela countries e uma tabela users terem, cada uma, um campo name"
      answer: 2
      explanation: "Redundância é a mesma informação guardada em vários lugares — como o mesmo endereço em duas tabelas."
    - prompt: "Por que armazenar a idade em vez da data de nascimento prejudica a integridade?"
      options:
        - "Porque ocupa mais espaço em disco"
        - "Porque a idade fica desatualizada com o passar do tempo"
        - "Porque o tipo INTEGER é mais lento"
        - "Porque impede a criação de índices"
      answer: 1
      explanation: "A idade é um dado pré-calculado: cada aniversário a torna incorreta. A data de nascimento é bruta e nunca muda."
    - prompt: "Qual é o objetivo da normalização?"
      options:
        - "Aumentar a redundância para acelerar consultas"
        - "Melhorar a integridade dos dados e reduzir a redundância"
        - "Garantir que toda tabela tenha uma chave estrangeira"
        - "Eliminar a necessidade de chaves primárias"
      answer: 1
      explanation: "Normalizar é estruturar o schema para melhorar a integridade e reduzir a duplicação."
---

## Contexto

**Normalização de banco de dados** é um método para estruturar o schema de
forma que ajude a:

- **melhorar a integridade dos dados**;
- **reduzir a redundância dos dados**.

### O que é integridade dos dados?

"Integridade dos dados" se refere à exatidão e à consistência dos dados. Por
exemplo, se a idade de um usuário é armazenada em vez da data de nascimento,
esse dado se torna automaticamente incorreto com o passar do tempo.

Seria melhor guardar a **data de nascimento** e calcular a idade quando
preciso. A data de nascimento é um dado **bruto**: nunca muda. A idade é um
dado **pré-calculado**: fica obsoleto.

### O que é redundância dos dados?

"Redundância dos dados" acontece quando a mesma informação é armazenada em
vários lugares — como salvar o mesmo arquivo em vários discos.

A redundância é problemática principalmente quando um dos locais é alterado e
os outros não: a mesma informação passa a ficar inconsistente entre as cópias.

## Sua vez

Responda às perguntas do desafio.
