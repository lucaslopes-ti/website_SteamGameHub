---
id: select-04
title: "O que é SQL?"
summary: "Entenda o papel do SQL e quando usar planilhas versus bancos de dados."
chapter: 1
chapterSlug: select
lesson: 4
difficulty: iniciante
xp: 28
prerequisites:
  - select-03
hints:
  - "Releia a cena e separe dois aspectos: o volume de dados e o nível de automação que o dia a dia exige."
  - "Para cada opção, pergunte-se em que cenário ela seria a escolha natural e em qual ela atrapalharia o trabalho."
  - "Depois de responder, use a explicação para conferir o critério que diferencia as opções."
references:
  - label: "SQLite — Lang"
    url: "https://www.sqlite.org/lang.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo."
  questions:
    - prompt: "Qual você usaria para controlar seus impostos e orçamento pessoal?"
      options:
        - "Um ábaco"
        - "Uma planilha (Excel ou Google Sheets)"
        - "Um banco SQL altamente escalável"
      answer: 1
      explanation: "Planilhas são ótimas para manipulação manual simples de dados."
    - prompt: "Qual você usaria para armazenar os registros de alunos de uma escola online?"
      options:
        - "Dedos das mãos e dos pés"
        - "Uma planilha"
        - "Uma máquina de Turing com quilômetros de fita"
        - "Um banco de dados SQL"
      answer: 3
      explanation: "Bancos SQL são projetados para dados escaláveis e automatizados."
---

## Contexto

Structured Query Language, ou SQL (pronuncia-se "es-que-el"), é a principal
linguagem usada para gerenciar e interagir com bancos de dados relacionais.
Com SQL podemos criar, atualizar, ler e excluir registros dentro de um banco.

De modo geral, SQL é extremamente poderosa e programável. Enquanto planilhas
são ótimas para manipulação manual simples de dados, SQL foi projetada para
operações de dados **automatizadas e escaláveis**: ela lida com grandes
conjuntos de dados, consultas complexas e se integra facilmente com linguagens
de programação como Python, TypeScript e Go.

## Sua vez

Leia cada situação e escolha a opção que combina melhor com o contexto descrito.

- Considere quantos dados serão guardados e quantas pessoas vão consultá-los.
- Pense no grau de automação e de escala que a tarefa exige.
- Não há resposta única para todos os casos: o contexto é que decide.

Depois de enviar, leia as explicações para comparar seu raciocínio com o esperado.