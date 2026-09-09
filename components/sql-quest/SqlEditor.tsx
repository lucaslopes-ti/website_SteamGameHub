"use client";

import {
  Component,
  CSSProperties,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
// O loader do Monaco é o mesmo usado internamente por @monaco-editor/react
// (já instalado como dependência transitiva — nenhuma dependência nova).
import loader from "@monaco-editor/loader";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  height?: string;
}

/**
 * Contrato dimensional único para todos os modos do editor. O layout externo
 * entrega altura via `height` (inclusive "100%"); o piso de 280px garante que
 * nenhum modo desapareça se a cadeia de porcentagens ainda não resolver. A
 * largura é garantida em cada modo pelas classes `w-full min-w-0`, evitando o
 * colapso horizontal dentro de flex/grid.
 */
function EditorDimensionsStyle(height: string): CSSProperties {
  return { height, minHeight: "280px" };
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
      className="flex w-full min-w-0 overflow-hidden rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] font-mono text-sm"
      style={EditorDimensionsStyle(height)}
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
        className="min-w-0 flex-1 resize-none overflow-auto bg-transparent p-3 leading-6 text-[var(--on-surface)] outline-none disabled:opacity-60"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}

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

type MonacoModule = typeof import("@monaco-editor/react");

export default function SqlEditor(props: SqlEditorProps) {
  const resolvedHeight = props.height || "280px";
  // Enquanto o Monaco não está pronto (modo loading) e quando o fallback é
  // decidido, renderizamos o SimpleSqlEditor funcional com o valor real — ele
  // nunca sai do DOM entre esses dois estados, preservando foco e rolagem.
  const [EditorComponent, setEditorComponent] =
    useState<MonacoModule["Editor"] | null>(null);
  const [fallback, setFallback] = useState(false);
  const mountedRef = useRef(false);
  // Depois que o timeout (ou um erro do loader) decide pelo fallback, uma
  // resolução tardia do loader não pode mais substituir o editor funcional
  // por um Monaco que chegou fora do prazo — o usuário pode já estar digitando.
  const stickWithFallbackRef = useRef(false);

  // Pré-carrega o Monaco. Se falhar (CDN/CSP bloqueado) ou demorar demais,
  // usa o textarea como fallback real — o editor continua funcional.
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const commitToFallback = () => {
      if (cancelled || stickWithFallbackRef.current) return;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = undefined;
      stickWithFallbackRef.current = true;
      setFallback(true);
    };

    timeoutId = setTimeout(() => {
      // Timeout estourou: permanece no fallback. O guard
      // `stickWithFallbackRef` garante que o `.then` do loader, se resolver
      // depois, não troque o fallback por um Monaco atrasado.
      commitToFallback();
    }, MONACO_TIMEOUT_MS);

    loader
      .init()
      .then(async () => {
        if (cancelled || stickWithFallbackRef.current) return;
        const mod = await import("@monaco-editor/react");
        if (cancelled || stickWithFallbackRef.current) return;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = undefined;
        setEditorComponent(() => mod.Editor);
      })
      .catch(() => commitToFallback());

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Se o Monaco estiver pronto mas nunca montar de fato (ex.: chunk local
  // falhou), cai para o textarea após o timeout.
  useEffect(() => {
    if (!EditorComponent || fallback) return;
    const timeout = setTimeout(() => {
      if (!mountedRef.current) setFallback(true);
    }, MONACO_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [EditorComponent, fallback]);

  if (!fallback && EditorComponent) {
    return (
      // O contêiner propaga a altura recebida (inclusive "100%") para o Monaco:
      // sem isso, o <section> interno com height:100% resolve contra um pai de
      // altura auto/0 e o editor fica sem área clicável/digitável. `w-full
      // min-w-0` impede o colapso horizontal dentro de flex/grid, e o piso de
      // 280px mantém o contrato dimensional dos demais modos.
      <div
        className="relative w-full min-w-0 min-h-[280px]"
        style={{ height: resolvedHeight }}
      >
        <MonacoErrorBoundary fallback={<SimpleSqlEditor {...props} />}>
          <EditorComponent
            value={props.value}
            language="sql"
            theme="vs-dark"
            height={resolvedHeight}
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

  // Loading (enquanto o Monaco inicializa) e fallback usam o mesmo editor
  // funcional com o valor real — nunca um skeleton vazio.
  return <SimpleSqlEditor {...props} />;
}
