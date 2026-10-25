---
id: treino-saep-03
title: "Cabos, distâncias e pinagem"
summary: "Os limites de 90 m e 100 m, quando usar fibra e como conferir o padrão T568A ou T568B."
chapter: 18
chapterSlug: treino-saep
lesson: 3
difficulty: iniciante
xp: 30
prerequisites:
  - treino-saep-02
hints:
  - "Cabo fixo até 90 m + cordões até 10 m = canal de 100 m."
  - "Cabo direto: mesmo padrão nas duas pontas."
references:
  - label: "Cisco — Introduction to Networks (ITN)"
    url: "https://www.netacad.com/courses/ccna-introduction-networks"
challenge:
  kind: quiz
  instruction: "Chamado nº 8: o teste do técnico novo. Use os 4 passos: comando, dados, riscar as absurdas, escolher."
  questions:
    - prompt: "O cliente quer ligar o prédio 1 ao prédio 2, que fica a 150 m, do outro lado do pátio. O técnico anterior sugeriu um cabo de par trançado único entre os dois racks. Qual solução atende à norma de cabeamento?"
      options:
        - "Um cabo Cat 6 de 150 m, porque Cat 6 é mais rápido que Cat 5e."
        - "Fibra óptica entre os prédios, ou um ponto de distribuição no meio do caminho."
        - "Um cabo blindado F/UTP de 150 m, porque a blindagem aumenta o alcance."
        - "Dois patch cords de 75 m emendados com fita isolante."
      answer: 1
      explanation: "Par trançado vai até 100 m. Entre prédios e acima disso, a escolha comum é a fibra óptica."
    - prompt: "Na vistoria de um ponto de rede, o técnico mediu 95 m de cabo fixo entre o patch panel e a tomada (enlace permanente), mais 3 m de patch cord no rack e 2 m na mesa. Total: 100 m. A instalação está de acordo com o arranjo convencional de cabeamento?"
      options:
        - "Sim, porque o canal completo não passou de 100 m."
        - "Sim, porque os patch cords somam menos de 10 m."
        - "Não, porque o enlace permanente passou de 90 m."
        - "Não, porque patch cord no rack não é permitido."
      answer: 2
      explanation: "Arranjo convencional: até 90 m de enlace permanente + até 10 m de cordões = canal de 100 m."
    - prompt: "Para ligar o PC do financeiro ao switch, o projeto pede cabo direto. O técnico crimpou T568A numa ponta e T568B na outra. O LED da porta acendeu e ele fechou o chamado. Qual avaliação está correta?"
      options:
        - "O cabo ficou cruzado: o direto usa o mesmo padrão nas duas pontas. LED aceso não comprova a instalação; falta testar o cabo."
        - "Está certo, porque o LED aceso comprova que o cabo está bom."
        - "Está certo, porque T568A e T568B são iguais."
        - "O erro é do switch, que deveria aceitar só T568A."
      answer: 0
      explanation: "Cabo direto = mesmo padrão nas duas pontas. Testar com o testador de cabo antes de fechar."
    - prompt: "Qual instrumento confere se os 8 fios do cabo estão na ordem certa?"
      options:
        - "Testador de cabo (LEDs de 1 a 8)"
        - "Termômetro"
        - "OTDR"
        - "Alicate de corte"
      answer: 0
      explanation: "O testador acende os LEDs 1 a 8 na ordem. Se um LED pular ou não acender, a ponta tem de ser refeita."
---

## Contexto

O cliente quer ligar o segundo prédio e trocar os cabos do financeiro. O
técnico novo precisa saber as regras da norma de cabeamento (TIA-568 e, no
Brasil, NBR 14565) antes de sair crimpando.

## As regras que mais caem

| Regra | Valor |
|---|---|
| Cabo fixo (enlace permanente, do patch panel até a tomada) | até **90 m** |
| Cordões (patch cords) somados | até **10 m** |
| Canal completo de par trançado | até **100 m** |
| Acima de 100 m ou entre prédios | **fibra óptica** |
| Cabo direto (PC → switch) | o **mesmo padrão** nas duas pontas (T568B e T568B) |

A categoria (Cat 5e, Cat 6) muda a **velocidade**, não o limite de 100 m. A
blindagem protege contra **interferência**, não aumenta o alcance.

## Sua vez

Três situações de instalação. Confira cada número com a tabela.
