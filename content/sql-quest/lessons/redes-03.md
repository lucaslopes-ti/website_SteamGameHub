---
id: redes-03
title: "Rede ponto a ponto (P2P)"
summary: "Quando uma rede ponto a ponto atende — e quando ela não é mais suficiente."
chapter: 12
chapterSlug: redes
lesson: 3
difficulty: iniciante
xp: 20
prerequisites:
  - redes-02
hints:
  - "Na P2P, não existe um servidor dedicado: cada host compartilha o que quiser."
  - "Pense no que acontece quando cada colega guarda os arquivos da turma no próprio computador."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre redes ponto a ponto."
  questions:
    - prompt: "Em uma rede ponto a ponto..."
      options:
        - "Há um servidor central dedicado"
        - "Os hosts compartilham recursos diretamente entre si, sem servidor dedicado"
        - "Nenhum host pode compartilhar arquivos"
        - "Só funciona com fibra óptica"
      answer: 1
      explanation: "Na P2P os próprios hosts atuam como cliente e servidor ao mesmo tempo, compartilhando arquivos e impressoras diretamente."
    - prompt: "Qual cenário é adequado para uma rede P2P?"
      options:
        - "Rede com 4 colegas compartilhando arquivos em casa"
        - "Rede de um hospital com 300 computadores"
        - "Rede de uma matriz e filial em estados diferentes"
        - "Sistema bancário de um banco nacional"
      answer: 0
      explanation: "P2P atende redes pequenas, com poucos hosts e requisitos simples. Conforme o número de dispositivos cresce, ela se torna difícil de administrar."
    - prompt: "Por que uma P2P fica inviável em empresas maiores?"
      options:
        - "Porque exige fibra óptica"
        - "Porque cada computador guarda dados próprios, sem controle central, e a segurança e a administração ficam difíceis"
        - "Porque só funciona em 2,4 GHz"
        - "Porque o Windows não permite"
      answer: 1
      explanation: "Com muitos hosts, os dados se espalham pelas máquinas e não há administração central: backups, permissões e segurança ficam impossíveis de controlar."
    - prompt: "Qual vocabulário define bem o espírito da P2P?"
      options:
        - "Compartilhamento"
        - "Cabeamento estruturado"
        - "Topologia lógica"
        - "Intranet"
      answer: 0
      explanation: "A P2P se apoia no compartilhamento direto entre pares — cada host oferece o que tem aos demais."
---

## Contexto

A forma mais simples de unir computadores é a rede **ponto a ponto** (*peer
to peer*, P2P): não há um servidor dedicado, e cada host compartilha
diretamente o que quiser — arquivos, uma impressora, uma pasta de trabalho.

É perfeito para situações pequenas: quatro colegas em casa trocando arquivos,
um escritório com três máquinas dividindo uma impressora.

## O limite da P2P

O problema aparece quando a rede cresce. Em uma empresa com dezenas de
máquinas, onde fica o arquivo importante? Em qual computador? Quem tem
permissão de ler? Quem faz backup? Numa P2P, os dados se espalham pelas
máquinas e a administração vira um pesadelo.

Quando isso acontece, a resposta é a **rede cliente-servidor**: servidores
dedicados, centralizados e administrados por profissionais — exatamente o
modelo da rede do SENAI.
