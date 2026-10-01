---
id: cabeamento-09
title: "Fiscal da rede: revisão de infraestrutura"
summary: "Desafio de revisão: avalie situações de rede como um fiscal técnico e escolha a conduta correta."
chapter: 13
chapterSlug: cabeamento
lesson: 9
difficulty: intermediario
xp: 25
prerequisites:
  - cabeamento-08
hints:
  - "Volte às lições anteriores quando ficar em dúvida: cada pergunta remete a uma regra vista na aula."
  - "Pense como um fiscal: 'o que a norma diria dessa instalação?'"
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
challenge:
  kind: quiz
  instruction: "Responda ao desafio 'Fiscal da rede': avalie cada situação e escolha a conduta correta."
  questions:
    - prompt: "Você mede 120 m entre o armário e a tomada nova. O que faz?"
      options:
        - "Instala Cat6a mesmo assim"
        - "Instala mesmo, 'que funciona funciona'"
        - "Replaneja: fibra ou armário intermediário — 100 m é o limite do par trançado"
        - "Pede Wi-Fi ao usuário"
      answer: 2
      explanation: "Além de 100 m o sinal degrada; a resposta correta é mudar de meio (fibra) ou repensar a distribuição dos armários."
    - prompt: "Na montagem do caminho do laboratório, falta identificar os cabos no patch panel. Risco:"
      options:
        - "A rede ficar mais lenta hoje"
        - "Manutenção futura impossível: ninguém localiza falhas sem identificação"
        - "O XP dos alunos cair"
        - "O switch queimar"
      answer: 1
      explanation: "Identificação não afeta o funcionamento imediato — afeta a manutenibilidade. Falha depois de meses sem etiqueta é pesadelo."
    - prompt: "O técnico sugeriu correr os cabos de dados grudados com os do quadro de energia. Fiscal reprova?"
      options:
        - "Aprova, economiza canaleta"
        - "Reprova: energia induz ruído; a norma exige separação"
        - "Aprova, se for Cat6a"
        - "Reprova, só porque fica feio"
      answer: 1
      explanation: "Separação de energia e dados é regra de norma, por interferência eletromagnética — não é preferência estética."
    - prompt: "Um colega diz: 'esse cabo sobe do 1º para o 2º andar, logo é backbone'. Correto?"
      options:
        - "Sim, subir de andar define backbone"
        - "Não: o que define backbone é o que o cabo liga — os pontos de distribuição da rede"
        - "Sim, todo cabo vertical é backbone"
        - "Não, backbone só existe em fibra"
      answer: 1
      explanation: "A definição é funcional, não física: o backbone liga os pontos de distribuição entre si. Subir sozinho não basta."
    - prompt: "Num prédio pequeno, a sala de equipamentos e a sala de telecomunicações estão no mesmo ambiente. Problema?"
      options:
        - "Sim, a norma proíbe"
        - "Não: em redes pequenas os subsistemas podem compartilhar o mesmo ambiente"
        - "Sim, o backbone queima"
        - "Sim, o Wi-Fi não funciona assim"
      answer: 1
      explanation: "Em prédios pequenos os ambientes se fundem; os subsistemas continuam existindo como funções, mesmo sem paredes separadas."
    - prompt: "O aluno conecta seu notebook na tomada com um patch cord de 30 m enrolado num carretel. Fiscal reprova?"
      options:
        - "Não, patch cord pode ter qualquer comprimento"
        - "Sim: excesso de comprimento desperdiçado e enrolado degrada o sinal e viola boas práticas"
        - "Não, desde que seja Cat6"
        - "Sim, porque enrolar gera Wi-Fi"
      answer: 1
      explanation: "O canal total tem limite de 100 m e o patch cord deve ser proporcional ao uso; excesso enrolado acumula curvatura e degradação."
---

## Contexto

Este é o parecer técnico da aula: o desafio **Fiscal da rede**. Você acabou
de percorrer a infraestrutura física inteira — dispositivos, cabeamento,
meios, normas e os seis subsistemas. Agora é avaliar situações reais como um
profissional: o que a norma aprova, o que reprova e por quê.

Se errar, releia a lição correspondente — cada pergunta remete diretamente a
uma regra das aulas 02 e 03.

## O que vem a seguir

Aqui termina o bloco de infraestrutura. Nos próximos módulos, os modelos em
camadas (OSI/TCP-IP) e o endereçamento IP mostram o outro lado da viagem: o
protocolo.
