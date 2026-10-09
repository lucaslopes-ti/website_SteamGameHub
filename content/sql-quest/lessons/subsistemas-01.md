---
id: subsistemas-01
title: "A rota do sinal: mapa dos seis subsistemas"
summary: "Conheça a sequência completa do serviço que entra no edifício até chegar ao equipamento do usuário."
chapter: 15
chapterSlug: subsistemas
lesson: 1
difficulty: iniciante
xp: 20
prerequisites: []
hints:
  - "Acompanhe o sinal de fora para dentro e de cima para baixo."
  - "Cada subsistema tem uma função própria na rota."
references:
  - label: "ANSI/TIA-568 — Cabeamento estruturado"
    url: "https://tiaonline.org/what-we-do/standards/"
images:
  - alt: "Os seis subsistemas do cabeamento estruturado em corte transversal de um edifício comercial, da entrada da operadora até a tomada do usuário"
    src: "cabeamento_seis_subsistemas.jpg"
---

## Contexto

O cabeamento estruturado divide a infraestrutura de um edifício em seis
subsistemas. Essa divisão ajuda você a localizar cada trecho, planejar a
instalação e diagnosticar falhas sem tratar toda a rede como um único cabo.

## A rota completa

Siga a ordem do sinal, de fora para dentro e de cima para baixo até o usuário:

1. **Entrada do edifício** — ponto em que os serviços da operadora chegam e
   entram na infraestrutura do prédio.
2. **Sala de equipamentos** — ambiente que concentra equipamentos principais
   e conexões centrais da rede.
3. **Cabeamento vertical (backbone)** — liga os pontos de distribuição do
   edifício, como a entrada, a sala de equipamentos e as salas de telecom.
4. **Sala de telecomunicações** — espaço que abriga a distribuição local de
   uma área ou andar.
5. **Cabeamento horizontal** — trecho fixo que vai da sala de telecomunicações
   até a tomada de rede da área atendida.
6. **Área de trabalho** — tomada, cordão de manobra e equipamento usado pela
   pessoa.

Essa sequência é um mapa funcional, não uma promessa de que todo prédio terá
seis salas separadas. Em edifícios pequenos, algumas funções podem compartilhar
o mesmo ambiente; os papéis dos subsistemas continuam distintos.

## Como usar o mapa

Quando uma conexão falhar, percorra a rota por etapas. Uma tomada sem sinal
pode ter problema no trecho horizontal, na distribuição da sala de
telecomunicações, no backbone ou em um ponto mais próximo da entrada. A ordem
ajuda a formular testes em vez de trocar componentes ao acaso.

Este capítulo abre um subsistema por aula. Primeiro você verá os pontos de
entrada e concentração; depois acompanhará a distribuição entre andares, a
terminação até o usuário, os meios e as práticas de aceitação.
