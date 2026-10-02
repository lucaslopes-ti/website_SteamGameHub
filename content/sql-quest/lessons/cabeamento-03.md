---
id: cabeamento-03
title: "Par trançado: blindagem e categorias"
summary: "U/UTP e blindados, categorias Cat5e a Cat6a, o limite de 100 m e o crosstalk."
chapter: 13
chapterSlug: cabeamento
lesson: 3
difficulty: iniciante
xp: 20
prerequisites:
  - cabeamento-02
hints:
  - "Crosstalk é a interferência que um par exerce sobre o outro — o trançado existe para combatê-la."
  - "O número da categoria acompanha a velocidade: Cat6a suporta mais que Cat5e."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
images:
  - alt: "Estrutura interna do cabo de par trançado destacando os 4 pares coloridos, separador interno e blindagem UTP vs STP"
    src: "cabeamento_par_trancado.jpg"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre o par trançado."
  questions:
    - prompt: "Por que os fios do cabo são trançados em pares?"
      options:
        - "Para facilitar a decoração dos cabos"
        - "Para reduzir o crosstalk — a interferência entre os pares"
        - "Para economizar cobre"
        - "Para caber na tomada"
      answer: 1
      explanation: "O trançado reduz o crosstalk: cada par interfere menos no par vizinho, preservando o sinal."
    - prompt: "Um cabo U/UTP é..."
      options:
        - "Blindado por trança metálica"
        - "Sem blindagem (par trançado não blindado)"
        - "Um cabo de fibra"
        - "Blindado individualmente por par"
      answer: 1
      explanation: "U/UTP significa par trançado sem blindagem — o cabo mais comum e econômico em escritórios e escolas."
    - prompt: "Quando escolhemos cabos blindados (FTP/STP)?"
      options:
        - "Quando o custo precisa ser mínimo"
        - "Em ambientes com muita interferência eletromagnética (motores, energia forte)"
        - "Quando a distância passa de 1 km"
        - "Nunca, são obsoletos"
      answer: 1
      explanation: "A blindagem (FTP/STP) protege o sinal da interferência externa em ambientes elétricamente 'barulhentos'."
    - prompt: "Qual a distância máxima padrão de um canal de par trançado?"
      options:
        - "10 m"
        - "50 m"
        - "100 m"
        - "1 km"
      answer: 2
      explanation: "O padrão define 100 m por canal — além disso, o sinal degrada e a confiabilidade cai. Acima disso, use fibra."
    - prompt: "Se o ponto de uso fica a 150 m do armário, a solução correta é..."
      options:
        - "Cat6a resolve tranquilamente"
        - "Passar dois cabos em série"
        - "Fibra óptica (ou um armário intermediário mais próximo)"
        - "Wi-Fi obrigatoriamente"
      answer: 2
      explanation: "Par trançado para no limite de 100 m; trechos maiores pedem fibra ou repensar a distribuição dos armários."
---

## Contexto

O par trançado é o meio mais instalado do mundo de redes locais: quatro pares
de fios de cobre, trançados entre si. O trançado não é estética — é
engenharia contra o **crosstalk**, a interferência que um par causa no
outro.

**Blindagem** — o cabo pode ser:

- **U/UTP**: sem blindagem, o mais comum e econômico.
- **FTP/STP**: com blindagem (malha ou folha metálica), para ambientes com
  forte interferência eletromagnética.

**Categorias** — o padrão classifica o desempenho:

- **Cat5e**: até 1 Gbps — ainda muito comum.
- **Cat6**: até 10 Gbps em distâncias menores — padrão de instalações novas.
- **Cat6a**: 10 Gbps nos 100 m completos.

**O limite de 100 m**: o canal completo (patch cord + cabeamento fixo +
patch cord) tem no máximo 100 metros. Passou disso? O sinal degrada e a
solução é fibra ou repensar os armários.
