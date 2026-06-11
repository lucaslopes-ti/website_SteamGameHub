import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const rawQuestions = [
  {
    "id": "SAEP55355",
    "pergunta": "O programador está desenvolvendo um aplicativo de mensagens e deseja garantir uma boa experiência do usuário. Para isso, ele precisa escolher cores de fundo para o aplicativo que sejam agradáveis e facilitem a leitura das mensagens. Qual o conceito refere essa ação?",
    "alternativas": {
      "A": "Separação de conteúdo.",
      "B": "Animações complexas.",
      "C": "Contraste de cores.",
      "D": "Hierarquia visual.",
      "E": "Grade de layout."
    },
    "resposta_correta": "C"
  },
  {
    "id": "SAEP55758",
    "pergunta": "Um programador está criando o conteúdo para um site e deseja enfatizar uma palavra-chave que é importante para o tema da página. Ele quer que a palavra apareça em negrito de forma destacada no texto. Qual tag o programador deve usar para atingir esse objetivo?",
    "alternativas": {
      "A": "<strong>",
      "B": "<mark>",
      "C": "<em>",
      "D": "<i>",
      "E": "<p>"
    },
    "resposta_correta": "A"
  },
  {
    "id": "SAEP55561",
    "pergunta": "Uma equipe de desenvolvimento de software está trabalhando em um projeto para criar um aplicativo de gerenciamento de tarefas. Eles estão se preparando para iniciar a fase de teste do software. Qual a finalidade dos métodos, normas e procedimentos de teste nesse cenário?",
    "alternativas": {
      "A": "Realizar a verificação dos testes de integração do banco de dados com o software.",
      "B": "Garantir que todas as tarefas do aplicativo sejam executadas simultaneamente.",
      "C": "Verificar se o aplicativo funciona conforme o esperado e atende aos requisitos.",
      "D": "Determinar os requisitos do projeto antes da fase de desenvolvimento.",
      "E": "Definir as cores e o design da interface do aplicativo."
    },
    "resposta_correta": "C"
  },
  {
    "id": "SAEP55754",
    "pergunta": "Um desenvolvedor está precisando criar a documentação do seu projeto, mas o seu sistema operacional não tem o software instalado. Qual software instalar para solucionar essa situação?",
    "alternativas": {
      "A": "Softwares de escritório",
      "B": "Windows Media Player",
      "C": "Linux Ubuntu",
      "D": "Chrome OS",
      "E": "FreeBSD"
    },
    "resposta_correta": "A"
  },
  {
    "id": "SAEP56236",
    "pergunta": "Um docente está trabalhando em uma planilha no Microsoft Excel, onde ele registra as notas de seus alunos. As notas estão localizadas na coluna B da planilha, das células B2 até B11. O docente precisa calcular a soma das notas desses 10 alunos. Qual fórmula deve ser aplicada pelo docente?",
    "alternativas": {
      "A": "=CONT.SE(B2:B11, \">5\")",
      "B": "=MULTIPLICAR(B2:B11)",
      "C": "=MÉDIA(B2:B11)",
      "D": "=SOMA(B2:B11)",
      "E": "=MIN(B2:B11)"
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP56187",
    "pergunta": "A utilização de listas é essencial em sites utilizando tags HTML5, principalmente quando se trata de listar informações sobre algum assunto importante do site. A tag HTML que atinge esse objetivo é?",
    "alternativas": {
      "A": "<p>",
      "B": "<li>",
      "C": "<tr>",
      "D": "<br>",
      "E": "<hr>"
    },
    "resposta_correta": "B"
  },
  {
    "id": "SAEP43538",
    "pergunta": "O Microsoft Office 2013 apresenta um aplicativo para realizar cálculos simples e complexos, montar relatórios, gráficos e funções avançadas para manipulação de dados usando o VBA. Este aplicativo é o Microsoft Excel. Ao selecionar o intervalo de células C1:C3 e pressionar o atalho Ctrl + D, as células do intervalo supracitado receberão respectivamente os valores:",
    "alternativas": {
      "A": "14, 56 e 49",
      "B": "28, 28 e 28",
      "C": "28, 49 e 56",
      "D": "49, 56 e 14",
      "E": "56, 49 e 28"
    },
    "resposta_correta": "C"
  },
  {
    "id": "SAEP43499",
    "pergunta": "O Excel é um dos aplicativos que compõem o Pacote Office 2013. Após o usuário preencher as células do intervalo A1:C5 com os valores contidos na imagem anexa, qual a forma mais rápida de saber o resultado da soma destes valores?",
    "alternativas": {
      "A": "Utilizando a fórmula =SOMA(A1:C5)",
      "B": "Selecionando o intervalo de células e observando a barra de status.",
      "C": "Utilizando a fórmula =SOMA(A1:C1)",
      "D": "Utilizando a fórmula =SOMA(A1 até C5)",
      "E": "= A1 + A2 + A3 + B1 + B2 + B3 + C1 + C2 + C3"
    },
    "resposta_correta": "B"
  },
  {
    "id": "SAEP43550",
    "pergunta": "Por meio de pesquisas públicas, desenvolvimento pessoal, testes a/b, entrevistas, grupos focais, benchmarking e muitas outras técnicas, o design UX pode observar o comportamento do usuário para sugerir soluções otimizadas para melhorar a experiência geral do usuário com o sistema. Geralmente, ao trabalharmos em um processo do UX Design passamos por 4 etapas principais. Depois de todos os insights obtidos, qual etapa deve ser transformada em uma aplicação prática do objetivo do projeto, protótipo da solução?",
    "alternativas": {
      "A": "Desenvolvimento da solução.",
      "B": "Definição do problema.",
      "C": "Jornada de processo.",
      "D": "Pesquisas.",
      "E": "Validação."
    },
    "resposta_correta": "A"
  },
  {
    "id": "SAEP43503",
    "pergunta": "Inúmeros softwares e aplicações surgem a cada dia, seu desenvolvimento requer um bom conhecimento em linguagem de programação e lógica de programação que pode ser definida como uma organização coesa de uma sequência de instruções voltadas para a resolução de problemas, pois é ela que norteará qualquer estudante a se tornar programador. A imagem apresentada mostra o comando Switch Case executando um laço de repetição com base no valor da variável C, o valor que será apresentado é:",
    "alternativas": {
      "A": "Advogado",
      "B": "Analista",
      "C": "Estudante",
      "D": "Médico",
      "E": "Professor"
    },
    "resposta_correta": "C"
  },
  {
    "id": "SAEP55725",
    "pergunta": "Um programador está desenvolvendo um programa para uma escola que armazene os nomes dos alunos de uma turma para facilitar a busca e manipulação dos dados. A escola solicitou que o programa seja entregue o mais rápido possível e que os resultados sejam extraídos de forma ágil e maior segurança. Qual é a estrutura de dados que deve ser aplicada para esta situação?",
    "alternativas": {
      "A": "Matriz.",
      "B": "Pilha.",
      "C": "Vetor.",
      "D": "Lista.",
      "E": "Fila."
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP43583",
    "pergunta": "A Metodologia ágil é uma forma de conduzir projetos que busca dar maior rapidez aos processos e a conclusão de tarefas. O Scrum é uma das metodologias ágeis comumente usadas em projetos e uma de suas características é uma pessoa responsável pela criação e organização do produto no contexto do projeto, também conhecido como líder ou gerente do projeto. O nome atribuído a essa pessoa é:",
    "alternativas": {
      "A": "Scrum Master",
      "B": "Product Owner",
      "C": "Stakeholder",
      "D": "Gerente de Projetos",
      "E": "Equipe de Desenvolvimento"
    },
    "resposta_correta": "B"
  },
  {
    "id": "SAEP55315",
    "pergunta": "Um estudante do curso de informática para internet do Senai, inserido em um projeto, necessita criar uma aplicação web. Ele utilizará as linguagens de programação Web, que são utilizadas por programadores para a codificação Front-End e Back-End de sites, sistemas e aplicações Web em geral, para realizar a entrega do projeto. Em relação às principais linguagens de programação Web, qual a linguagem e sua respectiva explicação foi descrita corretamente e que pode ser utilizada pelo estudante acima?",
    "alternativas": {
      "A": "HTML, pois é uma linguagem de marcação declarativa utilizada no desenvolvimento Back-End de sites dinâmicos.",
      "B": "PHP, que é uma linguagem interpretada de código aberto utilizada no desenvolvimento Back-End. Além disso, permite o desenvolvimento de sites estáticos.",
      "C": "JavaScript, uma vez que essa linguagem de script não precisa ser traduzida em código de máquina antes de ser executada, ou seja, executa de forma direta no código-fonte.",
      "D": "CSS, uma linguagem de estilo declarativa que determina como o código HTML deve ser exibido na tela. No entanto, não suporta que o estilo de uma página seja replicado a outras páginas.",
      "E": "Python, pois é uma linguagem de propósito geral eficiente, utilizada no desenvolvimento Web Back-End. No entanto, é uma linguagem limitada por não permitir integração com outras linguagens de programação tais como: C, C# e Java."
    },
    "resposta_correta": "C"
  },
  {
    "id": "SAEP43579",
    "pergunta": "No processo de desenvolvimento de um sistema, assim como numa linha de montagem, são várias as peças e etapas para seguir, sendo assim é imprescindível gerenciar todas essas etapas por meio do versionamento do desenvolvimento do sistema, possibilitando vários profissionais trabalhando no mesmo projeto ao mesmo tempo, além assegurar o projeto na nuvem, diminuindo o risco de uma possível perda do mesmo. Utilizando comando de versionamento no git bash via terminal, após adicionar os arquivos modificados com o comando git add ., agora o próximo comando para confirmar a mudança do versionamento, será?",
    "alternativas": {
      "A": "git status",
      "B": "git pull origin main",
      "C": "git push -u origin main",
      "D": "git commit -m \"first commit\"",
      "E": "git comit -u"
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP43562",
    "pergunta": "O desenvolvimento de APIs possibilita grandes transações de dados no espaço web. Os protocolos de troca de informações possibilitam mais segurança nessas transações, consequentemente aumentou o uso desse modo de conexão entre softwares. Na imagem há um trecho de código, desenvolvido para BACK-END, utilizando o express para configuração do servidor, requerendo um parâmetro id via GET. Note que há uma parte do código em destaque e para uma execução positiva o código necessário é:",
    "alternativas": {
      "A": "app.get('/2',(req,res)=>{",
      "B": "app.post(' / ',(req,res)=>{",
      "C": "app.get('/id',(req,res)=>{",
      "D": "app.get('/:id',(req,res)=>{",
      "E": "app.get('usuario/:id',(req,res)=>{"
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP54021",
    "pergunta": "Um programador está liderando o desenvolvimento de um novo sistema para uma empresa e precisa do plano de implantação do sistema. Qual a finalidade deste prazo?",
    "alternativas": {
      "A": "Analisar os concorrentes e identificar oportunidades de mercado.",
      "B": "Definir os requisitos técnicos para o sistema a ser desenvolvido.",
      "C": "Selecionar os fornecedores que irão fornecer o hardware necessário.",
      "D": "Monitorar o desempenho dos funcionários durante o processo de implantação.",
      "E": "Estabelecer as etapas e prazos para a implementação bem-sucedida do sistema."
    },
    "resposta_correta": "E"
  },
  {
    "id": "SAEP43502",
    "pergunta": "O desenvolvimento de APIs é imprescindível seguir padrões para um bom entendimento do projeto por outros desenvolvedores, além de adequar-se com a lógica de programação. Na imagem temos uma função em javascript desenvolvida em NODE JS para back-end que consiste em devolver uma respostas a quem faça a requisição, por exemplo: uma aplicação front-end ou outra função em javascript. Levando em consideração a resposta dessa função listMentions no contexto da imagem, a resposta positiva dessa situação retornará?",
    "alternativas": {
      "A": "A variável repository",
      "B": "Um status 404( Not Found)",
      "C": "Data do momento da resposta",
      "D": "Os valores do objeto data;",
      "E": "Os dados em formato JSON com a uma chave message;"
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP56020",
    "pergunta": "Um gerente de projeto em uma empresa de desenvolvimento de software está encarregado de um projeto crítico para um cliente, recebeu uma lista detalhada de requisitos do cliente e precisa garantir que o software desenvolvido atenda a esses requisitos de maneira rigorosa. Qual procedimento de teste mais eficaz para identificar os requisitos do cliente nesse projeto?",
    "alternativas": {
      "A": "Realizar testes de compatibilidade para verificar se o software funciona em diversos navegadores e dispositivos.",
      "B": "Realizar testes de regressão para garantir que as atualizações não afetem as funcionalidades existentes.",
      "C": "Realizar testes de aceitação com os usuários finais para validar a funcionalidade do software.",
      "D": "Realizar testes de estresse para verificar o desempenho do sistema sob carga máxima.",
      "E": "Realizar testes de unidade para verificar a lógica interna do código fonte."
    },
    "resposta_correta": "C"
  },
  {
    "id": "SAEP53945",
    "pergunta": "Uma livraria deseja implementar um sistema de controle de estoque para os livros que chegam. Eles querem garantir que os livros sejam vendidos de acordo com a ordem de chegada, ou seja, o primeiro livro a ser recebido é o primeiro a ser vendido. Para isso, estão avaliando diferentes estruturas de dados para implementar essa funcionalidade. A estrutura de dados requisitada é:",
    "alternativas": {
      "A": "A estrutura de dados com a funcionalidade de pilha.",
      "B": "A estrutura de dados com a funcionalidade de fila.",
      "C": "A estrutura de dados com a funcionalidade matriz.",
      "D": "A estrutura de dados com a funcionalidade vetor.",
      "E": "A estrutura de dados com a funcionalidade lista."
    },
    "resposta_correta": "B"
  }
];

const letters = ["A", "B", "C", "D", "E"];

async function seed() {
  console.log("🔥 Semeando banco de dados de questões do SAEP...");
  let count = 0;

  for (const q of rawQuestions) {
    const options = [
      q.alternativas.A,
      q.alternativas.B,
      q.alternativas.C,
      q.alternativas.D,
      q.alternativas.E,
    ].filter(Boolean); // remove undefined just in case

    const correctIndex = letters.indexOf(q.resposta_correta);

    const docData = {
      question: q.pergunta,
      options: options,
      correctAnswer: correctIndex,
      subject: "Conhecimentos Específicos",
      difficulty: "medium",
      createdAt: Timestamp.now(),
    };

    try {
      const docRef = doc(db, "saep_questions", q.id);
      await setDoc(docRef, docData);
      console.log(`✅ Adicionada questão ${q.id}`);
      count++;
    } catch (e: any) {
      console.error(`❌ Erro ao adicionar ${q.id}:`, e.message);
    }
  }

  console.log(`\n🎉 Concluído! Inseridas ${count} questões no banco.`);
  process.exit(0);
}

seed().catch(console.error);
