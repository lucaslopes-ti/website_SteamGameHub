"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export default function ToastComponent({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(toast.id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: "bg-green-900 bg-opacity-90 border-green-500",
    error: "bg-red-900 bg-opacity-90 border-red-500",
    warning: "bg-yellow-900 bg-opacity-90 border-yellow-500",
    info: "bg-blue-900 bg-opacity-90 border-blue-500",
  };

  const toastLabels = {
    success: "Sucesso",
    error: "Erro",
    warning: "Aviso",
    info: "Informação",
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${toastLabels[toast.type]}: ${toast.message}`}
      className={`${bgColors[toast.type]} border rounded-lg p-4 mb-2 min-w-[300px] max-w-md shadow-lg transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true">{icons[toast.type]}</span>
        <p className="flex-1 text-white text-sm">{toast.message}</p>
        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(toast.id), 300);
          }}
          className="text-gray-400 hover:text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 rounded"
          aria-label={`Fechar notificação ${toastLabels[toast.type]}`}
        >
          <X className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}

