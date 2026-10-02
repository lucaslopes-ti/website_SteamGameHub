---
id: redes-04
title: "Meios de rede: par trançado, fibra e Wi-Fi"
summary: "Conheça os três grandes meios por onde os dados viajam e seus usos típicos."
chapter: 12
chapterSlug: redes
lesson: 4
difficulty: iniciante
xp: 20
prerequisites:
  - redes-03
hints:
  - "Cada meio responde a uma necessidade diferente: custo, distância, mobilidade."
  - "A fibra usa luz; o par trançado usa pulsos elétricos; o Wi-Fi usa ondas de rádio."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
images:
  - alt: "Comparação dos principais meios físicos de transmissão: cabo de cobre par trançado, fibra óptica e ondas de rádio Wi-Fi"
    src: "redes_meios_transmissao.jpg"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre os meios de rede."
  questions:
    - prompt: "Por que o par trançado é o meio mais comum em escritórios e escolas?"
      options:
        - "Porque é o mais rápido existente"
        - "Porque tem bom custo-benefício, instalação simples e atende bem distâncias curtas"
        - "Porque nunca sofre interferência"
        - "Porque dispensa conectores"
      answer: 1
      explanation: "O par trançado é barato, fácil de instalar e confiável nos 100 m típicos de escritório — por isso domina as áreas de trabalho."
    - prompt: "Qual meio transporta os dados na forma de luz?"
      options:
        - "Par trançado"
        - "Cabo coaxial"
        - "Fibra óptica"
        - "Wi-Fi"
      answer: 2
      explanation: "A fibra óptica leva pulsos de luz e atende longas distâncias com altíssima capacidade, sem sofrer interferência elétrica."
    - prompt: "Qual meio dispensa cabos e dá mobilidade aos dispositivos?"
      options:
        - "Fibra multimodo"
        - "Rede sem fio (Wi-Fi)"
        - "Par blindado"
        - "Backbone"
      answer: 1
      explanation: "O Wi-Fi transmite ondas de rádio, permitindo mobilidade — ideal para celulares, notebooks e salas de aula."
    - prompt: "Qual a escolha típica para ligar dois prédios distantes entre si?"
      options:
        - "Patch cord de 2 metros"
        - "Wi-Fi doméstico"
        - "Fibra óptica"
        - "Cabo de telefone"
      answer: 2
      explanation: "Grandes distâncias e altas taxas pedem fibra: sinal luminoso, baixa perda e imunidade a interferência."
---

## Contexto

Os dados precisam de um caminho físico (ou quase físico) para viajar. São
três os meios principais, cada um com seu perfil:

**Par trançado** — pares de fios de cobre trançados. Custo baixo,
instalação simples, confiável até cerca de 100 m. É o meio padrão das
tomadas de rede, laboratórios e escritórios.

**Fibra óptica** — filamentos de vidro que transportam **luz**. Alcance
enorme, capacidade altíssima e total imunidade a interferência elétrica. É o
meio dos backbones, das ligações entre prédios e das operadoras.

**Wi-Fi (sem fio)** — ondas de rádio. Não exige cabo, dá mobilidade e é a
porta de entrada para celulares e notebooks nas salas de aula — mas sofre
mais interferência e tem alcance limitado.

## Observação

A escolha do meio nunca é sobre "qual é o melhor": é sobre qual atende a
necessidade — distância, velocidade, custo e mobilidade — de cada trecho da
rede. Nos próximos capítulos você vai detalhar cada um deles.
