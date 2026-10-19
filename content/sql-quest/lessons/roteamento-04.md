---
id: roteamento-04
title: "O percurso do ping: o IP fica, o MAC muda"
summary: "Acompanhe o ping entre as duas redes e use o tracert para ver o caminho."
chapter: 17
chapterSlug: roteamento
lesson: 4
difficulty: iniciante
xp: 30
prerequisites:
  - roteamento-03
hints:
  - "IP de origem e de destino não mudam no caminho."
  - "O roteador troca os MACs a cada trecho."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
  - label: "ipinfo.io — informações de um IP"
    url: "https://ipinfo.io"
images:
  - alt: "Ilustração: resultado de um tracert até um site, com os roteadores do caminho"
    src: "roteamento_tracert_real.png"
challenge:
  kind: quiz
  instruction: "Responda sobre o caminho do ping do PC2 até o servidor."
  questions:
    - prompt: "O primeiro ping entre as redes deu 'Request timed out' e os seguintes funcionaram. O motivo mais provável é..."
      options:
        - "Cabo ruim"
        - "O tempo do ARP: na primeira vez os equipamentos ainda estão descobrindo os MACs"
        - "O servidor desligou"
        - "O roteador reiniciou"
      answer: 1
      explanation: "Na primeira mensagem o PC e o roteador fazem ARP. Enquanto isso, o primeiro pacote pode se perder."
    - prompt: "Quando o ping passa pelo roteador, o que muda no pacote?"
      options:
        - "O IP de destino"
        - "O IP de origem"
        - "Os endereços MAC de origem e destino"
        - "Nada muda"
      answer: 2
      explanation: "O IP fica do começo ao fim. O MAC muda a cada trecho: o roteador põe o MAC dele como origem e o do próximo como destino."
    - prompt: "No Packet Tracer, o tracert do PC2 para 192.168.10.10 mostra 2 saltos. O primeiro é..."
      options:
        - "192.168.10.10"
        - "192.168.20.1 (o gateway do PC2)"
        - "192.168.10.1"
        - "8.8.8.8"
      answer: 1
      explanation: "O primeiro salto é o gateway do PC2, 192.168.20.1. O segundo já é o servidor."
    - prompt: "Para que serve o tracert?"
      options:
        - "Para ver a velocidade do Wi-Fi"
        - "Para listar os roteadores do caminho até um destino"
        - "Para trocar o IP"
        - "Para desligar uma porta"
      answer: 1
      explanation: "O tracert mostra cada roteador (salto) pelo qual a mensagem passa até chegar ao destino."
    - prompt: "Num tracert até o Google, o site ipinfo.io ajuda a..."
      options:
        - "Descobrir a cidade e a empresa de cada roteador do caminho"
        - "Baixar o Packet Tracer"
        - "Trocar o gateway"
        - "Medir o cabo"
      answer: 0
      explanation: "No ipinfo.io você cola um IP do tracert e vê a cidade e a empresa (provedor) daquele roteador."
---

## Contexto

Com as portas ligadas, o **PC2** (prédio 2) finalmente pinga o **servidor** (prédio 1).

## Trecho a trecho

| Trecho | IP origem → destino | MAC origem → destino |
|---|---|---|
| 1 · PC2 → roteador | 192.168.20.11 → 192.168.10.10 | PC2 → G0/1 |
| 2 · roteador → servidor | 192.168.20.11 → 192.168.10.10 | G0/0 → servidor |

**O IP fica, o MAC muda.** No modo Simulação do Packet Tracer, filtre ICMP e ARP para ver isso acontecer.
