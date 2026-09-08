/**
 * Lições da SQL Quest — conteúdo ORIGINAL em PT-BR.
 *
 * Cenário fictício: **NexoPay**, uma plataforma de pagamentos que precisa
 * organizar clientes, contas, cartões e transferências em um banco relacional.
 *
 * Regras de autoria:
 * - Todo texto é autoral (apenas os temas seguem a grade curricular de
 *   referência — SELECT, CREATE TABLE, ALTER TABLE e restrições).
 * - `setupSql` roda em um banco SQLite novo a cada execução e é a única fonte
 *   de dados da lição.
 * - `challenge.kind === "exact"` valida colunas/linhas; `"schema"` valida a
 *   estrutura criada/alteredada pelo aluno.
 */
import type {
  SQLLesson,
  SQLTableSchema,
  SQLColumnSchema,
} from "../../lib/sql-quest/types";

function col(
  name: string,
  type: string,
  opts: { pk?: boolean; notNull?: boolean; unique?: boolean } = {}
): SQLColumnSchema {
  return {
    name,
    type,
    notNull: opts.notNull ?? false,
    primaryKey: opts.pk ?? false,
    unique: opts.unique ?? false,
    defaultValue: null,
    references: null,
  };
}

function table(name: string, columns: SQLColumnSchema[]): SQLTableSchema {
  return { name, columns, foreignKeys: [] };
}

// ---------------------------------------------------------------------------
// Seed compartilhado do Capítulo 1 (tabela clientes do NexoPay)
// ---------------------------------------------------------------------------

const CLIENTES_SETUP_SQL = `CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT,
  cidade TEXT,
  saldo REAL,
  ativo INTEGER
);

INSERT INTO clientes (id, nome, cidade, saldo, ativo) VALUES
  (1, 'Ana Souza', 'São Paulo', 1250.75, 1),
  (2, 'Bruno Lima', 'Rio de Janeiro', 480.5, 1),
  (3, 'Carla Mendes', 'Belo Horizonte', 0, 0),
  (4, 'Diego Ramos', 'Curitiba', 3320, 1),
  (5, 'Elisa Nogueira', 'Salvador', 89.9, 1);`;

const CLIENTES_TABLE = table("clientes", [
  col("id", "INTEGER", { pk: true }),
  col("nome", "TEXT"),
  col("cidade", "TEXT"),
  col("saldo", "REAL"),
  col("ativo", "INTEGER"),
]);

