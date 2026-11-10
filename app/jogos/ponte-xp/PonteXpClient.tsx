"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { authedFetch } from "@/lib/client-auth";

/**
 * Protocolo (sempre com `tipo: "gh-xp"`, só entre páginas da MESMA origem):
 *
 * ponte → jogo
 *   { evento: "status", logado, nome, ...resumo do GET /api/jogos/xp }
 *   { evento: "premio", pedido, ok, xpGanho, ...resumo | erro }
 *
 * jogo → ponte
 *   { acao: "status" }                         pede o status de novo
 *   { acao: "premiar", pedido, fase, estrelas } salva o resultado de uma fase
 *
 * O jogo é informado por ?jogo=<id> na URL da ponte.
 */
type Mensagem = Record<string, unknown>;

export default function PonteXpClient() {
  const { user, loading } = useAuth();
  const userRef = useRef(user);
  userRef.current = user;

  useEffect(() => {
    if (typeof window === "undefined" || window.parent === window) return;
    const jogo = new URLSearchParams(window.location.search).get("jogo") || "";
    const origem = window.location.origin;
    const enviar = (msg: Mensagem) =>
      window.parent.postMessage({ tipo: "gh-xp", ...msg }, origem);

    async function status() {
      const u = userRef.current;
      if (!u) {
        enviar({ evento: "status", logado: false });
        return;
      }
      try {
        const res = await authedFetch(`/api/jogos/xp?jogo=${encodeURIComponent(jogo)}`);
        const dados = res.ok ? await res.json() : {};
        enviar({
          evento: "status",
          logado: true,
          nome: u.name,
          disponivel: res.ok,
          ...dados,
        });
      } catch {
        enviar({ evento: "status", logado: true, nome: u.name, disponivel: false });
      }
    }

    async function premiar(m: Mensagem) {
      const pedido = m.pedido;
      if (!userRef.current) {
        enviar({ evento: "premio", pedido, ok: false, logado: false });
        return;
      }
      try {
        const res = await authedFetch("/api/jogos/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jogo, fase: m.fase, estrelas: m.estrelas }),
        });
        const dados = await res.json().catch(() => ({}));
        enviar({ evento: "premio", pedido, ok: res.ok, logado: true, ...dados });
      } catch {
        enviar({ evento: "premio", pedido, ok: false, logado: true, error: "Sem conexão." });
      }
    }

    const aoReceber = (ev: MessageEvent) => {
      if (ev.origin !== origem || ev.source !== window.parent) return;
      const m = ev.data as Mensagem;
      if (!m || m.tipo !== "gh-xp") return;
      if (m.acao === "status") void status();
      if (m.acao === "premiar") void premiar(m);
    };
    window.addEventListener("message", aoReceber);
    if (!loading) void status();
    return () => window.removeEventListener("message", aoReceber);
  }, [user, loading]);

  return null;
}
