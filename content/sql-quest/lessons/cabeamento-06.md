---
id: cabeamento-06
title: "Redes sem fio: 2,4 GHz x 5 GHz"
summary: "Compare as faixas de Wi-Fi, entenda interferência e canais."
chapter: 13
chapterSlug: cabeamento
lesson: 6
difficulty: iniciante
xp: 20
prerequisites:
  - cabeamento-05
hints:
  - "Frequência mais baixa penetra melhor; frequência mais alta entrega mais velocidade."
  - "No 2,4 GHz só há 3 canais que não se sobrepõem — por isso ele fica congestionado."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre redes sem fio."
  questions:
    - prompt: "A faixa de 2,4 GHz se destaca por..."
      options:
        - "Maior alcance e melhor penetração em paredes, porém com menos velocidade"
        - "Maior velocidade e menor alcance"
        - "Não sofrer nenhuma interferência"
        - "Só funcionar em ambientes externos"
      answer: 0
      explanation: "Frequências mais baixas viajam mais longe e atravessam obstáculos melhor — mas entregam menos taxa de dados."
    - prompt: "A faixa de 5 GHz se destaca por..."
      options:
        - "Velocidade maior e mais canais, com alcance menor"
        - "Alcance maior que o 2,4 GHz"
        - "Funcionar através de 10 paredes"
        - "Não existir em roteadores atuais"
      answer: 0
      explanation: "Mais frequência = mais dados por segundo e mais canais disponíveis; o preço é alcance menor e maior perda em paredes."
    - prompt: "Por que o 2,4 GHz costuma ficar congestionado em prédios?"
      options:
        - "Porque é uma frequência proibida"
        - "Porque existem apenas 3 canais sem sobreposição e todo mundo usa a mesma faixa"
        - "Porque só o 5 GHz tem canais"
        - "Porque paredes anulam os canais"
      answer: 1
      explanation: "São 3 canais não sobrepostos (1, 6, 11) numa faixa que micro-ondas, Bluetooth e vizinhos compartilham — resultado: interferência."
    - prompt: "Boa prática ao configurar os access points de um prédio:"
      options:
        - "Deixar todos no mesmo canal, para fazer sucesso"
        - "Planejar os canais para que access points vizinhos não se sobreponham"
        - "Usar apenas 5 GHz em qualquer ambiente"
        - "Desligar os canais"
      answer: 1
      explanation: "Planejamento de canais é essencial: APs vizinhos em canais sobrepostos se interferem e derrubam a qualidade da rede."
---

## Contexto

O Wi-Fi troca cabos por **ondas de rádio**, e a faixa de frequência define o
comportamento da rede:

**2,4 GHz** — alcance maior, atravessa paredes melhor, mas velocidade menor
e faixa congestionada: micro-ondas, Bluetooth e os vizinhos disputam os
mesmos **3 canais sem sobreposição** (1, 6 e 11).

**5 GHz** — velocidade maior e muito mais canais, mas alcance menor e pior
penetração em obstáculos.

**Interferência e canais**: em um prédio com vários access points, é preciso
**planejar os canais** — APs vizinhos no mesmo canal se interferem e a rede
fica ruim para todo mundo. Wi-Fi bem planejado é uma questão de engenharia,
não de "deixar no automático".

## Observação

Rede sem fio não elimina o cabeamento: por trás de cada access point existe
um cabo de rede levando dados até ele. O Wi-Fi é a última perna da viagem,
não a viagem inteira.
