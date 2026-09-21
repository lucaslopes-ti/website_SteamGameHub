---
id: performance-04
title: "Desnormalização por velocidade"
summary: "Entenda quando abrir mão da normalização em nome do desempenho."
chapter: 11
chapterSlug: performance
lesson: 4
difficulty: intermediario
xp: 28
prerequisites:
  - performance-03
hints:
  - "Releia no contexto a definição de desnormalização e o motivo pelo qual ela é considerada uma decisão de risco."
  - "Ao avaliar as opções, separe o efeito buscado dos efeitos colaterais de manter cópias de um mesmo dado."
  - "Na pergunta sobre a ordem, pergunte-se em que momento do projeto cada abordagem faz mais sentido."
references:
  - label: "SQLite — CREATE TABLE"
    url: "https://www.sqlite.org/lang_createtable.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre desnormalização."
  questions:
    - prompt: "A desnormalização pode ser usada para ____"
      options:
        - "Reduzir dados duplicados"
        - "Acelerar as consultas"
      answer: 1
      explanation: "Guardar dados duplicados evita operações custosas, como JOINs, e por isso pode acelerar as consultas."
    - prompt: "É inteligente começar com um banco ____ e ____ conforme a necessidade por velocidade."
      options:
        - "Normalizado, desnormalizar"
        - "Desnormalizado, normalizar"
      answer: 0
      explanation: "Comece normalizado para garantir integridade; desnormalize pontualmente se surgirem problemas de desempenho."
    - prompt: "Qual banco é mais fácil de manter livre de bugs?"
      options:
        - "Normalizado"
        - "É indiferente"
        - "Desnormalizado"
      answer: 0
      explanation: "Com dados sem duplicação, há menos chance de cópias ficarem inconsistentes entre si."
    - prompt: "Qual é o principal risco ao desnormalizar um banco?"
      options:
        - "Passar a exigir mais JOINs"
        - "Dados imprecisos e inconsistentes"
        - "Impedir o uso de chaves primárias"
        - "Perder a capacidade de criar índices"
      answer: 1
      explanation: "Dados duplicados podem divergir; por isso desnormalizar é arriscado e deve ser o último recurso."
---

## Contexto

Deixamos um gancho no capítulo de normalização. Acontece que integridade e
desduplicação de dados têm um custo — e esse custo normalmente é **velocidade**.

Juntar tabelas, usar subqueries, fazer agregações e rodar cálculos posteriores
tomam tempo. Em escalas muito grandes, essas técnicas avançadas podem se tornar
um enorme fardo de desempenho para a aplicação, às vezes travando o servidor do
banco.

Armazenar informação **duplicada** pode acelerar drasticamente uma aplicação
que precisa consultá-la de formas diferentes. Por exemplo, se você guardar as
informações de país do usuário direto no registro dele, nenhum JOIN caro será
necessário para carregar a página de perfil!

Dito isso, desnormalize por sua conta e risco! Desnormalizar um banco traz um
risco grande de dados imprecisos e com bugs. Na opinião deste curso, deve ser
usado como uma espécie de **último recurso** em nome da velocidade.

## Sua vez

Responda às perguntas sobre desnormalização por velocidade.

- Pense no que se ganha e no que se perde ao duplicar dados.
- Considere quando (e se) vale a pena abrir mão da normalização.

Depois de enviar, leia as explicações para conferir.
