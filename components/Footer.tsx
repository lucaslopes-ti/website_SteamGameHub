import Link from "next/link";
import { Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-steam-darker border-t border-steam-blue mt-20" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-steam-blueLight font-bold mb-4">SENAI Dr. Celso Charuri Game HUB</h3>
            <p className="text-gray-400 text-sm">
              Repositório de jogos desenvolvidos pelos alunos do curso Técnico em Programação de Jogos Digitais do SENAI Dr. Celso Charuri.
            </p>
          </div>
          <div>
            <h3 className="text-steam-blueLight font-bold mb-4">Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm" role="list">
              <li role="listitem">
                <Link 
                  href="/games" 
                  className="hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-1"
                  aria-label="Ver todos os jogos"
                >
                  Todos os Jogos
                </Link>
              </li>
              <li role="listitem">
                <Link 
                  href="/upload" 
                  className="hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-1"
                  aria-label="Enviar um novo jogo"
                >
                  Enviar Jogo
                </Link>
              </li>
              <li role="listitem">
                <Link 
                  href="/about" 
                  className="hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-1"
                  aria-label="Sobre o projeto Game HUB"
                >
                  Sobre o Projeto
                </Link>
              </li>
              <li role="listitem">
                <Link 
                  href="/stats" 
                  className="hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-1"
                  aria-label="Ver estatísticas do site"
                >
                  Estatísticas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-steam-blueLight font-bold mb-4">Contato</h3>
            <div className="flex gap-4" role="list">
              <a
                href="https://github.com/lucaslopes-ti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded p-1"
                aria-label="Abrir perfil do desenvolvedor no GitHub em nova aba"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">GitHub - Lucas Lopes</span>
              </a>
              <a
                href="mailto:lucas.dalps@gmail.com"
                className="text-gray-400 hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded p-1"
                aria-label="Enviar e-mail para lucas.dalps@gmail.com"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">E-mail - lucas.dalps@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-steam-blue mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 SENAI Dr. Celso Charuri Game HUB. Todos os direitos reservados.</p>
          <p className="mt-2 text-xs">
            Desenvolvido por <span className="text-steam-blueLight font-semibold">Lucas Lopes</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

