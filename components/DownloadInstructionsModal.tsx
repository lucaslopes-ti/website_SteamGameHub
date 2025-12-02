"use client";

import { useState, useEffect } from "react";
import { X, Download, FileArchive, FolderOpen, Play, ExternalLink, Terminal } from "lucide-react";

interface DownloadInstructionsModalProps {
  gameTitle: string;
  downloadLink?: string;
  onClose: () => void;
}

export default function DownloadInstructionsModal({
  gameTitle,
  downloadLink,
  onClose,
}: DownloadInstructionsModalProps) {
  const [step, setStep] = useState(0);

  // Funções helper para classes CSS (Tailwind não suporta classes dinâmicas)
  const getActiveStepClass = (color: string): string => {
    if (color.includes("blue")) return "bg-blue-500/20 border-blue-500/50";
    if (color.includes("green")) return "bg-green-500/20 border-green-500/50";
    if (color.includes("purple")) return "bg-purple-500/20 border-purple-500/50";
    if (color.includes("orange")) return "bg-orange-500/20 border-orange-500/50";
    return "bg-steam-green/20 border-steam-green/50";
  };

  const getIconBgClass = (color: string): string => {
    if (color.includes("blue")) return "bg-blue-500/20";
    if (color.includes("green")) return "bg-green-500/20";
    if (color.includes("purple")) return "bg-purple-500/20";
    if (color.includes("orange")) return "bg-orange-500/20";
    return "bg-steam-green/20";
  };

  const getIconBorderClass = (color: string): string => {
    if (color.includes("blue")) return "border border-blue-500/30";
    if (color.includes("green")) return "border border-green-500/30";
    if (color.includes("purple")) return "border border-purple-500/30";
    if (color.includes("orange")) return "border border-orange-500/30";
    return "border border-steam-green/30";
  };

  const getIconColorClass = (color: string): string => {
    if (color.includes("blue")) return "w-5 h-5 text-blue-500";
    if (color.includes("green")) return "w-5 h-5 text-green-500";
    if (color.includes("purple")) return "w-5 h-5 text-purple-500";
    if (color.includes("orange")) return "w-5 h-5 text-orange-500";
    return "w-5 h-5 text-steam-green";
  };

  // Animações de entrada
  useEffect(() => {
    const timer = setTimeout(() => setStep(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      icon: ExternalLink,
      title: "Acesse o Google Drive",
      description: "Clique no botão de download para ser redirecionado ao Google Drive",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Download,
      title: "Baixe o arquivo ZIP",
      description: "No Google Drive, clique em 'Download' para baixar o arquivo compactado",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FileArchive,
      title: "Descompacte o arquivo",
      description: "Localize o arquivo ZIP baixado e extraia todos os arquivos para uma pasta",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FolderOpen,
      title: "Abra a pasta extraída",
      description: "Navegue até a pasta onde você descompactou os arquivos",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Play,
      title: "Execute o jogo",
      description: "Procure pelo arquivo executável (.exe) e clique duas vezes para iniciar o jogo",
      color: "from-steam-green to-green-600",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-instructions-title"
    >
      <div
        className="relative bg-gradient-to-br from-steam-dark via-steam-darker to-steam-dark border-2 border-steam-blueLight rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideInModal 0.3s ease-out",
        }}
      >
        {/* Header com efeito tecnológico */}
        <div className="relative bg-gradient-to-r from-steam-blue via-steam-blueLight to-steam-green p-6 border-b-2 border-steam-blueLight">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Terminal className="w-6 h-6 text-steam-blueLight" />
              </div>
              <div>
                <h2
                  id="download-instructions-title"
                  className="text-2xl font-bold text-white mb-1"
                >
                  Instruções de Download
                </h2>
                <p className="text-gray-200 text-sm">
                  Como baixar e executar <span className="text-steam-green font-semibold">{gameTitle}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-all backdrop-blur-sm border border-white/20 hover:border-red-500"
              aria-label="Fechar instruções"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 md:p-8">
          {/* Passos */}
          <div className="space-y-4 mb-8">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = step === index + 1;
              
              return (
                <div
                  key={index}
                  className={`relative flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? getActiveStepClass(stepItem.color) + " shadow-lg scale-[1.02]"
                      : "bg-steam-dark/50 border-steam-blue/30 opacity-60"
                  }`}
                  style={{
                    animation: isActive ? "pulse 2s infinite" : "none",
                  }}
                >
                  {/* Número do passo */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg bg-gradient-to-br ${stepItem.color} shadow-lg`}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Ícone */}
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-10 h-10 rounded-lg ${getIconBgClass(stepItem.color)} flex items-center justify-center ${getIconBorderClass(stepItem.color)}`}>
                      <Icon className={getIconColorClass(stepItem.color)} />
                    </div>
                  </div>
                  
                  {/* Texto */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {stepItem.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {stepItem.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dicas importantes */}
          <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Dicas Importantes
            </h3>
            <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
              <li>Certifique-se de ter espaço suficiente no disco antes de baixar</li>
              <li>Alguns jogos podem exigir permissões de administrador para executar</li>
              <li>Se o Windows bloquear o arquivo, clique em "Mais informações" e "Executar mesmo assim"</li>
              <li>Mantenha todos os arquivos na mesma pasta para o jogo funcionar corretamente</li>
            </ul>
          </div>

          {/* Botão de ação */}
          {downloadLink && (
            <div className="flex gap-4">
              <a
                href={downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-steam-green to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                onClick={onClose}
              >
                <ExternalLink className="w-5 h-5" />
                Ir para Google Drive
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-steam-dark hover:bg-steam-darker text-gray-300 border border-steam-blue rounded-lg transition-all"
              >
                Entendi
              </button>
            </div>
          )}
        </div>

        {/* Efeitos visuais tecnológicos */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-steam-blueLight to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-steam-green to-transparent animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>
    </div>
  );
}
