"use client";

import { useEffect, useRef, useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

// Função simples de syntax highlighting para C#
function highlightCSharp(code: string): string {
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

  let highlighted = code;

  // Destacar strings (entre aspas)
  highlighted = highlighted.replace(
    /"([^"\\]|\\.)*"/g,
    '<span class="text-[#ce9178]">$&</span>'
  );

  // Destacar números
  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="text-[#b5cea8]">$1</span>'
  );

  // Destacar comentários de linha
  highlighted = highlighted.replace(
    /\/\/.*$/gm,
    '<span class="text-[#6a9955]">$&</span>'
  );

  // Destacar comentários de bloco
  highlighted = highlighted.replace(
    /\/\*[\s\S]*?\*\//g,
    '<span class="text-[#6a9955]">$&</span>'
  );

  // Destacar palavras-chave
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      `<span class="text-[#569cd6]">${keyword}</span>`
    );
  });

  // Destacar tipos
  types.forEach((type) => {
    const regex = new RegExp(`\\b${type}\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      `<span class="text-[#4ec9b0]">${type}</span>`
    );
  });

  // Destacar métodos
  methods.forEach((method) => {
    const regex = new RegExp(`\\.${method}\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      `<span class="text-[#dcdcaa]">.${method}</span>`
    );
  });

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
    if (language === "csharp") {
      setHighlightedCode(highlightCSharp(value));
    } else {
      setHighlightedCode(value);
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
        dangerouslySetInnerHTML={{ __html: highlightedCode || value }}
      />

      {/* Textarea transparente (sobreposto) */}
      <textarea
        ref={textareaRef}
        value={value}
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
