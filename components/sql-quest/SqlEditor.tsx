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
  const lines = value.split("\n");
  return (
    <div
      className="flex rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] overflow-hidden font-mono text-sm"
      style={{ height }}
    >
      <label htmlFor={id} className="sr-only">
        Editor SQL
      </label>
      <div className="select-none bg-[var(--surface-container-high)] px-3 py-3 text-right text-[var(--outline)] text-xs leading-6 border-r border-[var(--outline-variant)]">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="flex-1 resize-none bg-transparent p-3 leading-6 text-[var(--on-surface)] outline-none disabled:opacity-60"
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
    <div className="relative">
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