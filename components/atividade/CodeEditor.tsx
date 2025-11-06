"use client";

import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = "csharp",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[300px] bg-steam-dark border border-steam-blue rounded-lg p-4 font-mono text-sm text-white focus:outline-none focus:border-steam-blueLight resize-none"
        placeholder="Digite seu código C# aqui..."
        spellCheck={false}
      />
      <div className="absolute top-2 right-2 text-xs text-gray-500 bg-steam-darker px-2 py-1 rounded">
        {language.toUpperCase()}
      </div>
    </div>
  );
}

