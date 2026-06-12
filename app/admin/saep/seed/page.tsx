"use client";

import { useState } from "react";
import { getFirebaseDb } from "@/lib/firebase/config";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";

const initialJson = `[
  {
    "id": "SAEP55755",
    "pergunta": "Um programador está desenvolvendo um site para uma conferência de tecnologia com várias sessões e palestras. Ele deseja aplicar um estilo de fundo verde e texto branco a todas as caixas de sessão, visando destacá-las dos demais elementos da página. Para isso, é essencial utilizar seletores para aplicar o estilo desejado. Qual seletor o programador deve usar nas tags HTML?",
    "alternativas": {
      "A": "class=\\"caixa-sessao\\"",
      "B": "href=\\"caixa-sessao\\"",
      "C": "type=\\"caixa-sessao\\"",
      "D": "style=\\"caixa-sessao\\"",
      "E": "id=\\"caixa-sessao\\""
    },
    "resposta_correta": "A"
  },
  {
    "id": "SAEP55354",
    "pergunta": "Um desenvolvedor está trabalhando em um projeto no GitHub e deseja copiar o repositório remoto para o repositório local. Qual o comando deve ser usado para realizar essa ação?",
    "alternativas": {
      "A": "git pull",
      "B": "git push",
      "C": "git clone",
      "D": "git commit",
      "E": "git merge"
    },
    "resposta_correta": "C"
  },
  {
    "id": "SAEP55963",
    "pergunta": "Um programador está projetando a interface de um aplicativo de gerenciamento de tarefas para dispositivos móveis. Uma das características-chave do aplicativo é a funcionalidade de os usuários arrastarem e soltarem tarefas para reorganizá-las em ordem de prioridade. O conceito de design de interação que irá garantir essa experiência do usuário UX é:",
    "alternativas": {
      "A": "Aumento do tamanho das fontes de texto.",
      "B": "Uso de animações complexas.",
      "C": "Utilização de cores brilhantes.",
      "D": "Inclusão de sons de cliques.",
      "E": "Feedback visual amigável."
    },
    "resposta_correta": "E"
  },
  {
    "id": "SAEP53884",
    "pergunta": "Uma equipe de desenvolvimento está enfrentando dificuldades em garantir a entrega de incrementos de softwares funcionais até o final de cada Sprint. Qual prática do Scrum pode ajudar a resolver essa situação?",
    "alternativas": {
      "A": "Backlog Refinement (Refinamento do Backlog).",
      "B": "Sprint Retrospective (Retrospectiva do Sprint).",
      "C": "Planning Poker (Pôquer de Planejamento).",
      "D": "Sprint Planning (Planejamento do Sprint).",
      "E": "Sprint Review (Revisão do Sprint)."
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP55613",
    "pergunta": "Uma equipe de desenvolvimento web está trabalhando em um novo site para uma empresa. Para garantir que o site seja bem estruturado e seguindo as práticas recomendadas de marcação HTML. O projeto está na fase de criação da estrutura básica da página e a equipe precisa decidir como utilizar a tag footer. Qual a maneira correta que a equipe de desenvolvimento web deve utilizar para aplicar a tag?",
    "alternativas": {
      "A": "Inserir a tag footer dentro da tag header e estilizá-la para que apareça no final da página.",
      "B": "Adicionar a tag footer como um elemento filho da tag section que contém o conteúdo principal da página.",
      "C": "Utilizar a tag footer como um elemento filho da tag main para indicar o rodapé da página.",
      "D": "Colocar a tag footer diretamente dentro da tag body e definir o conteúdo do rodapé dentro dela.",
      "E": "Incluir a tag footer dentro da tag nav e atribuir uma classe específica para identificar como o rodapé."
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP55523",
    "pergunta": "Um desenvolvedor está trabalhando em um projeto que requer a integração de uma API de previsão do tempo para exibir informações climáticas em tempo real em sua aplicação. Qual procedimento que o desenvolvedor precisa aplicar?",
    "alternativas": {
      "A": "Implementar autenticação para limitar o acesso à API apenas a um usuário.",
      "B": "Fazer uma solicitação de acesso à API e obter uma chave de autenticação.",
      "C": "Utilizar a API diretamente sem a necessidade de qualquer integração.",
      "D": "Criar um banco de dados local para armazenar os dados da API.",
      "E": "Realizar testes de unidade na API antes de implementá-la."
    },
    "resposta_correta": "B"
  },
  {
    "id": "SAEP53713",
    "pergunta": "Um técnico em informática ao configurar políticas de segurança no servidor, sabe que é importante considerar a proteção contra os ataques de injeção de código, como o SQL Injection. De acordo com o contexto, esse tipo de ameaça é anulado ao",
    "alternativas": {
      "A": "utilizar consultas parametrizadas ou prepared statements para manipular dados no banco de dados, garantindo a separação adequada de comandos SQL e dados fornecidos pelos usuários.",
      "B": "criptografar todas as comunicações entre o servidor e o cliente usando protocolos seguros, como HTTPS, para impedir a interceptação e manipulação de dados durante a transmissão.",
      "C": "realizar testes de segurança regulares, incluindo avaliação de vulnerabilidades e testes de penetração, para identificar possíveis falhas de segurança e corrigi-las antes que sejam exploradas.",
      "D": "configurar políticas de acesso baseadas em funções e permissões, garantindo que apenas usuários autorizados tenham privilégios suficientes para executar comandos no banco de dados.",
      "E": "implementar um firewall de aplicação web para filtrar e bloquear solicitações maliciosas que contenham potenciais ataques de injeção de código."
    },
    "resposta_correta": "A"
  },
  {
    "id": "SAEP59575",
    "pergunta": "Em um sistema de gerenciamento de biblioteca online, um desenvolvedor precisa implementar uma funcionalidade que permita aos usuários registrados avaliar os livros que já leram. Para isso, o desenvolvedor decidiu criar uma tabela chamada Avaliações no banco de dados, que terá os seguintes campos: ID_Usuário, ID_Livro, Avaliacao e Comentário. Qual relacionamento deve ser aplicada para vincular as tabelas de usuários e avaliações?",
    "alternativas": {
      "A": "Relacionamento Um-para-Um",
      "B": "Relacionamento Muitos-para-Um",
      "C": "Relacionamento Um-para-Muitos",
      "D": "Relacionamento de Autoassociação",
      "E": "Relacionamento Muitos-para-Muitos"
    },
    "resposta_correta": "E"
  },
  {
    "id": "SAEP69591",
    "pergunta": "Um sistema de carrinho de compras permite adicionar produtos, calcular o valor total e aplicar cupons de desconto. Considerando a funcionalidade de aplicação de cupons de desconto, indique o teste que apresenta menor relevância para a sua verificação.",
    "alternativas": {
      "A": "Adicionar um produto ao carrinho e aplicar um cupom de desconto válido.",
      "B": "Adicionar vários produtos ao carrinho e aplicar um cupom de desconto válido.",
      "C": "Tentar aplicar um cupom de desconto expirado.",
      "D": "Tentar aplicar um cupom de desconto com valor superior ao valor total da compra.",
      "E": "Adicionar um produto ao carrinho e tentar aplicar um cupom de desconto inválido."
    },
    "resposta_correta": "B"
  },
  {
    "id": "SAEP53972",
    "pergunta": "Um analista de dados está modelando um banco de dados que conterá dados sobre os alunos e professores de uma escola. A associação entre dois registros será feita através da relação entre um registro pai e vários registros-filhos com cardinalidade 1:N. Como a navegação entre os registros será executada da raiz pai para as folhas os filhos, o modelo de banco de dados deverá ser o",
    "alternativas": {
      "A": "em rede",
      "B": "otimizado",
      "C": "relacional",
      "D": "hierárquico",
      "E": "orientado a objetos"
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP55521",
    "pergunta": "Um programador está trabalhando em um projeto de código aberto com uma equipe distribuída. Ele fez algumas alterações em seu próprio fork do repositório principal e deseja contribuir para o projeto, enviando um pull request. Qual procedimento correto para aplicar essa funcionalidade?",
    "alternativas": {
      "A": "Clonar o repositório principal, criar um novo branch localmente, copiar e colar as alterações manualmente e, em seguida, fazer push para o repositório principal.",
      "B": "Fazer commit das alterações no fork, criar um novo branch, abrir um pull request no repositório principal e aguardar a revisão e aprovação.",
      "C": "Enviar um e-mail ao mantenedor do repositório principal com as alterações e solicitar que elas sejam incorporadas manualmente.",
      "D": "Excluir o fork do repositório principal, criar um novo repositório e enviar as alterações para esse novo repositório.",
      "E": "Substituir diretamente os arquivos no repositório principal com as alterações feitas no fork."
    },
    "resposta_correta": "B"
  },
  {
    "id": "SAEP59425",
    "pergunta": "Um analista de dados está modelando um banco de dados que conterá dados sobre os alunos e professores de uma escola. A associação entre dois registros será feita através da relação entre um registro pai e vários registros-filhos com cardinalidade 1:N. Como a navegação entre os registros será executada da raiz pai para as folhas os filhos, o modelo de banco de dados deverá ser o",
    "alternativas": {
      "A": "em rede",
      "B": "otimizado",
      "C": "relacional",
      "D": "hierárquico",
      "E": "orientado a objetos"
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP52794",
    "pergunta": "Um desenvolvedor precisou criar uma estrutura condicional em um sistema de gerenciamento de compras online, a fim de comparar condições inseridas pelos usuários através de um input no formulário de cadastro com intuito de verificar se as variáveis são do mesmo tipo e que possuem o mesmo valor estritamente iguais. De acordo com o contexto, indique o operador a ser utilizado.",
    "alternativas": {
      "A": "=",
      "B": "==",
      "C": "!=",
      "D": "!==",
      "E": "==="
    },
    "resposta_correta": "E"
  },
  {
    "id": "SAEP59574",
    "pergunta": "Um analista de dados está modelando um banco de dados que conterá dados sobre os alunos e professores de uma escola. A associação entre dois registros será feita através da relação entre um registro pai e vários registros-filhos com cardinalidade 1:N. Como a navegação entre os registros será executada da raiz pai para as folhas os filhos, o modelo de banco de dados deverá ser o",
    "alternativas": {
      "A": "em rede",
      "B": "otimizado",
      "C": "relacional",
      "D": "hierárquico",
      "E": "orientado a objetos"
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP69588",
    "pergunta": "Um sistema de e-commerce utiliza um gateway de pagamento externo para processar transações. O sistema deve notificar o usuário sobre o resultado da transação sucesso, falha, pendente. Com base nos cenários de falha do gateway de pagamento, identifique qual dos testes apresenta menor eficácia na garantia da robustez do sistema.",
    "alternativas": {
      "A": "Simular uma conexão com o gateway de pagamento indisponível.",
      "B": "Simular uma resposta do gateway com um código de erro indicando transação recusada.",
      "C": "Simular uma resposta do gateway com um código de erro indicando transação pendente.",
      "D": "Simular uma resposta do gateway com um código de erro desconhecido.",
      "E": "Simular uma resposta do gateway com um formato de dados inválido."
    },
    "resposta_correta": "E"
  },
  {
    "id": "SAEP55349",
    "pergunta": "Um desenvolvedor está liderando a implantação de um sistema de gestão de projetos. Para garantir que o processo seja bem documentado, ele decide usar um guia que abrange desde a preparação, prazo das etapas e testes finais do sistema. Qual guia aplicar para obter o resultado esperado?",
    "alternativas": {
      "A": "Guia baseado em objetivos.",
      "B": "Guia por prioridade.",
      "C": "Guia colaborativo.",
      "D": "Guia cronológico.",
      "E": "Guia iterativo."
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP52696",
    "pergunta": "Um programador foi contratado para criar um sistema em JavaScript, que verifica se o usuário tem idade para tirar a carteira de motorista. Para essa validação, precisou desenvolver uma função que recebe a idade da pessoa e em seguida verifica se a idade é permitida. De acordo com o contexto, qual dos operadores é utilizado?",
    "alternativas": {
      "A": "Operador lógico.",
      "B": "Operador ternário.",
      "C": "Operador aritmético.",
      "D": "Operador comparação.",
      "E": "Operador de atribuição."
    },
    "resposta_correta": "D"
  },
  {
    "id": "SAEP70002",
    "pergunta": "Uma empresa de desenvolvimento de software está trabalhando em um novo sistema de comércio eletrônico. Para garantir que todas as funcionalidades e requisitos do sistema sejam implementados corretamente, a equipe de testes é encarregada de planejar e executar testes abrangentes. Esses testes devem garantir que tanto os aspectos funcionais quanto os não funcionais do sistema sejam validados. A equipe de testes deve seguir um processo sistemático que inclua análise de requisitos, planejamento de testes, criação de casos de teste, execução dos testes, e monitoração e controle dos resultados. Qual procedimento a equipe de testes deve adotar para garantir a aderência aos requisitos do sistema?",
    "alternativas": {
      "A": "Focar na documentação fornecida pelo cliente e executar testes manuais baseados nela.",
      "B": "Utilizar testes automatizados em vez de testes manuais para economizar tempo e recursos.",
      "C": "Realizar testes de integração para verificar a interação entre os diferentes módulos do sistema.",
      "D": "Focar em testes unitários, garantindo que cada função individual funcione conforme o esperado.",
      "E": "Desenvolver um plano de testes, analisar os requisitos, criar casos de teste, executar os testes e monitorar e avaliar os resultados."
    },
    "resposta_correta": "E"
  },
  {
    "id": "SAEP58830",
    "pergunta": "Um desenvolvedor está realizando uma modelagem relacional numa base de dados de uma indústria e, para isso, é necessário estruturar os dados para eliminar distorções e anomalias, que foram encontradas nas tabelas, pois não estão na segunda forma normal. Considerando o requisito descrito anteriormente e, conforme as regras da normalização, uma tabela estará na segunda forma normal, se ela está na primeira forma normal e",
    "alternativas": {
      "A": "possui linhas da tabela que são homogêneas, sem chaves compostas, além de todos os seus atributos serem atômicos.",
      "B": "possui linhas que não contêm itens repetitivos, sem atributos com valores nulos nem tão pouco multidimensionais.",
      "C": "em nenhuma das colunas que não fazem parte da chave primária, não há dependência parcial dessa chave.",
      "D": "que contém apenas chaves externas e permite a conexão de outras tabelas por meio de junções múltiplas.",
      "E": "que as colunas que não estão relacionadas à chave primária ficam determinadas transitivamente por esta."
    },
    "resposta_correta": "C"
  },
  {
    "id": "SAEP53621",
    "pergunta": "Um desenvolvedor de software está trabalhando em um projeto que envolve a criação de um aplicativo web. O aplicativo possui uma funcionalidade em que o usuário pode fazer login e, após o login bem-sucedido, é redirecionado para a página inicial. Para garantir a aderência aos requisitos da funcionalidade de login e qualidade do aplicativo, você precisa realizar testes funcionais de caixa preta que retornem os valores do bloco código abaixo.",
    "alternativas": {
      "A": "Entrada 1: login(\\"admin\\", \\"12345\\"). Entrada 2: login(\\"admin\\", \\"12345\\").",
      "B": "Entrada 1: login(\\"admin\\", \\"12345\\"). Entrada 2: login(\\"admin\\", \\"admin\\").",
      "C": "Entrada 1: login(\\"user\\", \\"password\\"). Entrada 2: login(\\"admin\\", \\"12345\\").",
      "D": "Entrada 1: login(\\"admin\\", \\"admin\\"). Entrada 2: login(\\"user\\", \\"password\\").",
      "E": "Entrada 1: login(\\"admin\\", \\"admin\\"). Entrada 2: login(\\"admin\\", \\"12345\\")."
    },
    "resposta_correta": "B"
  },
  {
    "id": "SAEP59424",
    "pergunta": "Um desenvolvedor está realizando uma modelagem relacional numa base de dados de uma indústria e, para isso, é necessário estruturar os dados para eliminar distorções e anomalias, que foram encontradas nas tabelas, pois não estão na segunda forma normal. Considerando o requisito descrito anteriormente e, conforme as regras da normalização, uma tabela estará na segunda forma normal, se ela está na primeira forma normal e",
    "alternativas": {
      "A": "possui linhas da tabela que são homogêneas, sem chaves compostas, além de todos os seus atributos serem atômicos.",
      "B": "possui linhas que não contêm itens repetitivos, sem atributos com valores nulos nem tão pouco multidimensionais.",
      "C": "em nenhuma das colunas que não fazem parte da chave primária, não há dependência parcial dessa chave.",
      "D": "que contém apenas chaves externas e permite a conexão de outras tabelas por meio de junções múltiplas.",
      "E": "que as colunas que não estão relacionadas à chave primária ficam determinadas transitivamente por esta."
    },
    "resposta_correta": "C"
  }
]`;

