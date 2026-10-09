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

## 6. Plenum e closed riser

**Arquivo:** `subsistemas_plenum_riser.jpg`
**Lição:** `subsistemas-07`
**Alt sugerido:** "Comparação entre um espaço plenum de tratamento de ar e um shaft de riser fechado, com o tipo de cabo adequado a cada rota"

```
<bloco de estilo>

Comparação lado a lado de dois espaços de instalação de cabo, como numa
prancha técnica com duas vistas:

À esquerda, um espaço plenum: um duto grande de retorno de ar com uma
grelha, visto por dentro, com cabos de rede passando junto a um duto de
ventilação. Mostre um cabo com invólucro amarelado apropriado a esse espaço.

À direita, um shaft de riser fechado: um duto vertical com paredes firmes,
fechado nas passagens entre pavimentos, com cabos subindo dentro dele.

No centro inferior, uma faixa comparando visualmente os dois cabos: o do
plenum tem capa amarela mais espessa, o do riser tem capa amarela mais
fina, deixando claro que são produtos diferentes para espaços diferentes.

Incorpore visualmente a regra da imagem: um cabo comum não deve aparecer no
trecho plenum, nem mesmo embrulhado em uma capa improvisada — mostre esse
cabo comum barrado por um símbolo de prohibition discreto ao lado do trecho
plenum.

Sem texto, exceto rótulos curtos "plenum" e "riser".
```

---

## 7. Rotulagem e teste de aceitação

**Arquivo:** `subsistemas_rotulagem_certificador.jpg`
**Lição:** `subsistemas-08`
**Alt sugerido:** "Rotulagem de ponta a ponta entre patch panel e tomada, e teste do enlace com certificador de cabo"

```
<bloco de estilo>

Cena de teste de aceitação de rede, vista de cima e em ângulo, em um armário
técnico.

À esquerda, o painel patch com etiquetas claramente visíveis em cada porta.
Ao lado, uma tomada de rede com uma etiqueta correspondente. Uma linha
visual fina e contínua liga a etiqueta do painel à etiqueta da tomada,
indicando que a identificação é a mesma nos dois pontos.

À direita, um certificador de cabo (aparelho de teste de rede, com visor
pequeno e dois conectores) conectado a um dos lados de um trecho de cabo de
par trançado, com o cabo passando por uma canaleta. No visor, um símbolo
sinalizando aprovação do teste.

A cena transmite: rotulagem consistente nos dois extremos e medição real do
enlace com equipamento de teste.

Sem texto, exceto rótulos curtos e pequenos nas etiquetas.
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