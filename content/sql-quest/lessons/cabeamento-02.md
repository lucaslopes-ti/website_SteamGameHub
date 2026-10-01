---
id: cabeamento-02
title: "O caminho do cabo: cabeamento estruturado"
summary: "Siga o cabo da tomada até o switch: keystone, patch cord, tomada de rede, patch panel e rack."
chapter: 13
chapterSlug: cabeamento
lesson: 2
difficulty: iniciante
xp: 20
prerequisites:
  - cabeamento-01
hints:
  - "Comece pela tomada da parede e vá seguindo até o switch no rack."
  - "Cada peça tem um nome próprio — e a prova técnica cobra esses nomes."
references:
  - label: "Cisco — Networking Basics"
    url: "https://www.netacad.com/courses/networking-basics"
challenge:
  kind: quiz
  instruction: "Responda às perguntas abaixo sobre o caminho do cabo."
  questions:
    - prompt: "Qual componente é a tomada de rede embutida na parede, onde o cabo fixo termina?"
      options:
        - "Patch panel"
        - "Keystone"
        - "Rack"
        - "Patch cord"
      answer: 1
      explanation: "O keystone é o módulo da tomada de rede na parede: nele termina o cabeamento fixo vindo do armário."
    - prompt: "O cabo curto e flexível que liga o notebook do aluno à tomada da parede é o..."
      options:
        - "Cabeamento horizontal"
        - "Backbone"
        - "Patch cord (cordão de manobra)"
        - "Fibra monomodo"
      answer: 2
      explanation: "O patch cord é o cordão de manobra: liga o equipamento do usuário à tomada (ou switch ao patch panel)."
    - prompt: "O painel central onde todos os cabos fixos do prédio terminam, organizados e identificados, é o..."
      options:
        - "Patch panel"
        - "Access point"
        - "Roteador"
        - "Keystone"
      answer: 0
      explanation: "O patch panel centraliza as terminações dos cabos fixos no rack, permitindo organizar e gerenciar as ligações."
    - prompt: "O gabinete metálico padrão que abriga patch panels, switches e organizadores é o..."
      options:
        - "Rack"
        - "Keystone"
        - "SOHO"
        - "Conector 8P8C"
      answer: 0
      explanation: "O rack é o gabinete padronizado (medido em U) que abriga todo o equipamento ativo e passivo do armário."
    - prompt: "O conjunto padronizado de todos esses componentes — tomadas, cabos fixos, patch panels, racks — tem nome. Qual?"
      options:
        - "Cabeamento estruturado"
        - "Rede ponto a ponto"
        - "Topologia lógica"
        - "Intranet"
      answer: 0
      explanation: "Cabeamento estruturado é a padronização de todo esse caminho, seguindo normas TIA/EIA, para que a rede seja administrável e expansível."
---

## Contexto

Quando você conecta o cabo no notebook, o caminho até o switch não é um cabo
só — é um sistema padronizado, o **cabeamento estruturado**. Siga a viagem:

1. **Tomada de rede (keystone)** na parede da sala — o módulo onde o cabo
   fixo termina.
2. **Cabeamento horizontal**: o cabo fixo que corre pelas paredes e forros
   do prédio, da tomada até o armário.
3. **Patch panel** no rack: painel onde todos os cabos fixos terminam,
   organizados, identificados e numerados.
4. **Patch cord**: do patch panel ao switch — outro cordão de manobra.
5. **Switch** no **rack**: o gabinete metálico padronizado que abriga tudo
   isso, medido em "U".

## Por que padronizar?

Sem padronização, cada técnico instala do seu jeito e ninguém consegue dar
manutenção depois. Com cabeamento estruturado (seguindo normas TIA/EIA), a
rede fica **administrável**: qualquer profissional entende a instalação,
localiza falhas e amplia a rede sem retrabalho.
