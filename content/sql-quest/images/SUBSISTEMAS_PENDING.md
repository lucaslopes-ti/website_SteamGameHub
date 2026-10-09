# Imagens do capítulo 15 — prompts prontos para o Gemini

> **Status:** parcial. Três das sete imagens já foram geradas e estão ligadas no
> front matter das respectivas unidades. As quatro restantes seguem pendentes:
> não são referenciadas por nenhuma lição, porque o build falha com "Imagem
> não encontrada" quando o arquivo não está em `images/`.
>
> **Como usar:** gere uma imagem por prompt, salve com o nome exato indicado
> em "Convenção de nomes" e me avise. Eu ligo o bloco `images:` no front
> matter de cada lição, rodo a validação e faço o commit.

**Já geradas e ligadas**

| Arquivo | Lição | Observação da revisão |
|---|---|---|
| `subsistemas_entrada_sala_equipamentos.jpg` | `subsistemas-02` | Não mostra o no-break nem distingue fibra dielétrica; o `alt` evita afirmar o que não aparece |
| `subsistemas_backbone_mmr_shaft.jpg` | `subsistemas-03` | A mais fiel ao pretendido: MMR, shaft, telecom e cores dos cabos |
| `subsistemas_rack_patch_panel.jpg` | `subsistemas-04` | O painel superior tem conectores parecidos com RJ45, não ópticos; o `alt` não o chama de fibra |
| `subsistemas_horizontal_90m.jpg` | `subsistemas-05` | Texto correto e legível. Não tem canaleta de piso nem folga em espiral; o `alt` omite ambos |
| `subsistemas_area_trabalho.jpg` | `subsistemas-06` | Sem texto. O conector aparece solto ao lado da tomada; o `alt` fala em "posição de conexão" |

**Reprovadas na revisão — regenerar**

As duas imagens abaixo foram geradas, mas ficaram fora do front matter porque
os defeitos atingem justamente o conceito que a aula ensina:

| Arquivo | Lição | Motivo |
|---|---|---|
| `subsistemas_plenum_riser.jpg` | `subsistemas-07` | Pseudo-texto em 6+ rótulos (`CREÑO`, `HIGIV`, `SMCK`, `MIGH`). Pior: o corte transversal do cabo mostra um único condutor grosso, parecendo cabo de energia em vez dos 4 pares de um UTP |
| `subsistemas_rotulagem_certificador.jpg` | `subsistemas-08` | Pseudo-texto em 4 rótulos (`PAICK DE`, `IDENTIFÃO`, `TESTTATIL`) e numeração de portas duplicada e incorreta — em uma lição sobre identificação correta, é um defeito que se anula a si mesmo |

**Ainda pendentes**

Nenhuma: as sete imagens foram geradas.

### Ajustes para as regenerações

1. Peça **"sem texto embutido na imagem"**. Os rótulos serão aplicados depois
   como legenda da lição. Texto pequeno é a origem de quase todo pseudo-texto.
2. Peça **poucos rótulos grandes**, se quiser rótulos. Rótulo pequeno e
   repetido é o pior caso para o gerador.
3. Na lição 07, **não peça corte transversal do cabo**. Se precisar mostrar a
   diferença entre produtos, peça os dois cabos inteiros lado a lado.
4. Se o conceito depender de conectores, **escreva o tipo explicitamente**
   ("conector óptico LC", "RJ45 de cobre com 8 pinos visíveis"). Ambíguo
   demais sai errado.

A `subsistemas-01` **já tem** imagem (`cabeamento_seis_subsistemas.jpg`) e
não aparece aqui.

## Estilo visual (vale para todos os prompts)

Inclua este bloco em todo prompt, para o capítulo ficar visualmente coeso:

```
Ilustração técnica didática, em corte transversal (seção) de um edifício
comercial moderno, estilo corte de prancha técnica. Paleta neutra e sóbria:
concreto cinza-claro, cabo azul para dados e cabo vermelho para energia,
fibra amarela. Linhas finas e precisas, como em ilustração de manual técnico.
Sem pessoas, sem rostos, sem marcas ou logotipos de terceiros. Sem texto
exceto curtos rótulos técnicos. Sem desfoque de profundidade de campo. Alta
resolução.
```

