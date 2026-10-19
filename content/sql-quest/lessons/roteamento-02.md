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

No chamado nº 6, os dois prédios têm redes diferentes. O equipamento que vai
ligar essas redes é o **roteador** (*router*). Nesta lição você vai entender
**como ele faz isso**.

## Switch e roteador: qual é a diferença

| Equipamento | Liga o quê | Olha qual endereço |
|---|---|---|
| **Switch** (comutador) | os PCs **da mesma rede** | o **MAC** (endereço físico da placa) |
| **Roteador** | **redes diferentes** entre si | o **IP** (endereço lógico) |

O switch só entrega dentro da rede. Para sair dela, a mensagem precisa passar
por um roteador.

## Uma porta em cada rede

O roteador tem várias **portas**, também chamadas de **interfaces**. Cada porta
fica ligada a **uma rede** e recebe **um IP daquela rede**. Esse IP é o
**gateway** dos PCs daquela rede.

No chamado nº 6, o Router0 fica assim:

| Porta | Rede onde está ligada | IP da porta (gateway dos PCs) |
|---|---|---|
| G0/0 | 192.168.10.0/24 (prédio 1) | 192.168.10.1 |
| G0/1 | 192.168.20.0/24 (prédio 2) | 192.168.20.1 |

**G0/0** quer dizer porta *GigabitEthernet* 0/0, uma porta de rede de 1 Gbit/s.

Por que uma porta em cada rede? Porque o PC só entrega mensagens para quem
está **na mesma rede** que ele. Se o roteador tem um pé em cada rede, ele
consegue receber de um lado e entregar do outro.

## E o roteador da sua casa?

Ele faz a mesma coisa, só que com duas redes fixas:

- a **WAN** (*Wide Area Network*, rede de longa distância): a porta ligada ao
  **provedor de internet**;
- a **LAN** (*Local Area Network*, rede local): as portas e o Wi-Fi dos
  aparelhos da casa.

Você pode explorar a tela de um roteador de verdade nos **emuladores oficiais
da TP-Link** (pesquise "TP-Link emulator" no Google).

## Sua vez

Responda sobre o papel do roteador. Lembre: cada porta fica numa rede e usa um
IP dela.
