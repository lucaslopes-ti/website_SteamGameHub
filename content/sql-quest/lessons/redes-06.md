---
id: redes-06
title: "Tamanhos de rede: doméstica, SOHO, LAN e WAN"
summary: "Classifique redes por escopo — de uma casa à Internet — e conheça intranet e extranet."
chapter: 12
chapterSlug: redes
lesson: 6
difficulty: iniciante
xp: 20
prerequisites:
  - redes-05
hints:
  - "Escopo é a pergunta-chave: a rede atende uma sala, um prédio, uma cidade ou o mundo?"
  - "A Internet não é uma LAN: ela é a rede das redes."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
images:
  - alt: "Escopos geográficos de redes: rede local residencial/SOHO (LAN) conectando-se à Internet global (WAN)"
    src: "redes_escopos_lan_wan.jpg"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre tipos e tamanhos de rede."
  questions:
    - prompt: "Uma rede que atende apenas uma casa ou um pequeno escritório é chamada de..."
      options:
        - "WAN"
        - "Rede doméstica ou SOHO (Small Office Home Office)"
        - "Backbone"
        - "Extranet"
      answer: 1
      explanation: "Doméstica e SOHO são as redes de menor escopo — uma casa ou um pequeno escritório, geralmente uma LAN."
    - prompt: "Uma LAN (Local Area Network) é..."
      options:
        - "Uma rede que conecta cidades diferentes"
        - "A rede mundial de operadoras"
        - "Uma rede local, limitada a um espaço como um prédio ou uma escola"
        - "Um tipo de cabo"
      answer: 2
      explanation: "LAN é a rede local: um prédio, uma escola, um laboratório — pequeno alcance geográfico, alta velocidade."
    - prompt: "Ligar computadores de filiais em estados diferentes exige..."
      options:
        - "Um switch maior"
        - "Uma WAN (Wide Area Network), ligando redes distantes"
        - "Mais tomadas de rede"
        - "Um patch panel"
      answer: 1
      explanation: "WAN é a rede de longo alcance: conecta LANs que estão longe umas das outras, geralmente contratando serviços de operadoras."
    - prompt: "A Internet é..."
      options:
        - "Uma LAN gigante"
        - "A rede das redes — milhões de redes interconectadas no mundo"
        - "Um tipo de fibra"
        - "Um servidor central único"
      answer: 1
      explanation: "A Internet interliga redes do mundo inteiro (LANs, WANs) — não é uma rede local grande, é a rede de redes."
    - prompt: "Rede interna de uma empresa, restrita a quem tem acesso, chamamos de..."
      options:
        - "Extranet"
        - "Intranet"
        - "SOHO"
        - "Backbone"
      answer: 1
      explanation: "Intranet é a rede interna da organização. Quando parceiros ou fornecedores externos também recebem acesso, chamamos de extranet."
---

## Contexto

A pergunta que classifica uma rede é: **qual é o escopo dela?** Atende uma
casa, um prédio, uma cidade ou o mundo?

- **Rede doméstica / SOHO** (*Small Office Home Office*): uma casa ou
  pequeno escritório. Poucos dispositivos, geralmente um roteador que faz
  tudo.
- **LAN** (*Local Area Network*): rede local de um prédio ou campus, como a
  rede da escola — alta velocidade, alcance restrito.
- **WAN** (*Wide Area Network*): conecta LANs distantes entre si — filiais
  em outras cidades, usando serviços de operadoras.
- **Internet**: a rede das redes, interligando LANs e WANs do mundo inteiro.

E ainda há duas redes "por dentro" das organizações:

- **Intranet**: rede interna da empresa/escola, restrita a quem tem acesso.
- **Extranet**: quando a intranet abre acesso controlado a parceiros,
  fornecedores ou clientes.

## Observação

Do laboratório da sala para o mundo: doméstica → SOHO → LAN → WAN →
Internet. É uma escada de escopos, e a mesma tecnologia aparece em vários
degraus.