> **Sobre rótulos:** os modelos de imagem escrevem texto de forma pouco
> confiável. Prefira **poucos rótulos curtos** e o resto por forma e cor. Se
> algum rótulo sair errado, regere pedindo "sem texto" e use a legenda do
> próprio enunciado da lição.

## Convenção de nomes

- `subsistemas_entrada_sala_equipamentos.jpg`
- `subsistemas_backbone_mmr_shaft.jpg`
- `subsistemas_rack_patch_panel.jpg`
- `subsistemas_horizontal_90m.jpg`
- `subsistemas_area_trabalho.jpg`
- `subsistemas_plenum_riser.jpg`
- `subsistemas_rotulagem_certificador.jpg`

---

## 1. Entrada do edifício e sala de equipamentos

**Arquivo:** `subsistemas_entrada_sala_equipamentos.jpg`
**Lição:** `subsistemas-02`
**Alt sugerido:** "Entrada do serviço da operadora no térreo do edifício e sala de equipamentos com rack, proteção e aterramento"

```
<bloco de estilo>

Corte transversal da base de um edifício comercial de três pavimentos,
mostrando dois ambientes lado a lado:

À esquerda, na fachada externa do térreo, um ponto de entrada do serviço da
operadora: um módulo de entrada com um cabo de fibra óptica chegando do
exterior, atravessando a parede do edifício. Ao lado, uma caixa de proteção
metálica aterrada ao solo por um condutor, e um cabo de par trançado blindado
indo do módulo para dentro do edifício. Mostre também um cabo de fibra
monomodo sem armadura metálica, visualmente distinto (amarelo, sem malha),
entrando pela mesma fachada sem aterramento associado.

À direita, a sala de equipamentos: um ambiente fechado e controlado no térreo,
com um rack de 19 polegadas contendo equipamentos ativos, um no-break e
alimentação protegida. A porta está entreaberta e restrita.

Sem texto, exceto um ou dois rótulos curtos: "entrada" e "sala de
equipamentos".
```

---

## 2. Cabeamento vertical: MMR e shaft

**Arquivo:** `subsistemas_backbone_mmr_shaft.jpg`
**Lição:** `subsistemas-03`
**Alt sugerido:** "Cabeamento vertical ligando a MMR no térreo à sala de telecomunicações de um pavimento superior, passando por um shaft"

```
<bloco de estilo>

Corte transversal de um edifício de quatro pavimentos mostrando um shaft
vertical (canal técnico) que atravessa todos os andares.

No térreo, uma sala com dois racks da MMR (distribuição principal), lado a
lado. No terceiro pavimento, uma sala de telecomunicações com um rack de
distribuição local.

Entre os dois ambientes, um conjunto de cabos subindo dentro do shaft: um
cabo de par trançado azul e um cabo de fibra óptica amarelo, ambos
sustentados por bandejas de suporte e presilhas a cada pavimento. Mostre a
distinção visual entre o cabo do backbone, que sobe, e o cabo horizontal,
que sai do rack de telecomunicações para a lateral direita da sala.

Destaque visualmente que o backbone é o trecho que LIGA os dois racks de
distribuição.

Sem texto, exceto um rótulo curto: "backbone" apontando para o cabo no shaft.
```

---

## 3. Sala de telecomunicações: rack e patch panel

**Arquivo:** `subsistemas_rack_patch_panel.jpg`
**Lição:** `subsistemas-04`
**Alt sugerido:** "Rack de telecomunicações com patch panel, switches e patch cords organizados, identificando cada ligação"

```
<bloco de estilo>

Interior de uma sala de telecomunicações, foco em um rack de 19 polegadas
visto de frente, em perspectiva levemente aberta.

De cima para baixo dentro do rack: no topo, um painel patch horizontal com
fileiras de portas RJ45 identificadas; abaixo, dois switches de rede; abaixo,
um painel patch com portas; na base, uma régua de identificação com as
unidades U e um organizador horizontal de cabos.

Patch cords curtos e coloridos (azuis e cinzas) saltam do painel patch para
os switches, desenhados em curvas suaves e organizados. Rótulos pequenos e
legíveis identificam as portas. Mostre também, ao fundo, uma sala menor
com apenas um rack, indicando que as funções podem dividir o mesmo ambiente.

Sem texto, exceto rótulos curtos e técnicos nas portas e nas unidades U.
```

