---
id: subsistemas-03
title: "Cabeamento vertical: MMR, shafts e rotas"
summary: "Defina o backbone pelo que ele conecta e planeje seus caminhos entre pontos de distribuição."
chapter: 15
chapterSlug: subsistemas
lesson: 3
difficulty: intermediario
xp: 35
prerequisites: [subsistemas-02]
hints:
  - "A função do enlace importa mais que sua orientação física."
  - "Escolha caminho e tipo de cabo considerando distância, capacidade e requisitos de desempenho."
references:
  - label: "ANSI/TIA — Standards"
    url: "https://tiaonline.org/what-we-do/standards/"
  - label: "ISO/IEC 11801 — Cabeamento genérico"
    url: "https://www.iso.org/standard/66182.html"
challenge:
  kind: quiz
  instruction: "Responda às perguntas sobre backbone e caminhos do edifício."
  questions:
    - prompt: "O que define principalmente um enlace como parte do backbone?"
      options:
        - "Ele está instalado na vertical dentro de um shaft."
        - "Ele interliga pontos de distribuição da infraestrutura."
        - "Ele é obrigatoriamente de fibra óptica."
        - "Ele atende diretamente uma única tomada de usuário."
      answer: 1
      explanation: "Backbone é definido pela função de interligar pontos de distribuição, não pela orientação ou por um único tipo de meio."
    - prompt: "Qual opção descreve melhor a função de um MMR (Main Distribution Room)?"
      options:
        - "Abrigiar racks e distribuição principal que concentram ou interligam enlaces do edifício."
        - "Servir como ponto de terminação para cada tomada de usuário."
        - "Ser o caminho vertical obrigatório para todo cabo instalado no prédio."
        - "Concentrar apenas equipamentos ativos, sem terminações ou interligações."
      answer: 0
      explanation: "O MMR é uma sala principal de distribuição, normalmente com racks e terminações que organizam interligações."
    - prompt: "O que é um shaft no contexto das rotas de cabeamento?"
      options:
        - "Uma canaleta horizontal instalada acima do forro."
        - "Um espaço vertical destinado a acomodar instalações entre pavimentos."
        - "Um espaço vertical destinado apenas a dutos de ventilação, sem cabeamento."
        - "Uma escada técnica usada para suportar cabos entre racks."
      answer: 1
      explanation: "O shaft é um caminho vertical do edifício; o cabeamento deve ser instalado e protegido conforme as regras aplicáveis ao espaço."
    - prompt: "Que afirmação sobre os meios usados no backbone é correta?"
      options:
        - "Deve usar somente fibra, pois cobre não pode interligar distribuidores."
        - "Deve usar somente pares trançados, desde que o percurso seja vertical."
        - "Pode incluir fibra e, conforme distância e requisitos, cabeamento de pares trançados."
        - "Pode usar qualquer cabo sem considerar desempenho ou distância."
      answer: 2
      explanation: "A escolha depende da aplicação, distância, capacidade e especificação. Fibra é comum em backbone, mas não é a definição do subsistema."
    - prompt: "Ao especificar o comprimento de um enlace de backbone, qual prática é adequada?"
      options:
        - "Assumir que todo cabo vertical pode ter qualquer comprimento por estar em shaft."
        - "Aplicar automaticamente o limite de 90 m do horizontal sem avaliar a arquitetura."
        - "Usar o limite do canal horizontal sem verificar o meio escolhido."
        - "Verificar a distância prevista, a categoria do meio e os limites aplicáveis ao enlace e à aplicação."
      answer: 3
      explanation: "Limites dependem do tipo de cabeamento e da arquitetura especificada; não se deve transpor automaticamente o limite do horizontal para qualquer backbone."
    - prompt: "Um cabo sobe um andar, mas liga um switch de uma sala a uma tomada de usuário. Ele é backbone apenas por subir?"
      options:
        - "Sim; qualquer cabo que sobe um pavimento é backbone."
        - "Não; a direção vertical sozinha não define o subsistema, e a função do enlace precisa ser analisada."
        - "Sim, desde que termine em um rack, mesmo que atenda uma tomada."
        - "Não; backbone só existe entre edifícios diferentes."
      answer: 1
      explanation: "A posição física não basta. Backbone liga pontos de distribuição; um trecho destinado à tomada pode pertencer ao cabeamento horizontal conforme o projeto."
---

## Contexto

O **backbone** interliga pontos de distribuição: por exemplo, a entrada, a
sala de equipamentos e as salas de telecomunicações. Essa definição responde
à pergunta **o que o enlace conecta**, não onde ele está instalado. Um cabo
pode atravessar um shaft e não ser backbone se sua função for outra.

## MMR e caminhos

O **MMR** (Main Distribution Room) é uma sala principal de distribuição,
geralmente com racks, painéis e equipamentos que concentram ou conectam os
enlaces. O backbone pode percorrer **shafts**, escadas técnicas, eletrocalhas,
canaletas ou outros caminhos aprovados. Cada rota deve proteger o cabo,
respeitar ocupação e acessibilidade e permitir manutenção.

## Escolha do meio

Backbones podem usar fibra óptica e, quando a aplicação e o projeto permitem,
cabeamento de pares trançados. A fibra costuma ser escolhida para distâncias,
capacidade ou imunidade a interferência que favoreçam esse meio; isso não
significa que a palavra backbone seja sinônimo de fibra.

Antes de definir o enlace, verifique comprimento, aplicação, categoria ou tipo
de fibra, transceivers e limites normativos correspondentes. O limite de
90 metros do cabeamento horizontal não deve ser aplicado automaticamente a
todo backbone: cada arquitetura possui critérios próprios.

## Sua vez

Nas perguntas, classifique os enlaces pela função. Não conclua que um trecho é
backbone apenas por subir de andar ou por passar em um shaft.
