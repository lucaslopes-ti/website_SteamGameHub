"use client";

import Link from "next/link";
import { Mail, Gamepad2, Github } from "lucide-react";
import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative border-t border-white/10 mt-20" role="contentinfo">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-senai-orange/50 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-orange flex items-center justify-center shadow-glow-orange">
                <Gamepad2 className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="font-display font-bold text-lg text-white">SENAI Game Hub</div>
                <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                  Técnico em Prog. de Jogos
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              {t("footer.aboutText")}
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/lucaslopes-ti"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-senai-orange hover:border-senai-orange/50 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:lucas.dalps@gmail.com"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-senai-orange hover:border-senai-orange/50 transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-senai-orange mb-4">
                {t("footer.links")}
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/games" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t("footer.allGames")}
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t("footer.uploadGame")}
                  </Link>
                </li>
                <li>
                  <Link href="/stats" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t("footer.stats")}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-senai-orange mb-4">
                Sobre
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t("footer.aboutProject")}
                  </Link>
                </li>
                <li>
                  <Link href="/materiais" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Materiais
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-mono">
            &copy; {currentYear} SENAI Game HUB. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <span>{t("footer.developedBy")} <strong className="text-senai-orange">Lucas Lopes</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
