"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { LogIn, AlertCircle } from "lucide-react";
import { useI18n } from "@/components/I18nProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/materiais");
      } else {
        setError(t("login.invalidCredentials"));
      }
    } catch {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const success = await loginWithGoogle();
      if (success) {
        router.push("/materiais");
      } else {
        setError("Não foi possível entrar com Google.");
      }
    } catch {
      setError("Erro ao tentar entrar com Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      <div className="bg-senai-blueDark rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-senai-orange text-center">
          {t("login.title")}
        </h1>
        <p className="text-gray-400 text-center mb-8">
          {t("login.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label={t("login.formAria")}>
          {error && (
            <div 
              role="alert"
              aria-live="assertive"
              className="bg-red-900 bg-opacity-50 border border-red-500 rounded p-4 flex items-center gap-2 text-red-200"
            >
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-senai-orange mb-2">
              {t("login.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange"
              placeholder={t("login.emailPlaceholder")}
              aria-describedby="email-description"
              aria-invalid={error ? "true" : "false"}
              aria-required="true"
            />
            <span id="email-description" className="sr-only">
              {t("login.emailDescription")}
            </span>
          </div>

          <div>
            <label htmlFor="password" className="block text-senai-orange mb-2">
              {t("login.passcode")}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange"
              placeholder="••••••••"
              aria-describedby="password-description"
              aria-invalid={error ? "true" : "false"}
              aria-required="true"
            />
            <span id="password-description" className="sr-only">
              {t("login.passcodeDescription")}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-senai-orange hover:bg-senai-blue disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 hover:text-white px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            aria-label={loading ? t("login.submittingAria") : t("login.submitAria")}
          >
            <LogIn className="w-5 h-5" aria-hidden="true" />
            <span>{loading ? t("login.submitting") : t("login.submit")}</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2 border border-gray-300"
            aria-label="Entrar com Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.29h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.15 3.58-8.63z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.86-3a7.16 7.16 0 0 1-10.66-3.76H1.43v3.08A12 12 0 0 0 12 24z"/>
              <path fill="#FBBC05" d="M5.42 14.34a7.2 7.2 0 0 1 0-4.68V6.58H1.43a12 12 0 0 0 0 10.84l3.99-3.08z"/>
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.6 4.59 1.77l3.44-3.44C17.95 1.08 15.24 0 12 0 7.31 0 3.27 2.69 1.43 6.58l3.99 3.08A7.16 7.16 0 0 1 12 4.77z"/>
            </svg>
            <span>Entrar com Google</span>
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/cadastro"
              className="text-senai-blueLight hover:text-senai-orange transition"
            >
              Criar conta
            </Link>
            <Link
              href="/recuperar-senha"
              className="text-senai-blueLight hover:text-senai-orange transition"
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

