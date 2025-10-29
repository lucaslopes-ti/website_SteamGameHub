import { Info, Users, Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-steam-blueLight">
        Sobre o Projeto
      </h1>

      <div className="space-y-8">
        <div className="bg-steam-dark rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Info className="w-8 h-8 text-steam-blueLight flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                O que é o SENAI Dr. Celso Charuri Game HUB?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                O SENAI Dr. Celso Charuri Game HUB é um repositório digital criado para
                compartilhar e exibir os jogos desenvolvidos pelos alunos do
                curso Técnico em Programação de Jogos Digitais do SENAI Dr. Celso Charuri. Este
                projeto serve como uma vitrine para os trabalhos criados durante
                o curso, permitindo que estudantes, professores e visitantes
                explorem, avaliem e joguem os projetos desenvolvidos.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-steam-blueLight flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">Objetivos</h2>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>
                  Criar um espaço centralizado para publicação de jogos
                  estudantis
                </li>
                <li>
                  Facilitar o compartilhamento de projetos entre alunos e
                  professores
                </li>
                <li>
                  Fornecer feedback através de sistema de avaliações
                </li>
                <li>
                  Demonstrar o progresso e talento dos estudantes
                </li>
                <li>
                  Servir como portfólio para os alunos do curso
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Users className="w-8 h-8 text-steam-blueLight flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                Como Funciona?
              </h2>
              <ol className="text-gray-300 space-y-3 list-decimal list-inside">
                <li>
                  <strong className="text-white">Alunos enviam seus jogos:</strong>{" "}
                  Preenchem um formulário com informações sobre o jogo,
                  incluindo descrição, gênero, tecnologias usadas e links para
                  jogar ou baixar.
                </li>
                <li>
                  <strong className="text-white">Revisão pelos professores:</strong>{" "}
                  Os jogos enviados passam por uma revisão antes de serem
                  publicados na plataforma.
                </li>
                <li>
                  <strong className="text-white">Publicação:</strong> Após
                  aprovados, os jogos ficam disponíveis para todos os
                  visitantes explorarem e jogarem.
                </li>
                <li>
                  <strong className="text-white">Avaliação:</strong> Usuários
                  podem avaliar os jogos, fornecendo feedback valioso para os
                  desenvolvedores.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Award className="w-8 h-8 text-steam-blueLight flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-white">
                Tecnologias Utilizadas
              </h2>
              <p className="text-gray-300 mb-3">
                Este projeto foi desenvolvido utilizando tecnologias modernas:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong className="text-white">Frontend:</strong> Next.js 14,
                  React, TypeScript, TailwindCSS
                </li>
                <li>
                  <strong className="text-white">Design:</strong> Inspirado no
                  visual da Steam, com paleta de cores personalizada
                </li>
                <li>
                  <strong className="text-white">Ícones:</strong> Lucide React
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-steam-green bg-opacity-20 border border-steam-green rounded-lg p-6">
          <p className="text-white text-center mb-4">
            Este é um projeto educacional desenvolvido para fins de aprendizado
            e demonstração de habilidades dos alunos do SENAI.
          </p>
          <div className="border-t border-steam-green pt-4 mt-4 text-center">
            <p className="text-gray-300">
              <strong className="text-steam-blueLight">Desenvolvido por:</strong> Lucas Lopes
            </p>
            <p className="text-gray-400 text-sm mt-2">
              © 2025 Lucas Lopes - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