---

## 4. Cabeamento horizontal e o limite de 90 m

**Arquivo:** `subsistemas_horizontal_90m.jpg`
**Lição:** `subsistemas-05`
**Alt sugerido:** "Trecho do cabeamento horizontal de 90 metros do armário de telecomunicações até a tomada de rede na parede"

```
<bloco de estilo>

Vista em corte de um pavimento, mostrando um percurso longo e horizontal:

À esquerda, a sala de telecomunicações com o rack e o painel patch. À
direita, uma sala de escritório com a parede de fundo e uma tomada de rede
(keystone RJ45) embutida na parede a cerca de dois metros de altura.

O cabo azul de par trançado percorre o caminho fixo da tomada até o rack,
atravessando uma canaleta de piso, subindo pelo forro do teto falso em uma
curva larga e chegando ao painel patch. Destaque visualmente uma
medição linear do percurso: apareça no cabo uma cota discreta indicando
"90 m" no ponto do painel patch. Mostre também uma folga de serviço
organizada em espiral suave junto ao rack, fora da folga total.

O cabo deve estar bem esticado, sem curvas apertadas.

Sem texto, exceto a cota "90 m" e rótulos curtos "rack", "painel patch",
"tomada".
```

---

## 5. Área de trabalho

**Arquivo:** `subsistemas_area_trabalho.jpg`
**Lição:** `subsistemas-06`
**Alt sugerido:** "Área de trabalho: tomada de rede na parede, keystone, patch cord de manobra e notebook do usuário"

```
<bloco de estilo>

Ambiente de trabalho visto de perto, na escala de uma mesa de escritório.

À esquerda, a parede com uma tomada de rede embutida, mostrando o módulo
keystone RJ45 e a placa de rosto. Na tomada, um patch cord de
manobra de 2 a 3 metros, em curva larga e sem aperto, sai e vai até um
notebook apoiado sobre a mesa.

Mostre em detalhe ampliado, à direita, a sequência de conexão em três
peças: tomada na parede → patch cord de manobra → porta de rede do
equipamento do usuário. Um conector RJ45 termina de ser encaixado na
porta do notebook.

Sem pessoas, apenas o notebook, a tomada, o cabo e a mesa. Rótulos curtos
são bem-vindos: "tomada", "patch cord", "equipamento".
```

---

## 6. Plenum e closed riser — REGENERAR (prompt corrigido)

**Arquivo:** `subsistemas_plenum_riser.jpg`
**Lição:** `subsistemas-07`
**Alt sugerido:** "Comparação entre um espaço plenum de tratamento de ar e um shaft de riser fechado, com o tipo de cabo adequado a cada rota"

> **Por que o prompt anterior falhou:** pediu "uma faixa comparando os dois
> cabos", e o gerador desenhou um corte transversal. Saiu um condutor de cobre
> único e grosso, que parece cabo de energia em vez dos 4 pares de um UTP.
> Além disso, os rótulos pequenos viraram pseudo-texto (`CREÑO`, `HIGIV`,
> `SMCK`). **Correção abaixo: sem corte de cabo e sem texto nenhum.**

