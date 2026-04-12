"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function RecuperarSenhaPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const ok = await resetPassword(email);
    setLoading(false);

    if (!ok) {
      setError("Não foi possível enviar o e-mail de recuperação. Tente novamente.");
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      <div className="bg-senai-blueDark rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-senai-orange text-center">Recuperar senha</h1>
        <p className="text-gray-400 text-center mb-8">Enviaremos um link para redefinir sua senha.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded p-4 flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-900/40 border border-green-500 rounded p-4 flex items-center gap-2 text-green-200">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              <span>E-mail enviado com sucesso. Verifique sua caixa de entrada.</span>
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-senai-orange hover:bg-senai-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            <span>{loading ? "Enviando..." : "Enviar link de recuperação"}</span>
          </button>

          <p className="text-sm text-gray-400 text-center">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-senai-blueLight hover:text-senai-orange transition">
              Voltar ao login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
