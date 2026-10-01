---
id: cabeamento-08
title: "Os seis subsistemas do cabeamento estruturado"
summary: "A viagem do sinal: entrada do edifício, sala de equipamentos, backbone, sala de telecom, horizontal e área de trabalho."
chapter: 13
chapterSlug: cabeamento
lesson: 8
difficulty: iniciante
xp: 20
prerequisites:
  - cabeamento-07
hints:
  - "A ordem é a rota do sinal: de fora para dentro, e de cima para baixo até a tomada."
  - "Cada subsistema tem um 'faz' e um 'cuidado' — as pegadinhas estão nos cuidados."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre os seis subsistemas."
  questions:
    - prompt: "Qual é a ordem correta da viagem do sinal?"
      options:
        - "Sala de equipamentos → entrada → tomada → backbone → horizontal → telecom"
        - "Entrada do edifício → sala de equipamentos → cabeamento vertical (backbone) → sala de telecomunicações → cabeamento horizontal → área de trabalho"
        - "Tomada → patch panel → operadora → backbone"
        - "Horizontal → telecom → entrada → equipamentos"
      answer: 1
      explanation: "É a rota completa: o serviço entra, é distribuído pela central, desce (ou sobe) pelo backbone, é repartido nas salas de telecom e termina na tomada onde a pessoa usa a rede."
    - prompt: "O subsistema 'Entrada do edifício' é..."
      options:
        - "A tomada do usuário"
        - "Onde o serviço da operadora chega ao prédio"
        - "O rack do laboratório"
        - "O patch cord do aluno"
      answer: 1
      explanation: "É a porta de entrada do serviço externo no prédio — não confunda com a tomada da área de trabalho."
    - prompt: "Sobre fibra totalmente dielétrica na entrada do edifício:"
      options:
        - "Exige aterramento obrigatório"
        - "Não precisa de aterramento (não conduz eletricidade)"
        - "Só funciona em 2,4 GHz"
        - "Não pode ser usada na entrada"
      answer: 1
      explanation: "Dielétrica = não condutora: sem elemento metálico, não há corrente a aterrar. Blindadas com metal, sim, precisam de aterramento."
    - prompt: "O que define um cabo como cabeamento vertical (backbone)?"
      options:
        - "Estar dentro de um shaft"
        - "Subir de andar, sempre"
        - "O que ele liga: os pontos de distribuição da rede entre si"
        - "Ser de fibra óptica"
      answer: 2
      explanation: "Não é a posição física que define, é a função: ligar os pontos de distribuição (entrada, sala de equipamentos, salas de telecom) entre si."
    - prompt: "O cabeamento horizontal vai..."
      options:
        - "Do armário (sala de telecom) até a tomada de rede da área de trabalho"
        - "Da operadora até o rack"
        - "Do rack até o switch"
        - "De um armário até outro armário"
      answer: 0
      explanation: "Horizontal é o trecho fixo do armário à tomada. Não inclui ligações entre armários nem o patch cord do usuário."
    - prompt: "O subsistema 'Área de trabalho' começa..."
      options:
        - "No rack"
        - "No backbone"
        - "Na tomada de rede — tomada, patch cord e equipamento do usuário"
        - "Na entrada do edifício"
      answer: 2
      explanation: "A área de trabalho é onde a pessoa usa a rede: começa na tomada. O rack fica na sala de telecom, não aqui."
---

## Contexto

O padrão organiza a rede de um prédio em **seis subsistemas** — as paradas
do sinal, na ordem em que elas aparecem num prédio grande:

1. **Entrada do edifício** — onde o serviço da operadora chega ao prédio.
   *Cuidado:* não é a tomada do usuário; fibra totalmente dielétrica não
   precisa de aterramento.
2. **Sala de equipamentos** — abriga os equipamentos principais. *Cuidado:*
   não é "só um rack": é um ambiente controlado, com acesso reservado.
3. **Cabeamento vertical (backbone)** — a ligação principal entre os pontos
   de distribuição. *Cuidado:* subir de andar, sozinho, não faz o cabo virar
   backbone; o que define é **o que ele liga**.
4. **Sala de telecomunicações** — o armário que distribui a rede para uma
   parte do prédio. *Cuidado:* em redes pequenas, pode ficar no mesmo
   ambiente da sala de equipamentos.
5. **Cabeamento horizontal** — do armário até a tomada de rede. *Cuidado:*
   termina na tomada; não inclui ligação entre armários nem o patch cord do
   usuário.
6. **Área de trabalho** — onde a pessoa usa a rede: tomada, patch cord e
   equipamento. *Cuidado:* começa na tomada; o rack não fica aqui.

Em redes pequenas, alguns desses ambientes se fundem — a sala de equipamentos
e a sala de telecom podem ser a mesma sala. Os subsistemas continuam
existindo; só não têm paredes separadas.
