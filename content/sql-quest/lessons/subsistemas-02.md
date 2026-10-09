---
id: subsistemas-02
title: "Entrada do edifício e sala de equipamentos"
summary: "Entenda a chegada dos serviços, o aterramento de proteção e as condições da sala central."
chapter: 15
chapterSlug: subsistemas
lesson: 2
difficulty: intermediario
xp: 30
prerequisites: [subsistemas-01]
hints:
  - "Na entrada, diferencie o meio de acesso da função do transceiver."
  - "Metais condutores e elementos totalmente dielétricos não têm o mesmo requisito de bonding."
references:
  - label: "ANSI/TIA — Standards"
    url: "https://tiaonline.org/what-we-do/standards/"
  - label: "ISO/IEC 11801 — Cabeamento genérico"
    url: "https://www.iso.org/standard/66182.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas sobre a entrada e a sala de equipamentos."
  questions:
    - prompt: "Qual é a função da facility entrance (entrada de serviços) no edifício?"
      options:
        - "Conectar diretamente o computador do usuário ao equipamento da operadora."
        - "Receber e fazer a transição dos serviços externos da operadora para a infraestrutura interna."
        - "Distribuir os cabos horizontais entre as tomadas de cada pavimento."
        - "Concentrar todos os switches de acesso, sem terminar serviços externos."
      answer: 1
      explanation: "A entrada de serviços é a interface entre a rede externa da operadora e a infraestrutura de telecomunicações do edifício."
    - prompt: "O que descreve corretamente Protective Grounding and Bonding (PGB)?"
      options:
        - "Unir e aterrar elementos metálicos conforme o projeto de proteção elétrica e telecomunicações."
        - "Usar o aterramento como condutor de dados para Ethernet."
        - "Ligar toda blindagem ao terra em qualquer ponto, sem seguir o projeto."
        - "Substituir a proteção contra surtos por um único condutor de dados."
      answer: 0
      explanation: "Grounding e bonding tratam da segurança e equipotencialização de partes condutoras; não transportam os dados da rede."
    - prompt: "Ao especificar o meio de acesso da operadora, por que identificar o transceiver?"
      options:
        - "Porque a escolha do transceiver determina a altura útil do rack."
        - "Porque ele deve ser compatível com o meio e com a interface óptica ou elétrica usada no acesso."
        - "Porque o mesmo módulo funciona com qualquer fibra, alcance e equipamento."
        - "Porque ele substitui o patch panel na terminação do cabeamento horizontal."
      answer: 1
      explanation: "O transceiver precisa corresponder ao tipo de interface e ao meio de transmissão; a escolha não substitui o projeto da rota."
    - prompt: "Qual afirmação sobre fibra totalmente dielétrica e aterramento está correta?"
      options:
        - "Toda fibra precisa ser aterrada, mesmo sem elemento metálico."
        - "A blindagem metálica dispensa bonding porque bloqueia interferência."
        - "A fibra totalmente dielétrica não tem componentes metálicos condutores a aterrar; uma fibra blindada com metal requer bonding apropriado."
        - "Uma fibra com armadura metálica é dielétrica em toda sua construção."
      answer: 2
      explanation: "O requisito depende da presença de elementos metálicos. Uma construção totalmente dielétrica não conduz eletricidade; componentes metálicos precisam ser tratados conforme as normas e o projeto."
    - prompt: "Qual conjunto descreve melhor uma sala de equipamentos bem planejada?"
      options:
        - "Ambiente aberto, com acesso livre e climatização apenas durante o horário comercial."
        - "Sala de uso geral em que materiais podem bloquear o acesso às faces dos racks."
        - "Ambiente climatizado e protegido, mas sem alimentação elétrica adequada aos equipamentos."
        - "Ambiente controlado, acesso restrito, climatização e alimentação elétrica adequada."
      answer: 3
      explanation: "Equipamentos centrais precisam de condições ambientais, energia e segurança compatíveis com sua operação."
    - prompt: "Na montagem de um rack na sala de equipamentos, por que verificar sua altura e a folga disponível?"
      options:
        - "Para confirmar que os equipamentos cabem, podem ser instalados e mantidos com ventilação e acesso adequados."
        - "Para determinar se o sinal percorre o backbone na vertical."
        - "Para dispensar a organização e a identificação dos cabos."
        - "Para garantir que todos os racks do edifício tenham a mesma altura."
      answer: 0
      explanation: "A altura útil do rack, medida em U, e o espaço de serviço devem comportar os equipamentos e permitir operação segura; não existe uma altura universal obrigatória para todo projeto."
---

## Contexto

A **entrada do edifício** é o ponto em que os serviços da operadora cruzam para
a infraestrutura interna. A facility entrance pode incluir terminações,
proteções, caminhos e interfaces necessários à transição. Ela não é a tomada
de um usuário nem, por si só, toda a sala de equipamentos.

Ao planejar o acesso, confirme qual serviço chega e qual meio será usado:
fibra, cobre ou outra interface prevista. O **transceiver** deve ser compatível
com o meio, o tipo de sinal e os equipamentos nas duas pontas. Não escolha um
módulo apenas pela aparência do conector.

## Proteção e bonding

O aterramento de proteção e o bonding conectam partes metálicas ao sistema
adequado de equipotencialização e proteção. Isso é importante para segurança,
controle de diferenças de potencial e tratamento de surtos, conforme o projeto
elétrico e as normas aplicáveis.

Uma fibra **totalmente dielétrica** não contém metal condutor e, portanto, não
tem elemento de cabo a aterrar. Já uma construção blindada ou com mensageiro,
armadura ou outro componente metálico requer tratamento de bonding apropriado.
Não improvise conexões de terra: siga o projeto e os procedimentos técnicos.

## Sala de equipamentos

Esse ambiente concentra equipamentos principais e precisa oferecer condições
estáveis: acesso restrito, climatização, alimentação elétrica adequada,
organização e espaço para manutenção. Ao escolher racks, confira a altura útil
em unidades **U**, a carga, a ventilação e a folga para cabos. Um rack que
acomoda os equipamentos no papel ainda pode ser inadequado se impedir o acesso
ou bloquear o fluxo de ar.

## Sua vez

Use as perguntas para distinguir as responsabilidades da entrada de serviços,
da proteção elétrica e da sala que abriga os equipamentos centrais.
