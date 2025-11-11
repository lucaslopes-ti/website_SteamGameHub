"use client";

import { useEffect, useState, useRef } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface AntiCheatProtectionProps {
  onViolation: (type: string) => void;
  enabled?: boolean;
}

export default function AntiCheatProtection({ onViolation, enabled = true }: AntiCheatProtectionProps) {
  const { showToast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [violationCount, setViolationCount] = useState(0);
  const lastFocusTime = useRef<number>(Date.now());
  const violationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Detectar mudança de foco da janela (mudança de aba ou aplicativo)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabVisible(false);
        const timeSinceLastFocus = Date.now() - lastFocusTime.current;
        
        // Se saiu da aba por mais de 2 segundos, considerar violação
        if (timeSinceLastFocus > 2000) {
          handleViolation("mudança_de_aba");
        }
      } else {
        setTabVisible(true);
        lastFocusTime.current = Date.now();
      }
    };

    // Detectar mudança de foco (blur/focus)
    const handleBlur = () => {
      const timeSinceLastFocus = Date.now() - lastFocusTime.current;
      if (timeSinceLastFocus > 2000) {
        handleViolation("perda_de_foco");
      }
    };

    const handleFocus = () => {
      lastFocusTime.current = Date.now();
      setTabVisible(true);
    };

    // Detectar mudança de fullscreen
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      
      if (!isCurrentlyFullscreen && isFullscreen) {
        handleViolation("saida_fullscreen");
      }
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Detectar teclas de atalho comuns (F11, Alt+Tab, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F11 - Fullscreen
      if (e.key === "F11") {
        e.preventDefault();
        handleViolation("tecla_f11");
      }
      
      // Alt+Tab (Alt + Tab)
      if (e.altKey && e.key === "Tab") {
        handleViolation("alt_tab");
      }
      
      // Ctrl+Shift+T (reabrir aba fechada)
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        handleViolation("ctrl_shift_t");
      }
      
      // Ctrl+T (nova aba)
      if (e.ctrlKey && !e.shiftKey && e.key === "t") {
        e.preventDefault();
        handleViolation("ctrl_t");
      }
      
      // Ctrl+N (nova janela)
      if (e.ctrlKey && !e.shiftKey && e.key === "n") {
        e.preventDefault();
        handleViolation("ctrl_n");
      }
      
      // Ctrl+W (fechar aba)
      if (e.ctrlKey && !e.shiftKey && e.key === "w") {
        e.preventDefault();
        handleViolation("ctrl_w");
      }
    };

    // Detectar tentativa de abrir DevTools (F12, Ctrl+Shift+I, etc.)
    const handleDevTools = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        handleViolation("devtools_f12");
      }
      
      // Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        handleViolation("devtools_ctrl_shift_i");
      }
      
      // Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        handleViolation("devtools_ctrl_shift_j");
      }
      
      // Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        handleViolation("devtools_ctrl_shift_c");
      }
    };

    // Detectar clique com botão direito (menu de contexto)
    const handleContextMenu = (e: MouseEvent) => {
      // Permitir menu de contexto em elementos de código (para funcionalidades do navegador)
      const target = e.target as HTMLElement;
      const isCodeElement = target.closest('.code-editor-textarea') || 
                           target.closest('.code-editor-highlight') ||
                           target.closest('textarea') ||
                           target.closest('input') ||
                           target.tagName === "TEXTAREA" || 
                           target.tagName === "INPUT";
      
      if (!isCodeElement) {
        e.preventDefault();
        handleViolation("menu_contexto");
      }
    };

    // Detectar seleção de texto (tentativa de copiar)
    const handleSelectStart = (e: Event) => {
      // Permitir seleção dentro de textareas, inputs e elementos de código
      const target = e.target as HTMLElement;
      const isCodeElement = target.closest('.code-editor-textarea') || 
                           target.closest('.code-editor-highlight') ||
                           target.closest('textarea') ||
                           target.closest('input') ||
                           target.tagName === "TEXTAREA" || 
                           target.tagName === "INPUT";
      
      if (!isCodeElement) {
        e.preventDefault();
        handleViolation("selecao_texto");
      }
    };

    // Bloquear completamente Ctrl+C e Ctrl+V (mesmo em campos de texto)
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      handleViolation("tentativa_copia");
    };

    // Bloquear completamente Ctrl+C e Ctrl+V (mesmo em campos de texto)
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      handleViolation("tentativa_cola");
    };

    // Bloquear Ctrl+C e Ctrl+V via teclado também
    const handleCopyPasteKeys = (e: KeyboardEvent) => {
      // Ctrl+C ou Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        handleViolation("ctrl_c");
      }
      // Ctrl+V ou Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        e.preventDefault();
        handleViolation("ctrl_v");
      }
      // Ctrl+X ou Cmd+X (cortar)
      if ((e.ctrlKey || e.metaKey) && e.key === "x") {
        e.preventDefault();
        handleViolation("ctrl_x");
      }
    };

    // Adicionar listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleDevTools);
    document.addEventListener("keydown", handleCopyPasteKeys);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCopy); // Bloquear cortar também

    // Verificar periodicamente se a aba está visível
    const visibilityCheckInterval = setInterval(() => {
      if (document.hidden) {
        const timeSinceLastFocus = Date.now() - lastFocusTime.current;
        if (timeSinceLastFocus > 3000) {
          handleViolation("aba_oculta_prolongada");
        }
      }
    }, 2000);

    // Limpar listeners ao desmontar
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleDevTools);
      document.removeEventListener("keydown", handleCopyPasteKeys);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCopy);
      clearInterval(visibilityCheckInterval);
      if (violationTimeoutRef.current) {
        clearTimeout(violationTimeoutRef.current);
      }
    };
  }, [enabled, isFullscreen]);

  const handleViolation = (type: string) => {
    // Ignorar violações relacionadas a interações normais no editor
    const ignoredTypes = ["selecao_texto"]; // Seleção de texto no editor é permitida
    
    if (ignoredTypes.includes(type)) {
      return; // Não registrar violação para tipos ignorados
    }
    
    setViolationCount((prev) => {
      const newCount = prev + 1;
      
      // Alertar após primeira violação
      if (newCount === 1) {
        showToast("⚠️ Atenção: Comportamento suspeito detectado!", "warning");
      }
      
      // Alertar após múltiplas violações
      if (newCount >= 3) {
        showToast("🚫 Múltiplas violações detectadas! A prova pode ser invalidada.", "error");
      }
      
      // Notificar componente pai
      onViolation(type);
      
      return newCount;
    });
  };

  // Não renderizar nada visível, apenas proteção em background
  return null;
}