export const lessons: SQLLesson[] = [
  // =========================================================================
  // CAPÍTULO 1 — Consultas com SELECT
  // =========================================================================
  {
    id: "1-1",
    chapter: 1,
    lesson: 1,
    title: "Sua primeira consulta: SELECT *",
    summary:
      "Busque todas as colunas da tabela de clientes do NexoPay com SELECT *.",
    difficulty: "iniciante",
    xpReward: 50,
    explanation:
      "Bancos de dados relacionais guardam informações em tabelas, organizadas em colunas (campos) e linhas (registros). Para LER dados de uma tabela usamos o comando `SELECT`.\n\nO asterisco (`*`) funciona como um coringa: ele pede TODAS as colunas da tabela. A estrutura básica é:\n\n`SELECT * FROM nome_da_tabela;`\n\nNo NexoPay, a tabela `clientes` guarda quem usa a plataforma. O banco já vem populado — seu trabalho é apenas consultá-lo.\n\nLembre-se: toda instrução SQL termina com ponto e vírgula (`;`).",
    exampleSql: "SELECT * FROM clientes;\n",
    setupSql: CLIENTES_SETUP_SQL,
    tables: [CLIENTES_TABLE],
    challenge: {
      kind: "exact",
      instruction:
        "Escreva uma consulta que traga todas as colunas e todos os registros da tabela `clientes` do NexoPay.",
      expectedColumns: ["id", "nome", "cidade", "saldo", "ativo"],
      expectedRows: [
        [1, "Ana Souza", "São Paulo", 1250.75, 1],
        [2, "Bruno Lima", "Rio de Janeiro", 480.5, 1],
        [3, "Carla Mendes", "Belo Horizonte", 0, 0],
        [4, "Diego Ramos", "Curitiba", 3320, 1],
        [5, "Elisa Nogueira", "Salvador", 89.9, 1],
      ],
    },
    hints: [
      "Use o comando SELECT seguido do coringa *.",
      "A tabela se chama clientes.",
      "SELECT * FROM clientes;",
    ],
  },
  {
    id: "1-2",
    chapter: 1,
    lesson: 2,
    title: "Selecionando uma única coluna",
    summary:
      "Em vez de trazer tudo, aprenda a pedir apenas uma coluna da tabela.",
    difficulty: "iniciante",
    xpReward: 50,
    explanation:
      "Nem sempre você precisa de todos os campos. Para pedir uma coluna específica, troque o `*` pelo nome dela:\n\n`SELECT nome FROM clientes;`\n\nIsso devolve apenas os valores de `nome`, um por linha — muito mais enxuto para relatórios. O NexoPay, por exemplo, pode querer gerar uma lista simples com os nomes dos clientes ativos sem os demais dados.\n\nA ordem das colunas no resultado é a ordem em que você as escreve no `SELECT`.",
    exampleSql: "SELECT nome FROM clientes;\n",
    setupSql: CLIENTES_SETUP_SQL,
    tables: [CLIENTES_TABLE],
    challenge: {
      kind: "exact",
      instruction:
        "Escreva uma consulta que traga somente a coluna `nome` da tabela `clientes`.",
      expectedColumns: ["nome"],
      expectedRows: [
        ["Ana Souza"],
        ["Bruno Lima"],
        ["Carla Mendes"],
        ["Diego Ramos"],
        ["Elisa Nogueira"],
      ],
    },
    hints: [
      "Troque o * pelo nome da coluna desejada.",
      "SELECT nome FROM clientes;",
    ],
  },
  {
    id: "1-3",
    chapter: 1,
    lesson: 3,
    title: "Selecionando múltiplas colunas",
    summary:
      "Combine várias colunas em uma consulta, separando-as por vírgula.",
    difficulty: "iniciante",
    xpReward: 50,
    explanation:
      "Assim como você pode escolher uma coluna, também pode escolher várias — basta separá-las por vírgula:\n\n`SELECT coluna_um, coluna_dois FROM tabela;`\n\nNo NexoPay, imagine que o time de suporte queira entrar em contato com os clientes. Faz sentido buscar apenas `nome` e `cidade`, sem expor saldos. As colunas aparecem no resultado na mesma ordem em que foram escritas.\n\nContinue finalizando a instrução com ponto e vírgula.",
    exampleSql:
      "SELECT nome, cidade FROM clientes;\n",
    setupSql: CLIENTES_SETUP_SQL,
    tables: [CLIENTES_TABLE],
    challenge: {
      kind: "exact",
      instruction:
        "Escreva uma consulta que retorne as colunas `nome`, `cidade` e `saldo`, nessa ordem.",
      expectedColumns: ["nome", "cidade", "saldo"],
      expectedRows: [
        ["Ana Souza", "São Paulo", 1250.75],
        ["Bruno Lima", "Rio de Janeiro", 480.5],
        ["Carla Mendes", "Belo Horizonte", 0],
        ["Diego Ramos", "Curitiba", 3320],
        ["Elisa Nogueira", "Salvador", 89.9],
      ],
    },
    hints: [
      "Liste as colunas após o SELECT, separadas por vírgula.",
      "A ordem pedida é nome, depois cidade, depois saldo.",
      "SELECT nome, cidade, saldo FROM clientes;",
    ],
  },
  {
    id: "1-4",
    chapter: 1,
    lesson: 4,
    title: "Apelidos com AS (alias)",
    summary:
      "Renomeie colunas no resultado usando alias para leitura mais clara.",
    difficulty: "iniciante",
    xpReward: 50,
    explanation:
      "Às vezes o nome da coluna no banco não é o ideal para quem vai ler o relatório. Com um alias (apelido), você renomeia a coluna APENAS no resultado, sem alterar a estrutura da tabela:\n\n`SELECT nome AS titular FROM clientes;`\n\nO resultado mostra uma coluna chamada `titular`, com os mesmos valores de `nome`. O alias também funciona com mais de uma coluna de uma vez.\n\nNo NexoPay, usar `AS` deixa as planilhas exportadas muito mais amigáveis para times não técnicos.",
    exampleSql:
      "SELECT nome AS titular, cidade AS localizacao FROM clientes;\n",
    setupSql: CLIENTES_SETUP_SQL,
    tables: [CLIENTES_TABLE],
    challenge: {
      kind: "exact",
      instruction:
        "Escreva uma consulta que retorne a coluna `nome` com o alias `titular` e a coluna `cidade` com o alias `localizacao`.",
      expectedColumns: ["titular", "localizacao"],
      expectedRows: [
        ["Ana Souza", "São Paulo"],
        ["Bruno Lima", "Rio de Janeiro"],
        ["Carla Mendes", "Belo Horizonte"],
        ["Diego Ramos", "Curitiba"],
        ["Elisa Nogueira", "Salvador"],
      ],
    },
    hints: [
      "Use a palavra-chave AS após o nome da coluna original.",
      "O apelido vai entre o AS e a vírgula/próxima coluna.",
      "SELECT nome AS titular, cidade AS localizacao FROM clientes;",
    ],
  },

  // =========================================================================
  // CAPÍTULO 2 — Criando e alterando tabelas
  // =========================================================================
  {
    id: "2-1",
    chapter: 2,
    lesson: 1,
    title: "Criando tabelas com CREATE TABLE",
    summary:
      "Estruture o armazenamento do NexoPay criando sua primeira tabela.",
    difficulty: "iniciante",
    xpReward: 60,
    explanation:
      "Consultar é só metade da história: um dia alguém precisa CRIAR as tabelas que guardam os dados. O comando é `CREATE TABLE`:\n\n`CREATE TABLE nome_da_tabela (coluna tipo, coluna tipo);`\n\nCada coluna recebe um nome e um tipo de dado. Por exemplo, `id INTEGER` guarda números inteiros e `nome TEXT` guarda textos.\n\nO NexoPay está expandindo e quer cadastrar estabelecimentos parceiros que aceitam pagamentos pela plataforma. Sua missão é criar a tabela que vai armazená-los.",
    exampleSql:
      "CREATE TABLE estabelecimentos (\n  id INTEGER,\n  nome TEXT\n);\n",
    setupSql: "-- NexoPay: base vazia. Crie a tabela solicitada.\n",
    tables: [],
    challenge: {
      kind: "schema",
      instruction:
        "Crie a tabela `estabelecimentos` com as colunas `id` (INTEGER) e `nome` (TEXT).",
      expectedTables: [
        {
          name: "estabelecimentos",
          columns: [
            { name: "id", type: "INTEGER" },
            { name: "nome", type: "TEXT" },
          ],
        },
      ],
    },
    hints: [
      "Comece com CREATE TABLE seguido do nome da tabela.",
      "Cada coluna leva um tipo: números inteiros usam INTEGER, textos usam TEXT.",
      "CREATE TABLE estabelecimentos (id INTEGER, nome TEXT);",
    ],
  },
  {
    id: "2-2",
    chapter: 2,
    lesson: 2,
    title: "Escolhendo os tipos de dados",
    summary:
      "Entenda INTEGER, TEXT e REAL ao modelar uma tabela de assinaturas.",
    difficulty: "iniciante",
    xpReward: 60,
    explanation:
      "Cada dado que o NexoPay guarda tem uma natureza, e o tipo certo evita erros e economiza espaço:\n\n- `INTEGER` — números inteiros (ex.: identificadores, quantidades).\n- `TEXT` — textos, inclusive datas em formato ISO (ex.: '2026-09-08').\n- `REAL` — números com casas decimais (ex.: valores monetários como 29.90).\n\nDeclaramos o tipo logo após o nome da coluna, dentro dos parênteses do `CREATE TABLE`.\n\nAgora o NexoPay quer controlar assinaturas do plano premium: cada assinatura tem um identificador, um plano, um valor mensal e a data em que começou.",
    exampleSql:
      "CREATE TABLE assinaturas (\n  id INTEGER,\n  plano TEXT,\n  mensalidade REAL,\n  criada_em TEXT\n);\n",
    setupSql: "-- NexoPay: base vazia. Crie a tabela solicitada.\n",
    tables: [],
    challenge: {
      kind: "schema",
      instruction:
        "Crie a tabela `assinaturas` com as colunas: `id` INTEGER, `plano` TEXT, `mensalidade` REAL e `criada_em` TEXT.",
      expectedTables: [
        {
          name: "assinaturas",
          columns: [
            { name: "id", type: "INTEGER" },
            { name: "plano", type: "TEXT" },
            { name: "mensalidade", type: "REAL" },
            { name: "criada_em", type: "TEXT" },
          ],
        },
      ],
    },
    hints: [
      "Identificadores inteiros usam INTEGER.",
      "Valores com centavos (decimais) usam REAL.",
      "CREATE TABLE assinaturas (id INTEGER, plano TEXT, mensalidade REAL, criada_em TEXT);",
    ],
  },
  {
    id: "2-3",
    chapter: 2,
    lesson: 3,
    title: "Adicionando colunas com ALTER TABLE",
    summary:
      "Inclua uma nova coluna em uma tabela existente sem recriá-la.",
    difficulty: "intermediario",
    xpReward: 60,
    explanation:
      "Nem sempre a estrutura planejada no início cobre tudo. Quando uma tabela já existe e precisa ganhar um campo novo, usamos:\n\n`ALTER TABLE nome ADD COLUMN nome_coluna tipo;`\n\nIsso adiciona a coluna ao final da tabela. Registros antigos ficam com valor `NULL` na nova coluna até serem preenchidos.\n\nNo NexoPay, as contas dos clientes foram criadas sem saldo, mas agora precisamos registrar quanto há em cada conta.",
    exampleSql: "ALTER TABLE contas ADD COLUMN saldo REAL;\n",
    setupSql: `CREATE TABLE contas (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER,
  tipo TEXT
);

INSERT INTO contas (id, cliente_id, tipo) VALUES
  (1, 1, 'corrente'),
  (2, 2, 'poupanca'),
  (3, 4, 'corrente');`,
    tables: [
      table("contas", [
        col("id", "INTEGER", { pk: true }),
        col("cliente_id", "INTEGER"),
        col("tipo", "TEXT"),
      ]),
    ],
    challenge: {
      kind: "schema",
      instruction:
        "Adicione à tabela `contas` a coluna `saldo` do tipo REAL.",
      expectedTables: [
        {
          name: "contas",
          columns: [{ name: "saldo", type: "REAL" }],
        },
      ],
    },
    hints: [
      "Você não vai recriar a tabela: use ALTER TABLE.",
      "Depois do nome da tabela vem ADD COLUMN e a definição da nova coluna.",
      "ALTER TABLE contas ADD COLUMN saldo REAL;",
    ],
  },
  {
    id: "2-4",
    chapter: 2,
    lesson: 4,
    title: "Renomeando colunas",
    summary:
      "Use ALTER TABLE para renomear uma coluna e alinhar nomes ao negócio.",
    difficulty: "intermediario",
    xpReward: 60,
    explanation:
      "Com o tempo, nomes de colunas podem ficar desatualizados. Para renomear uma coluna em uma tabela que já existe, o SQLite oferece:\n\n`ALTER TABLE tabela RENAME COLUMN nome_atual TO nome_novo;`\n\nApenas o nome muda: os valores e o tipo permanecem intactos.\n\nNo NexoPay, a equipe de cartões percebeu que `numero` é genérico demais — o campo identifica o código do cartão. Vamos renomeá-lo para `codigo`.",
    exampleSql:
      "ALTER TABLE cartoes RENAME COLUMN numero TO codigo;\n",
    setupSql: `CREATE TABLE cartoes (
  id INTEGER PRIMARY KEY,
  numero TEXT,
  bandeira TEXT
);

INSERT INTO cartoes (id, numero, bandeira) VALUES
  (1, '4111111111111111', 'Visa'),
  (2, '5500000000000004', 'Mastercard');`,
    tables: [
      table("cartoes", [
        col("id", "INTEGER", { pk: true }),
        col("numero", "TEXT"),
        col("bandeira", "TEXT"),
      ]),
    ],
    challenge: {
      kind: "schema",
      instruction:
        "Renomeie a coluna `numero` da tabela `cartoes` para `codigo`.",
      expectedTables: [
        {
          name: "cartoes",
          columns: [{ name: "codigo", type: "TEXT" }],
          forbidColumns: ["numero"],
        },
      ],
    },
    hints: [
      "Use ALTER TABLE cartoes com RENAME COLUMN.",
      "A ordem é: nome atual primeiro, nome novo depois do TO.",
      "ALTER TABLE cartoes RENAME COLUMN numero TO codigo;",
    ],
  },

  // =========================================================================
  // CAPÍTULO 3 — Restrições e integridade dos dados
  // =========================================================================
  {
    id: "3-1",
    chapter: 3,
    lesson: 1,
    title: "Campos obrigatórios com NOT NULL",
    summary:
      "Impeça que colunas importantes fiquem sem valor usando NOT NULL.",
    difficulty: "iniciante",
    xpReward: 75,
    explanation:
      "Em SQL, `NULL` significa ausência de valor — diferente de zero ou de texto vazio. Em um banco de pagamentos, alguns dados simplesmente não podem faltar.\n\nA restrição `NOT NULL`, aplicada na definição da coluna, garante que ela nunca aceite `NULL`:\n\n`nome TEXT NOT NULL`\n\nSe alguém tentar inserir um cliente sem nome, o banco rejeita a operação. No NexoPay, todo cliente precisa ter um nome para ser cadastrado.",
    exampleSql:
      "CREATE TABLE clientes (\n  id INTEGER,\n  nome TEXT NOT NULL\n);\n",
    setupSql: "-- NexoPay: base vazia. Crie a tabela solicitada.\n",
    tables: [],
    challenge: {
      kind: "schema",
      instruction:
        "Crie a tabela `clientes` com as colunas `id` (INTEGER) e `nome` (TEXT). A coluna `nome` NÃO pode ficar sem valor.",
      expectedTables: [
        {
          name: "clientes",
          columns: [
            { name: "id", type: "INTEGER" },
            { name: "nome", type: "TEXT", notNull: true },
          ],
        },
      ],
    },
    hints: [
      "Adicione a palavra-chave NOT NULL ao final da definição da coluna nome.",
      "CREATE TABLE clientes (id INTEGER, nome TEXT NOT NULL);",
    ],
  },
  {
    id: "3-2",
    chapter: 3,
    lesson: 2,
    title: "Valores únicos com UNIQUE",
    summary:
      "Evite duplicidades garantindo que cada valor de uma coluna seja único.",
    difficulty: "iniciante",
    xpReward: 75,
    explanation:
      "Algumas colunas não podem repetir valores. No NexoPay, cada estabelecimento parceiro recebe um código de integração exclusivo — se dois parceiros tivessem o mesmo código, as transações se misturariam.\n\nA restrição `UNIQUE` resolve isso:\n\n`codigo TEXT UNIQUE`\n\nO banco passa a rejeitar a inserção de um segundo registro com o mesmo valor na coluna. Observe que uma coluna `UNIQUE` ainda pode ser `NULL` (a menos que também seja `NOT NULL`) — aqui tratamos apenas da duplicidade.",
    exampleSql:
      "CREATE TABLE parceiros (\n  id INTEGER,\n  codigo TEXT UNIQUE\n);\n",
    setupSql: "-- NexoPay: base vazia. Crie a tabela solicitada.\n",
    tables: [],
    challenge: {
      kind: "schema",
      instruction:
        "Crie a tabela `parceiros` com as colunas `id` (INTEGER) e `codigo` (TEXT). O valor de `codigo` deve ser único entre os registros.",
      expectedTables: [
        {
          name: "parceiros",
          columns: [
            { name: "id", type: "INTEGER" },
            { name: "codigo", type: "TEXT", unique: true },
          ],
        },
      ],
    },
    hints: [
      "Acrescente a palavra-chave UNIQUE à definição da coluna codigo.",
      "CREATE TABLE parceiros (id INTEGER, codigo TEXT UNIQUE);",
    ],
  },
  {
    id: "3-3",
    chapter: 3,
    lesson: 3,
    title: "Identificando registros com PRIMARY KEY",
    summary:
      "Defina a coluna que identifica cada linha de forma única e obrigatória.",
    difficulty: "intermediario",
    xpReward: 75,
    explanation:
      "Toda tabela séria precisa de uma forma confiável de identificar cada registro. É aí que entra a `PRIMARY KEY` (chave primária):\n\n- o valor não pode se repetir (é único);\n- o valor não pode ser `NULL`;\n- é por ela que outras tabelas vão referenciar esta (veja FOREIGN KEY na próxima lição).\n\nAplicamos na definição da coluna:\n\n`id INTEGER PRIMARY KEY`\n\nNo NexoPay, cada cobrança gerada precisa de um identificador próprio para ser localizada e auditada.",
    exampleSql:
      "CREATE TABLE cobrancas (\n  id INTEGER PRIMARY KEY,\n  descricao TEXT,\n  valor REAL\n);\n",
    setupSql: "-- NexoPay: base vazia. Crie a tabela solicitada.\n",
    tables: [],
    challenge: {
      kind: "schema",
      instruction:
        "Crie a tabela `cobrancas` com as colunas `id` (INTEGER e chave primária), `descricao` (TEXT) e `valor` (REAL).",
      expectedTables: [
        {
          name: "cobrancas",
          columns: [
            { name: "id", type: "INTEGER", primaryKey: true },
            { name: "descricao", type: "TEXT" },
            { name: "valor", type: "REAL" },
          ],
        },
      ],
    },
    hints: [
      "Marque a coluna id com PRIMARY KEY.",
      "CREATE TABLE cobrancas (id INTEGER PRIMARY KEY, descricao TEXT, valor REAL);",
    ],
  },
  {
    id: "3-4",
    chapter: 3,
    lesson: 4,
    title: "Relacionando tabelas com FOREIGN KEY",
    summary:
      "Garanta que toda transferência aponte para um cliente que existe.",
    difficulty: "intermediario",
    xpReward: 75,
    explanation:
      "Uma chave estrangeira (`FOREIGN KEY`) liga uma tabela a outra. Ela garante que o valor armazenado em uma coluna SEMPRE exista na tabela referenciada.\n\nNo NexoPay, toda transferência pertence a um cliente. Sem uma FK, nada impediria criar uma transferência para um cliente inexistente — e o dinheiro iria para lugar nenhum.\n\nA forma mais direta de declarar é na própria coluna:\n\n`cliente_id INTEGER REFERENCES clientes(id)`\n\nOu, como restrição de tabela:\n\n`FOREIGN KEY (cliente_id) REFERENCES clientes(id)`",
    exampleSql:
      "CREATE TABLE transferencias (\n  id INTEGER PRIMARY KEY,\n  cliente_id INTEGER REFERENCES clientes(id),\n  valor REAL NOT NULL\n);\n",
    setupSql: `CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL
);

INSERT INTO clientes (id, nome) VALUES
  (1, 'Ana Souza'),
  (2, 'Bruno Lima');`,
    tables: [
      table("clientes", [
        col("id", "INTEGER", { pk: true, notNull: true }),
        col("nome", "TEXT", { notNull: true }),
      ]),
    ],
    challenge: {
      kind: "schema",
      instruction:
        "Crie a tabela `transferencias` com: `id` INTEGER como chave primária, `cliente_id` INTEGER referenciando `clientes(id)` e `valor` REAL.",
      expectedTables: [
        {
          name: "transferencias",
          columns: [
            { name: "id", type: "INTEGER", primaryKey: true },
            { name: "cliente_id", type: "INTEGER" },
            { name: "valor", type: "REAL" },
          ],
          foreignKeys: [
            {
              columns: ["cliente_id"],
              table: "clientes",
              referencedColumns: ["id"],
            },
          ],
        },
      ],
    },
    hints: [
      "A FK aponta para a tabela clientes e sua chave primária id.",
      "Use REFERENCES clientes(id) logo após a coluna cliente_id.",
      "CREATE TABLE transferencias (id INTEGER PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(id), valor REAL NOT NULL);",
    ],
  },
];