```
Ilustração técnica didática, vista em corte transversal (seção) de um
edifício comercial moderno, estilo corte de prancha técnica. Comparação lado
a lado de dois espaços de instalação de cabo, em dois painéis.

PAINEL DA ESQUERDA — espaço plenum: corte de um forro de teto falso com
ladrilho, mostrando o espaço de retorno de ar com um duto de ventilação
metálico e uma grelha de ventilação. Um feixe de cabos de rede passa por esse
espaço, junto à ventilação. Um dos cabos tem invólucro amarelo espesso,
apropriado a esse espaço.

PAINEL DA DIREITA — shaft de riser: corte vertical de um duto técnico com
paredes firmes e fechadas, atravessando as lajes de dois pavimentos. Cabos
subem dentro dele por uma esteira de suporte. Onde o duto atravessa cada laje,
mostre um colar de vedação corta-fogo em torno dos cabos. Um dos cabos tem
invólucro amarelo mais fino.

Na parte inferior, longe dos dois painéis, mostre um cabo comum de par
trançado com capa simples, junto a um símbolo circular vermelho de
proibição. É a ideia: esse cabo não pode ir no plenum.

REGRAS IMPORTANTES:
- NÃO desenhe corte transversal de cabo. Nenhum corte, nenhuma camada de
  isolação, nenhum condutor exposto.
- NÃO escreva NENHUMA palavra, letra, número ou rótulo na imagem. Nenhum
  texto em nenhum idioma. Os rótulos serão aplicados depois na lição.
- Os três cabos devem aparecer sempre inteiros, da ponta à ponta.
- Sem pessoas, sem rostos, sem logotipos de terceiros, sem desfoque de
  profundidade de campo. Alta resolução.
```

---

## 7. Rotulagem e teste de aceitação — REGENERAR (prompt corrigido)

**Arquivo:** `subsistemas_rotulagem_certificador.jpg`
**Lição:** `subsistemas-08`
**Alt sugerido:** "Rotulagem de ponta a ponta entre patch panel e tomada, e teste do enlace com certificador de cabo"

> **Por que o prompt anterior falhou:** pediu "rótulos pequenos e legíveis nas
> etiquetas" e "fileiras de portas". O gerador produziu pseudo-texto
> (`PAICK DE`, `IDENTIFÃO`, `TESTTATIL`) e, pior, numeração de portas
> **duplicada e incorreta** — justamente na aula que ensina identificação
> correta. **Correção abaixo: identificação por cor, nunca por número
> impresso, e nenhum texto.**

```
Ilustração técnica didática, em vista de cima e em ângulo, de um armário
técnico de rede. Duas zonas na mesma cena.

ZONA DA ESQUERDA — identificação nas duas pontas: mostre um painel patch de
cobre com fileiras de portas RJ45 e, ao lado, uma tomada de rede de parede.
Identifique a ligação SEM USAR TEXTO: use marcadores de identificação
plásticos removíveis, do tipo etiqueta de envelope ou braçadeira de
identificação, com CORES diferentes por porta. Uma porta do painel e a tomada
correspondente compartilham o mesmo marcador na mesma cor, e uma única linha
visual fina e contínua liga os dois marcadores. Portas não usadas ficam sem
marcador. Isso comunica "a mesma identificação nos dois extremos" sem uma
única palavra.

ZONA DA DIREITA — teste de aceitação: mostre um certificador de cabo portátil,
aparelho de mão com visor e dois conectores, ligado por um cabo de par trançado
a um módulo remoto menor na outra ponta do enlace. Um símbolo de aprovado
(quadro com tique) no visor. A topologia do teste deve estar correta: um
módulo em cada ponta do trecho testado.

REGRAS IMPORTANTES:
- NÃO escreva NENHUMA palavra, letra, número ou rótulo na imagem, nem no
  visor, nem nas etiquetas, nem nas portas. Nenhum texto em nenhum idioma.
- NÃO mostre números de porta impressos. A identificação é sempre por cor.
- Conectores do painel e da tomada são RJ45 de COBRE. Não desenhe conectores
  ópticos (LC ou SC) em nenhum ponto.
- Um cabo de par trançado tem dois condutores: uma ponta em cada módulo. Não
  deixe nenhum conector solto no ar.
- Sem pessoas, sem rostos, sem logotipos de terceiros, sem desfoque de
  profundidade de campo. Alta resolução.
```

---

## Depois de gerar

1. Salve os arquivos em `content/sql-quest/images/` com os nomes exatos da
   seção "Convenção de nomes".
2. Confirme que cada `src` correspondente no front matter da lição existe em
   `content/sql-quest/images/`.
3. Rode `npm run validate:sql-quest-content` e depois
   `npm run generate:sql-quest-catalog`.
4. Rode `npm test` e faça o commit.