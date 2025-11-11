"use client";

import { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

// Função para escapar HTML (funciona no cliente e servidor)
function escapeHtml(text: string): string {
  if (typeof window === 'undefined') {
    // Servidor: usar replace simples
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  // Cliente: usar DOM
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Função simples de syntax highlighting para C#
function highlightCSharp(code: string): string {
  if (!code || code.trim() === "") return "";
  
  // Escapar HTML primeiro para evitar problemas
  let highlighted = escapeHtml(code);

  // Palavras-chave C#
  const keywords = [
    "using", "namespace", "class", "static", "void", "Main", "int", "double", "float",
    "string", "bool", "char", "if", "else", "while", "for", "foreach", "do", "switch",
    "case", "break", "continue", "return", "try", "catch", "finally", "throw", "new",
    "public", "private", "protected", "internal", "abstract", "virtual", "override",
    "sealed", "readonly", "const", "var", "this", "base", "null", "true", "false"
  ];

  // Tipos e classes comuns
  const types = [
    "Console", "String", "Int32", "Double", "Boolean", "Object", "Array", "List",
    "Dictionary", "DateTime", "Math", "Convert"
  ];

  // Métodos comuns
  const methods = [
    "WriteLine", "Write", "ReadLine", "Read", "Parse", "ToString", "Length", "Substring",
    "IndexOf", "Replace", "Split", "Join", "Trim", "ToUpper", "ToLower"
  ];

  // Destacar palavras-chave primeiro (antes de outras substituições)
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${escapeHtml(keyword)}\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      `<span style="color: #569cd6;">${escapeHtml(keyword)}</span>`
    );
  });

  // Destacar tipos
  types.forEach((type) => {
    const regex = new RegExp(`\\b${escapeHtml(type)}\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      `<span style="color: #4ec9b0;">${escapeHtml(type)}</span>`
    );
  });

  // Destacar métodos
  methods.forEach((method) => {
    const regex = new RegExp(`\\.${escapeHtml(method)}\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      `<span style="color: #dcdcaa;">.${escapeHtml(method)}</span>`
    );
  });

  // Destacar strings (entre aspas) - depois das palavras-chave para evitar conflitos
  highlighted = highlighted.replace(
    /&quot;([^&quot;\\]|\\.)*&quot;/g,
    '<span style="color: #ce9178;">$&</span>'
  );

  // Destacar números
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span style="color: #b5cea8;">$1</span>'
  );

  // Destacar comentários de linha
  highlighted = highlighted.replace(
    /\/\/.*$/gm,
    '<span style="color: #6a9955;">$&</span>'
  );

  // Destacar comentários de bloco
  highlighted = highlighted.replace(
    /\/\*[\s\S]*?\*\//g,
    '<span style="color: #6a9955;">$&</span>'
  );

  return highlighted;
}

export default function CodeEditor({
  value,
  onChange,
  language = "csharp",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    if (language === "csharp" && value) {
      // Apenas destacar se houver conteúdo
      const highlighted = highlightCSharp(value);
      setHighlightedCode(highlighted);
    } else {
      // Para outras linguagens ou valor vazio, usar texto puro (escapado)
      setHighlightedCode(value || "");
    }
  }, [value, language]);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      // Sincronizar scroll
      const syncScroll = () => {
        if (highlightRef.current) {
          highlightRef.current.scrollTop = textareaRef.current!.scrollTop;
          highlightRef.current.scrollLeft = textareaRef.current!.scrollLeft;
        }
      };

      textareaRef.current.addEventListener("scroll", syncScroll);
      return () => {
        textareaRef.current?.removeEventListener("scroll", syncScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Bloquear Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v" || e.key === "x")) {
      e.preventDefault();
      return;
    }

    // Indentação automática com Tab
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      onChange(newValue);

      // Reposicionar cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Editor com syntax highlighting (fundo) */}
      <div
        ref={highlightRef}
        className="code-editor-highlight absolute inset-0 w-full h-full bg-[#1e1e1e] border border-[#3e3e42] rounded-lg p-4 font-mono text-sm text-[#d4d4d4] overflow-auto whitespace-pre-wrap break-words pointer-events-none"
        style={{
          fontFamily: "Consolas, 'Courier New', monospace",
          lineHeight: "1.5",
        }}
        dangerouslySetInnerHTML={{ __html: highlightedCode || "" }}
      />

      {/* Textarea transparente (sobreposto) - sempre recebe texto puro */}
      <textarea
        ref={textareaRef}
        value={typeof value === 'string' ? value : ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="code-editor-textarea relative w-full h-full bg-transparent border-none rounded-lg p-4 font-mono text-sm text-transparent caret-[#d4d4d4] focus:outline-none resize-none overflow-auto whitespace-pre-wrap break-words"
        style={{
          fontFamily: "Consolas, 'Courier New', monospace",
          lineHeight: "1.5",
          tabSize: 4,
        }}
        placeholder="Digite seu código C# aqui..."
        spellCheck={false}
      />

      {/* Badge de linguagem */}
      <div className="absolute top-2 right-2 text-xs text-[#858585] bg-[#252526] px-2 py-1 rounded border border-[#3e3e42] z-10">
        {language.toUpperCase()}
      </div>

      {/* Estilos inline para scrollbar personalizada */}
      <style dangerouslySetInnerHTML={{ __html: `
        .code-editor-textarea::selection {
          background-color: rgba(0, 122, 204, 0.3);
        }
        .code-editor-textarea::-webkit-scrollbar,
        .code-editor-highlight::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .code-editor-textarea::-webkit-scrollbar-track,
        .code-editor-highlight::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .code-editor-textarea::-webkit-scrollbar-thumb,
        .code-editor-highlight::-webkit-scrollbar-thumb {
          background: #424242;
          border-radius: 5px;
        }
        .code-editor-textarea::-webkit-scrollbar-thumb:hover,
        .code-editor-highlight::-webkit-scrollbar-thumb:hover {
          background: #4e4e4e;
        }
      `}} />
    </div>
  );
}
