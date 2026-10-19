---
id: roteamento-02
title: "O roteador tem uma porta em cada rede"
summary: "Entenda por que o roteador liga redes diferentes e como é o roteador de casa."
chapter: 17
chapterSlug: roteamento
lesson: 2
difficulty: iniciante
xp: 20
prerequisites:
  - roteamento-01
hints:
  - "Switch liga PCs da mesma rede; roteador liga redes diferentes."
  - "Em casa: WAN é o lado da internet, LAN é o lado da casa."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
  - label: "TP-Link — Emuladores de roteador"
    url: "https://www.tp-link.com/br/support/emulators/"
images:
  - alt: "Ilustração: as portas de um roteador de escritório e de um roteador de casa"
    src: "roteamento_portas_roteador.png"
  - alt: "Ilustração: tela de configuração de um roteador doméstico com WAN e LAN"
    src: "roteamento_roteador_de_casa.png"
challenge:
  kind: quiz
  instruction: "Responda sobre o papel do roteador."
  questions:
    - prompt: "Qual equipamento liga redes diferentes?"
      options:
        - "Switch"
        - "Roteador"
        - "Patch panel"
        - "Cabo de rede"
      answer: 1
      explanation: "O switch liga PCs da mesma rede. O roteador liga redes diferentes e lê o endereço IP."
    - prompt: "O switch decide para onde enviar olhando o endereço..."
      options:
        - "IP (camada 3)"
        - "MAC (camada 2)"
        - "do site"
        - "do cabo"
      answer: 1
      explanation: "O switch trabalha com MAC, na camada 2 (enlace). O roteador trabalha com IP, na camada 3 (rede)."
    - prompt: "No chamado nº 6, a porta G0/0 do roteador fica na rede 192.168.10.0/24. Qual IP ela recebe?"
      options:
        - "192.168.10.0"
        - "192.168.10.1"
        - "192.168.20.1"
        - "192.168.10.255"
      answer: 1
      explanation: "A porta recebe um IP da rede dela, normalmente o primeiro host: 192.168.10.1. Esse é o gateway do prédio 1."
    - prompt: "No roteador de casa, a porta WAN fica ligada..."
      options:
        - "Aos PCs da casa"
        - "Ao provedor de internet"
        - "À impressora"
        - "Ao Wi-Fi do vizinho"
      answer: 1
      explanation: "WAN (Wide Area Network) é o lado do provedor. LAN é o lado da casa."
    - prompt: "Por que o roteador precisa de uma porta em cada rede?"
      options:
        - "Para ter mais luzes"
        - "Para ser o gateway de cada rede e passar as mensagens de uma para a outra"
        - "Para dobrar a velocidade"
        - "Para dar energia aos PCs"
      answer: 1
      explanation: "Cada porta é o gateway de uma rede. Assim o roteador recebe de um lado e entrega do outro."
---

## Contexto

O roteador é o equipamento que **liga redes diferentes**. Cada porta (interface) fica numa rede e recebe um IP dela.

| Porta | Rede | IP (gateway) |
|---|---|---|
| G0/0 | 192.168.10.0/24 (prédio 1) | 192.168.10.1 |
| G0/1 | 192.168.20.0/24 (prédio 2) | 192.168.20.1 |

## E o roteador de casa?

Ele também liga duas redes: a **WAN** (internet, do provedor) e a **LAN** (os aparelhos da casa). Explore um de verdade nos **emuladores oficiais da TP-Link**.
