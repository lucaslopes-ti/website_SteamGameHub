---
id: cabeamento-05
title: "Fibra óptica: monomodo x multimodo"
summary: "Como a luz transporta dados; monomodo e multimodo, conectores LC/SC e quando usar cada um."
chapter: 13
chapterSlug: cabeamento
lesson: 5
difficulty: iniciante
xp: 20
prerequisites:
  - cabeamento-04
hints:
  - "O tamanho do núcleo define o modo da fibra — e cada modo casa com uma fonte de luz diferente."
  - "Monomodo + laser = longa distância; multimodo + LED/VCSEL = curta distância."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
images:
  - alt: "Comparação entre fibra óptica monomodo (SMF) com feixe laser e fibra multimodo (MMF) com reflexão de luz"
    src: "cabeamento_fibra_optica.jpg"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre fibra óptica."
  questions:
    - prompt: "A fibra óptica transporta os dados na forma de..."
      options:
        - "Pulsos elétricos"
        - "Pulsos de luz"
        - "Ondas sonoras"
        - "Campo magnético"
      answer: 1
      explanation: "A fibra conduz pulsos de luz pelo núcleo de vidro — por isso é imune a interferência elétrica e atende grandes distâncias."
    - prompt: "A fibra MONOMODO é caracterizada por..."
      options:
        - "Núcleo fino e fonte laser, ideal para longas distâncias"
        - "Núcleo largo e LED, para distâncias curtas"
        - "Conector RJ45"
        - "Cores amarelas e vermelhas obrigatórias no núcleo"
      answer: 0
      explanation: "Núcleo fino (~9 µm) guia um único modo de luz com laser: pouquíssima dispersão, alcance de muitos quilômetros."
    - prompt: "A fibra MULTIMODO é a escolha típica para..."
      options:
        - "Ligar filiais em estados distantes"
        - "Links curtos dentro do mesmo prédio, com LED/VCSEL e custo menor"
        - "Substituir o par trançado nas tomadas"
        - "Transmissão por rádio"
      answer: 1
      explanation: "Núcleo mais largo (50/62,5 µm) com LED/VCSEL: menor alcance (centenas de metros), equipamento mais barato — perfeita dentro do prédio."
    - prompt: "LC e SC são..."
      options:
        - "Categorias de cabo de cobre"
        - "Tipos de conector de fibra óptica"
        - "Esquemas de pinagem"
        - "Frequências de Wi-Fi"
      answer: 1
      explanation: "LC (pequeno, formato tipo trava) e SC (maior, encaixe push-pull) são os conectores de fibra mais usados."
    - prompt: "Qual característica da fibra a torna imune a interferência elétrica?"
      options:
        - "A grossura do cabo"
        - "Transportar luz, que não sofre interferência eletromagnética"
        - "A blindagem de cobre"
        - "O conector LC"
      answer: 1
      explanation: "Como não há sinal elétrico no vidro, ruídos elétricos simplesmente não afetam o sinal luminoso."
---

## Contexto

Se o par trançado leva o sinal elétrico a 100 m, a **fibra óptica** leva
**luz** a quilômetros. No núcleo de vidro, os pulsos luminosos viajam com
pouquíssima perda e nenhuma interferência elétrica — é por isso que ela
domina as ligações entre prédios, os backbones e a rede das operadoras.

**Monomodo** — núcleo muito fino, guia um único "caminho" de luz, gerado por
**laser**. Dispersão quase nula, alcance de vários quilômetros. É a fibra
das operadoras e das ligações entre prédios distantes.

**Multimodo** — núcleo mais largo, por onde a luz viaja em vários modos,
gerada por **LED/VCSEL**. Alcance menor (centenas de metros), equipamento
mais barato — típica dentro do mesmo prédio, entre armários.

**Conectores**: **LC** (compacto, meia-palmo do patch panel) e **SC**
(maior, encaixe reto) são os que você vai encontrar nos racks.

## Observação

Regra prática: distância curta e custo menor → multimodo; distância longa →
monomodo. E lembre-se da aula: fibra totalmente dielétrica não precisa de
aterramento.