const letters = ["A", "B", "C", "D", "E"];

export default function SeedPage() {
  const { isAuthenticated, loading } = useAuth();
  const [status, setStatus] = useState("Aguardando ação...");
  const [jsonInput, setJsonInput] = useState(initialJson);
  const [isProcessing, setIsProcessing] = useState(false);

  const runSeed = async () => {
    if (!isAuthenticated) {
      setStatus("Erro: Você precisa estar logado para popular o banco.");
      return;
    }
    
    setIsProcessing(true);
    setStatus("Iniciando...");
    const db = getFirebaseDb();
    let count = 0;

    let rawQuestions;
    try {
      rawQuestions = JSON.parse(jsonInput);
      if (!Array.isArray(rawQuestions)) {
        throw new Error("O JSON precisa ser um array (lista) de objetos.");
      }
    } catch (e: any) {
      setStatus("Erro ao ler o JSON: " + e.message);
      setIsProcessing(false);
      return;
    }

    for (const q of rawQuestions) {
      const text = q.pergunta || q.enunciado;
      const id = q.id || `SAEP_AUTO_${Date.now()}_${count}`;

      if (!text || !q.alternativas) {
        setStatus(`Erro: A questão ${id} não tem o formato correto. Precisa ter "pergunta" ou "enunciado" e "alternativas".`);
        setIsProcessing(false);
        return;
      }

      // Aceita: resposta_correta, correta, ou gabarito
      const answer = q.resposta_correta || q.correta || q.gabarito;

      if (!answer) {
        console.warn(`⚠️ Questão ${id} sem resposta correta, usando "A" como padrão.`);
      }

      const options = [
        q.alternativas.A,
        q.alternativas.B,
        q.alternativas.C,
        q.alternativas.D,
        q.alternativas.E,
      ].filter(Boolean);

      const correctIndex = answer 
        ? letters.indexOf(answer.toUpperCase()) 
        : 0;

      const docData = {
        question: text,
        options: options,
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        subject: q.subject || "Conhecimentos Específicos",
        difficulty: q.difficulty || "medium",
        createdAt: Timestamp.now(),
      };

      try {
        const docRef = doc(db, "saep_questions", id);
        await setDoc(docRef, docData);
        count++;
        setStatus(`Enviada: ${id} (${count}/${rawQuestions.length})`);
      } catch (e: any) {
        setStatus(`Erro em ${id}: ${e.message}`);
        console.error(e);
        setIsProcessing(false);
        return;
      }
    }

    setStatus(`🎉 Concluído! Inseridas ${count} questões no banco.`);
    setIsProcessing(false);
  };

  if (loading) return <div>Carregando auth...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-mono">
      <h1 className="text-2xl font-bold mb-4">Semeador de Banco de Dados SAEP</h1>
      <p className="mb-8 text-gray-400">
        Cole o JSON das questões abaixo e clique em Inserir. Você pode inserir quantas vezes quiser, as novas questões serão adicionadas ao banco.
      </p>

      <div className="mb-6">
        <textarea
          className="w-full h-96 bg-gray-800 text-green-400 p-4 rounded-lg border border-gray-700 font-mono text-sm focus:outline-none focus:border-amber-500"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl mb-4 text-green-400">Status: {status}</h2>
        <button 
          onClick={runSeed}
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          {isProcessing ? "Processando..." : "Inserir Questões Acima no Banco"}
        </button>
      </div>

      {status.includes("Concluído") && (
        <a href="/simulado-saep/play" className="text-blue-400 underline block mt-4">
          Acessar página do Simulado
        </a>
      )}
    </div>
  );
}
