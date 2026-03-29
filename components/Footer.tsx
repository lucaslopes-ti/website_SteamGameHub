"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-senai-dark border-t border-senai-blue mt-20" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-senai-orange font-bold mb-4">SENAI Dr. Celso Charuri Game HUB</h3>
            <p className="text-gray-400 text-sm">
              {t("footer.aboutText")}
            </p>
          </div>
          <div>
            <h3 className="text-senai-orange font-bold mb-4">{t("footer.links")}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link 
                  href="/games" 
                  className="hover:text-senai-orange transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 rounded px-1"
                  aria-label={t("footer.allGamesAria")}
                >
                  {t("footer.allGames")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/upload" 
                  className="hover:text-senai-orange transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 rounded px-1"
                  aria-label={t("footer.uploadGameAria")}
                >
                  {t("footer.uploadGame")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-senai-orange transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 rounded px-1"
                  aria-label={t("footer.aboutProjectAria")}
                >
                  {t("footer.aboutProject")}
                </Link>
              </li>
              <li>
                <Link 
                  href="/stats" 
                  className="hover:text-senai-orange transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 rounded px-1"
                  aria-label={t("footer.statsAria")}
                >
                  {t("footer.stats")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-senai-orange font-bold mb-4">{t("footer.contact")}</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/lucaslopes-ti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-senai-orange transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 rounded p-1"
                aria-label="Abrir perfil do desenvolvedor no GitHub em nova aba"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.596 2 12.267c0 4.536 2.865 8.384 6.839 9.742.5.095.683-.223.683-.495 0-.244-.009-.89-.014-1.747-2.782.62-3.369-1.386-3.369-1.386-.455-1.19-1.11-1.506-1.11-1.506-.907-.636.069-.623.069-.623 1.003.072 1.53 1.056 1.53 1.056.892 1.57 2.341 1.116 2.91.853.09-.665.35-1.116.636-1.373-2.22-.26-4.555-1.14-4.555-5.073 0-1.12.39-2.036 1.029-2.754-.103-.26-.446-1.304.098-2.719 0 0 .84-.276 2.75 1.052A9.291 9.291 0 0 1 12 6.845c.85.004 1.705.117 2.504.344 1.909-1.328 2.748-1.052 2.748-1.052.546 1.415.203 2.459.1 2.719.64.718 1.028 1.634 1.028 2.754 0 3.943-2.339 4.81-4.566 5.066.359.318.678.946.678 1.907 0 1.376-.012 2.486-.012 2.823 0 .274.18.594.688.493C19.138 20.648 22 16.8 22 12.267 22 6.596 17.523 2 12 2z" />
                </svg>
                <span className="sr-only">GitHub - Lucas Lopes</span>
              </a>
              <a
                href="mailto:lucas.dalps@gmail.com"
                className="text-gray-400 hover:text-senai-orange transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 rounded p-1"
                aria-label="Enviar e-mail para lucas.dalps@gmail.com"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">E-mail - lucas.dalps@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-senai-blue mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} SENAI Dr. Celso Charuri Game HUB. {t("footer.rights")}</p>
          <p className="mt-2 text-xs">
            {t("footer.developedBy")} <span className="text-senai-orange font-semibold">Lucas Lopes</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

