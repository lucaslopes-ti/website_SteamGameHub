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

Com as portas do roteador ligadas, o **PC2** (prédio 2, 192.168.20.11)
finalmente consegue pingar o **servidor** (prédio 1, 192.168.10.10). Nesta
lição vamos acompanhar **o caminho que esse ping faz**.

## Dois endereços em cada mensagem

Cada mensagem que viaja pela rede leva **dois tipos de endereço**:

- o **IP**: diz **de onde saiu e para onde vai no final** (como o remetente e
  o destinatário de uma carta);
- o **MAC**: diz **qual é o próximo equipamento do trecho** (como o carteiro
  de cada bairro).

## Trecho a trecho

O ping passa por dois trechos: do PC2 até o roteador e do roteador até o
servidor.

| Trecho | IP de origem → destino | MAC de origem → destino |
|---|---|---|
| 1 · PC2 até o roteador | 192.168.20.11 → 192.168.10.10 | PC2 → porta G0/1 do roteador |
| 2 · roteador até o servidor | 192.168.20.11 → 192.168.10.10 | porta G0/0 do roteador → servidor |

Repare: o **IP não muda** nos dois trechos, mas o **MAC muda** em cada um.

> **O IP fica, o MAC muda.**

## Por que o primeiro ping falha

Muitas vezes o **primeiro** ping entre redes dá *Request timed out* (tempo
esgotado) e os seguintes funcionam. Isso é normal: na primeira vez, o PC e o
roteador ainda estão descobrindo os MACs com o **ARP**. Depois disso, eles
guardam a resposta e os próximos pings passam direto.

## Vendo o caminho com o tracert

O comando `tracert` (*trace route*, rastrear rota) mostra **cada roteador** por
onde a mensagem passa. Cada roteador é um **salto** (*hop*).

- No Packet Tracer, `tracert 192.168.10.10` no PC2 mostra 2 saltos: primeiro o
  gateway **192.168.20.1** e depois o próprio servidor.
- No laboratório, `tracert google.com` mostra vários roteadores da internet.
  Copie um IP do resultado no site **ipinfo.io** para descobrir **em que cidade
  e empresa** fica aquele roteador.

No modo **Simulação** do Packet Tracer, filtre **ICMP** (o ping) e **ARP** para
ver os envelopes passando e o MAC mudando.

## Sua vez

Responda sobre o caminho do ping do PC2 até o servidor.
