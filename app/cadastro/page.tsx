"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, UserPlus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function CadastroPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);

    if (!success) {
      setError("Não foi possível criar a conta. Verifique os dados e tente novamente.");
      return;
    }

    router.push("/materiais");
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const success = await loginWithGoogle();
    setLoading(false);

    if (!success) {
      setError("Não foi possível entrar com Google.");
      return;
    }

    router.push("/materiais");
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      <div className="bg-senai-blueDark rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-senai-orange text-center">Criar conta</h1>
        <p className="text-gray-400 text-center mb-8">Cadastre-se para acessar os materiais.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded p-4 flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-senai-orange mb-2">Nome</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-senai-orange mb-2">E-mail</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-senai-orange mb-2">Senha</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-senai-orange mb-2">Confirmar senha</label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange"
              placeholder="Repita a senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name || !email || !password || !confirmPassword}
            className="w-full bg-senai-orange hover:bg-senai-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" aria-hidden="true" />
            <span>{loading ? "Criando conta..." : "Criar conta"}</span>
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

          <p className="text-sm text-gray-400 text-center">
            Já tem conta?{" "}
            <Link href="/login" className="text-senai-blueLight hover:text-senai-orange transition">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
