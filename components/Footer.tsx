"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Github } from "lucide-react";
import { useI18n } from "./I18nProvider";

import { usePathname } from "next/navigation";

export default function Footer() {
  const { t } = useI18n();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <>
      {pathname.startsWith("/simulado-saep") && (
        <style dangerouslySetInnerHTML={{ __html: `
          #footer {
            --surface-container-low: #060608 !important;
            --surface-container-lowest: #0d0d12 !important;
            --primary: #f5c97a !important;
            --on-surface-variant: #6b6870 !important;
            --outline-10: rgba(255, 255, 255, 0.06) !important;
            --secondary: #a8823a !important;
            --secondary-container: #f5c97a !important;
            background-color: #060608 !important;
            border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
          }
          #footer p, #footer span, #footer div {
            color: #d4cfc8;
          }
          #footer .text-\\[10px\\] {
            color: #6b6870 !important;
          }
          #footer a {
            color: #d4cfc8 !important;
          }
          #footer a:hover {
            color: #f5c97a !important;
          }
          #footer .text-\\[var\\(--primary\\)\\] {
            color: #f5c97a !important;
          }
          #footer .text-\\[var\\(--secondary\\)\\] {
            color: #a8823a !important;
          }
          #footer .bg-gradient-to-r {
            background-image: linear-gradient(to right, transparent, rgba(245, 201, 122, 0.2), transparent) !important;
          }
        `}} />
      )}
    <footer id="footer" className="relative border-t border-[var(--outline-10)] mt-20 bg-[var(--surface-container-low)]" role="contentinfo">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--secondary-container)]/60 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-container-lowest)] border border-[var(--outline-10)] flex items-center justify-center shadow-sm">
                <Image
                  src="/uploads/images/logo_senaigamehub.png"
                  alt="SENAI Game Hub"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="leading-tight">
                <div className="font-display font-bold text-lg text-[var(--primary)]">SENAI Game Hub</div>
                <div className="text-[10px] text-[var(--on-surface-variant)] font-mono uppercase tracking-wider">
                  Técnico em Prog. de Jogos
                </div>
              </div>
            </div>
            <p className="text-sm text-[var(--on-surface-variant)] max-w-md leading-relaxed">
              {t("footer.aboutText")}
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/lucaslopes-ti"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[var(--surface-container-lowest)] border border-[var(--outline-10)] flex items-center justify-center text-[var(--on-surface-variant)] hover:text-[var(--secondary)] hover:border-[var(--secondary-container)] transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:lucas.dalps@gmail.com"
                className="w-9 h-9 rounded-lg bg-[var(--surface-container-lowest)] border border-[var(--outline-10)] flex items-center justify-center text-[var(--on-surface-variant)] hover:text-[var(--secondary)] hover:border-[var(--secondary-container)] transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--secondary)] mb-4">
                {t("footer.links")}
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/games" className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
                    {t("footer.allGames")}
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
                    {t("footer.uploadGame")}
                  </Link>
                </li>
                <li>
                  <Link href="/stats" className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
                    {t("footer.stats")}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--secondary)] mb-4">
                Sobre
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
                    {t("footer.aboutProject")}
                  </Link>
                </li>
                <li>
                  <Link href="/materiais" className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-colors">
                    Materiais
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--outline-10)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--on-surface-variant)] font-mono">
            &copy; {currentYear} SENAI Game HUB. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6 text-xs text-[var(--on-surface-variant)]">
            <span>{t("footer.developedBy")} <strong className="text-[var(--secondary)]">Lucas Lopes</strong></span>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
