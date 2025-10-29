import Link from "next/link";
import { Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-steam-darker border-t border-steam-blue mt-20">
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
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/games" className="hover:text-steam-blueLight transition">
                  Todos os Jogos
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-steam-blueLight transition">
                  Enviar Jogo
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-steam-blueLight transition">
                  Sobre o Projeto
                </Link>
              </li>
              <li>
                <Link href="/stats" className="hover:text-steam-blueLight transition">
                  Estatísticas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-steam-blueLight font-bold mb-4">Contato</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-steam-blueLight transition"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@senai.com"
                className="text-gray-400 hover:text-steam-blueLight transition"
              >
                <Mail className="w-5 h-5" />
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

