"use client";

import dynamic from "next/dynamic";
import { Component, ReactNode, useEffect, useId, useRef, useState } from "react";
// O loader do Monaco é o mesmo usado internamente por @monaco-editor/react
// (já instalado como dependência transitiva — nenhuma dependência nova).
import loader from "@monaco-editor/loader";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  height?: string;
}

function SimpleSqlEditor({
  value,
  onChange,
  disabled,
  height = "280px",
}: SqlEditorProps) {
  const id = useId();
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lines = value.split("\n");

  // Mantém a coluna de números acompanhando a rolagem vertical do textarea.
  // Como gutter e textarea têm a mesma altura de linha (leading-6 = 24px) e o
  // mesmo padding vertical, espelhar o scrollTop garante alinhamento exato.
  // O soft wrap fica desativado (wrap="off") para que cada linha lógica ocupe
  // exatamente uma linha visual — sem quebras de linha a numeração não pode se
  // desalinhar do conteúdo (comportamento equivalente ao do Monaco).
  const syncScroll = () => {
    const gutter = gutterRef.current;
    const textarea = textareaRef.current;
    if (gutter && textarea) gutter.scrollTop = textarea.scrollTop;
  };

  return (
    <div
      className="flex rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] overflow-hidden font-mono text-sm"
      style={{ height }}
    >
      <label htmlFor={id} className="sr-only">
        Editor SQL
      </label>
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none overflow-hidden bg-[var(--surface-container-high)] px-3 py-3 text-right text-[var(--outline)] text-xs leading-6 border-r border-[var(--outline-variant)]"
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        disabled={disabled}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        wrap="off"
        className="flex-1 resize-none overflow-auto bg-transparent p-3 leading-6 text-[var(--on-surface)] outline-none disabled:opacity-60"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}

function EditorSkeleton({ height = "280px" }: { height?: string }) {
  return (
    <div
      className="animate-pulse rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]"
      style={{ height }}
    />
  );
}

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

/** Tempo máximo de espera pelo Monaco antes de cair para o textarea. */
const MONACO_TIMEOUT_MS = 8000;

/**
 * Se o Monaco lançar erro ao renderizar (ex.: CDN/CSP bloqueando assets),
 * cai para o editor de texto simples em vez de deixar a tela presa.
 */
class MonacoErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function SqlEditor(props: SqlEditorProps) {
  const [mode, setMode] = useState<"loading" | "monaco" | "fallback">("loading");
  const mountedRef = useRef(false);

  // Pré-carrega o Monaco. Se falhar (CDN/CSP bloqueado) ou demorar demais,
  // usa o textarea como fallback real — o editor continua funcional.
  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setMode((m) => (m === "loading" ? "fallback" : m));
    }, MONACO_TIMEOUT_MS);

    loader
      .init()
      .then(() => {
        if (!cancelled) {
          clearTimeout(timeout);
          setMode("monaco");
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearTimeout(timeout);
          setMode("fallback");
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  // Se o Monaco estiver em "monaco" mas nunca montar (ex.: chunk local falhou),
  // cai para o textarea após o timeout.
  useEffect(() => {
    if (mode !== "monaco") return;
    const timeout = setTimeout(() => {
      if (!mountedRef.current) setMode("fallback");
    }, MONACO_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [mode]);

  if (mode === "loading") return <EditorSkeleton height={props.height} />;
  if (mode === "fallback") return <SimpleSqlEditor {...props} />;

  return (
    // O contêiner propaga a altura recebida (inclusive "100%") para o Monaco:
    // sem isso, o <section> interno com height:100% resolve contra um pai de
    // altura auto/0 e o editor fica sem área clicável/digitável.
    <div
      className="relative min-h-[280px]"
      style={{ height: props.height || "280px" }}
    >
      <MonacoErrorBoundary fallback={<SimpleSqlEditor {...props} />}>
        <MonacoEditor
          {...props}
          language="sql"
          theme="vs-dark"
          height={props.height || "280px"}
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontSize: 14,
            fontFamily: "DM Mono, monospace",
            readOnly: props.disabled,
            padding: { top: 12, bottom: 12 },
          }}
          onMount={() => {
            mountedRef.current = true;
          }}
          onChange={(value) => props.onChange(value || "")}
        />
      </MonacoErrorBoundary>
    </div>
  );
}
