---
id: treino-saep-04
title: "Endereços IPv4 e IPv6"
summary: "Mesma rede ou outra no /25, o endereço que pode ir na impressora e a abreviação do IPv6."
chapter: 18
chapterSlug: treino-saep
lesson: 4
difficulty: iniciante
xp: 30
prerequisites:
  - treino-saep-03
hints:
  - "/25 = blocos de 128: .0 a .127 e .128 a .255."
  - "Rede = começo do bloco; broadcast = próximo começo − 1."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
images:
  - alt: "Régua dos blocos de sub-rede /24, /25 e /26"
    src: "ipv4_regua_sub_redes.gif"
challenge:
  kind: quiz
  instruction: "Chamado nº 8: o teste do técnico novo. Use os 4 passos: comando, dados, riscar as absurdas, escolher."
  questions:
    - prompt: "Depois do chamado nº 5, o administrativo ficou em 192.168.10.0/25 e o prédio 2 em 192.168.10.128/25. Um técnico ligou um notebook com IP 192.168.10.130 e máscara 255.255.255.128 no mesmo switch do servidor 192.168.10.10/25. O ping do notebook para o servidor falha. O que explica a falha?"
      options:
        - "O switch bloqueia o ping entre computadores."
        - "O notebook está na sub-rede .128/25 e o servidor na .0/25: são redes diferentes e precisam de um roteador."
        - "A máscara 255.255.255.128 não existe; o certo é 255.255.255.0."
        - "O IP 192.168.10.130 é o endereço de broadcast da rede."
      answer: 1
      explanation: "Bloco de 128: .0 a .127 é uma rede, .128 a .255 é outra. Mesmo switch não quer dizer mesma rede."
    - prompt: "A impressora do prédio 2 vai receber IP fixo. A subLAN do prédio 2 é 192.168.10.128/25 e o gateway é 192.168.10.129. Qual endereço pode ser usado na impressora?"
      options:
        - "192.168.10.128"
        - "192.168.10.255"
        - "192.168.10.200"
        - "192.168.10.100"
      answer: 2
      explanation: "Bloco .128/25: rede .128, broadcast .255, hosts de .129 a .254. O .129 é o gateway."
    - prompt: "O e-mail do provedor traz o endereço do servidor de testes por extenso: 2001:0db8:0000:0000:0000:0000:0000:0010. O cliente quer anotar a forma curta na etiqueta do rack. Qual é a forma abreviada correta?"
      options:
        - "2001:db8::1"
        - "2001::db8::10"
        - "2001:db8::10"
        - "21:db8::10"
      answer: 2
      explanation: "Regra 1: zeros à esquerda saem (0db8 → db8, 0010 → 10). Regra 2: os grupos 0 viram :: uma vez."
    - prompt: "Qual é a classe e a máscara padrão do 192.168.10.0?"
      options:
        - "Classe A, 255.0.0.0"
        - "Classe B, 255.255.0.0"
        - "Classe C, 255.255.255.0 (/24)"
        - "Não tem classe"
      answer: 2
      explanation: "Endereços que começam de 192 a 223 são classe C. A máscara padrão é 255.255.255.0, o /24."
---

## Contexto

O escritório foi dividido em duas sub-redes /25 (chamado nº 5) e o provedor
mandou um servidor de testes em IPv6. O técnico novo precisa endereçar sem
errar.

## Método do tamanho do bloco

| Máscara | Tamanho do bloco | Blocos no último número |
|---|---|---|
| /24 (255.255.255.0) | 256 | .0 a .255 |
| /25 (255.255.255.128) | 128 | .0 a .127 e .128 a .255 |

- **Rede** = o começo do bloco. **Broadcast** = o próximo começo − 1.
- **Hosts** = tudo o que fica entre os dois.

## IPv6 em 2 regras

1. Zeros **à esquerda** de cada grupo saem: `0db8` vira `db8`, `0010` vira `10`.
2. Uma sequência de grupos `0000` vira `::`, **uma vez só**.

## Sua vez

Use a régua dos blocos para as duas primeiras e as 2 regras na terceira.
