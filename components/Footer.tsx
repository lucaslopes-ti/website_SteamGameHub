"use client";

import Link from "next/link";
import { Github, Mail } from "lucide-react";
import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer id="footer" className="bg-steam-darker border-t border-steam-blue mt-20" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-steam-blueLight font-bold mb-4">SENAI Dr. Celso Charuri Game HUB</h3>
            <p className="text-gray-400 text-sm">
              {t("footer.aboutText")}
            </p>
          </div>
          <div>
            <h3 className="text-steam-blueLight font-bold mb-4">{t("footer.links")}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link 
                  href="/games" 
                  className="hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-1"
                  aria-label={t("footer.allGamesAria")}
                >
                  {t("footer.allGames")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/upload" 
                  className="hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-1"
                  aria-label={t("footer.uploadGameAria")}
                >
                  {t("footer.uploadGame")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-1"
                  aria-label={t("footer.aboutProjectAria")}
                >
                  {t("footer.aboutProject")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/stats" 
                  className="hover:text-steam-blueLight transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-steam-blueLight focus-visible:outline-offset-2 rounded px-1"
                  aria-label={t("footer.statsAria")}
                >
                  {t("footer.stats")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-steam-blueLight font-bold mb-4">{t("footer.contact")}</h3>
            <div className="flex gap-4">
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
          <p>&copy; 2025 SENAI Dr. Celso Charuri Game HUB. {t("footer.rights")}</p>
          <p className="mt-2 text-xs">
            {t("footer.developedBy")} <span className="text-steam-blueLight font-semibold">Lucas Lopes</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

