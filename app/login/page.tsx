"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
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
        router.push("/admin");
      } else {
        setError("E-mail ou senha incorretos");
      }
    } catch (err) {
      setError("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      <div className="bg-steam-dark rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-steam-blueLight text-center">
          Entrar
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Acesso restrito para professores e administradores
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Formulário de login">
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
            <label htmlFor="email" className="block text-steam-blueLight mb-2">
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight focus-visible:ring-2 focus-visible:ring-steam-blueLight"
              placeholder="digite o email"
              aria-describedby="email-description"
              aria-invalid={error ? "true" : "false"}
              aria-required="true"
            />
            <span id="email-description" className="sr-only">
              Digite seu endereço de e-mail de acesso
            </span>
          </div>

          <div>
            <label htmlFor="password" className="block text-steam-blueLight mb-2">
              Senha *
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight focus-visible:ring-2 focus-visible:ring-steam-blueLight"
              placeholder="••••••••"
              aria-describedby="password-description"
              aria-invalid={error ? "true" : "false"}
              aria-required="true"
            />
            <span id="password-description" className="sr-only">
              Digite sua senha de acesso
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-steam-blueLight hover:bg-steam-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            aria-label={loading ? "Fazendo login, aguarde" : "Fazer login no sistema"}
          >
            <LogIn className="w-5 h-5" aria-hidden="true" />
            <span>{loading ? "Entrando..." : "Entrar"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

