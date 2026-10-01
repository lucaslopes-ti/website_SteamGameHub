---
id: cabeamento-04
title: "Conectores e pinagem: 8P8C, T568A e T568B"
summary: "Conector RJ45 (8P8C), esquemas de pinagem T568A/T568B e os pares 1-2 / 3-6."
chapter: 13
chapterSlug: cabeamento
lesson: 4
difficulty: iniciante
xp: 20
prerequisites:
  - cabeamento-03
hints:
  - "O mesmo conector serve para os dois esquemas de pinagem; o que muda é a ordem das cores."
  - "Nos pares 1-2 e 3-6 moram os dados de transmissão e recepção."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre conectores e pinagem."
  questions:
    - prompt: "O conector de 8 posições e 8 contatos usado em redes é oficialmente chamado..."
      options:
        - "RJ11"
        - "8P8C (conhecido no dia a dia como RJ45)"
        - "USB-C"
        - "LC"
      answer: 1
      explanation: "8P8C é o nome técnico (8 posições, 8 contatos); RJ45 é o nome popular. RJ11 é o do telefone, menor."
    - prompt: "T568A e T568B são..."
      options:
        - "Marcas de cabo"
        - "Dois esquemas de pinagem que definem a ordem das cores nos pinos do conector"
        - "Velocidades de transmissão"
        - "Categorias de cabo"
      answer: 1
      explanation: "São os dois esquemas de pinagem das normas TIA/EIA: definem qual fio de cor vai em qual pino do conector."
    - prompt: "Numa instalação nova, o mais importante em relação a A e B é..."
      options:
        - "Usar o esquema mais caro"
        - "Escolher UM esquema e usá-lo em toda a instalação, com consistência nas duas pontas"
        - "Misturar A numa ponta e B na outra, para equilibrar"
        - "Alternar a cada andar"
      answer: 1
      explanation: "O que importa é a consistência: um único esquema nas duas pontas de todo o cabeamento. Misturar na mesma ponta é erro clássico."
    - prompt: "Os pares 1-2 e 3-6 do conector são responsáveis por..."
      options:
        - "Aterramento"
        - "Transmissão e recepção de dados (as duas primeiras comunicações de rede)"
        - "Energia elétrica da rede"
        - "Identificação visual"
      answer: 1
      explanation: "Os pares 1-2 (transmissão) e 3-6 (recepção) carregam o tráfego de dados nas ligações de 1 Gbps."
---

## Contexto

Na ponta de todo cabo de par trançado existe o conector de 8 posições e 8
contatos — o **8P8C**, conhecido no dia a dia como **RJ45** (não confunda
com o RJ11 do telefone, menor).

Dentro do conector, cada fio precisa ocupar o pino certo. As normas
TIA/EIA definem dois esquemas de pinagem:

- **T568A** e **T568B**: a diferença entre eles é a ordem das cores dos
  pares laranja e verde. Funcionalmente os dois são equivalentes.

A regra de ouro da instalação: **escolha um esquema e use-o em toda a
instalação**, nas duas pontas de cada cabo. Um cabo com A numa ponta e B na
outra ("cabo cruzado") é um caso especial do passado; o erro real é pinar
sem padrão.

E os pinos não são aleatórios: os **pares 1-2 e 3-6** são justamente os que
carregam transmissão e recepção dos dados — por isso a pinagem correta não é
detalhe, é requisito.
