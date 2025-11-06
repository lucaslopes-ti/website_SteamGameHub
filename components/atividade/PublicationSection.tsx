"use client";

import { useState } from "react";
import { Upload, FileText, MessageSquare, CheckCircle, Download } from "lucide-react";
import ChatComponent from "./ChatComponent";

interface PublicationSectionProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
  unlocked: boolean;
}

export default function PublicationSection({
  onComplete,
  addXP,
  unlocked,
}: PublicationSectionProps) {
  const [codeFile, setCodeFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [gddFile, setGddFile] = useState<File | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [allUploaded, setAllUploaded] = useState(false);
  const [reflectionCompleted, setReflectionCompleted] = useState(false);

  const handleFileSelect = (
    type: "code" | "cover" | "gdd",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    switch (type) {
      case "code":
        if (file.name.endsWith(".cs")) {
          setCodeFile(file);
        } else {
          alert("Por favor, selecione um arquivo .cs");
        }
        break;
      case "cover":
        if (file.type.startsWith("image/")) {
          setCoverFile(file);
        } else {
          alert("Por favor, selecione uma imagem");
        }
        break;
      case "gdd":
        setGddFile(file);
        break;
    }
  };

  const handleUploadAll = async () => {
    if (!codeFile || !coverFile || !gddFile) {
      alert("Por favor, selecione todos os arquivos");
      return;
    }

    try {
      // Upload do código
      const codeFormData = new FormData();
      codeFormData.append("file", codeFile);
      codeFormData.append("type", "executable");

      const codeResponse = await fetch("/api/upload", {
        method: "POST",
        body: codeFormData,
      });

      // Upload da capa
      const coverFormData = new FormData();
      coverFormData.append("file", coverFile);
      coverFormData.append("type", "image");

      const coverResponse = await fetch("/api/upload", {
        method: "POST",
        body: coverFormData,
      });

      if (codeResponse.ok && coverResponse.ok) {
        setAllUploaded(true);
        addXP(200);
      } else {
        alert("Erro ao fazer upload dos arquivos");
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload");
    }
  };

  const handleReflectionSubmit = () => {
    if (reflectionText.trim().length < 50) {
      alert("A reflexão deve ter pelo menos 50 caracteres");
      return;
    }
    setReflectionCompleted(true);
    addXP(50);
  };

  const handleGenerateReport = () => {
    const reportContent = `# Relatório de Atividade - Protótipo Codificado

## Aluno: [Seu Nome]
## Data: ${new Date().toLocaleDateString("pt-BR")}

## Arquivos Entregues
- Código C#: ${codeFile?.name || "Não enviado"}
- Capa 3D: ${coverFile?.name || "Não enviado"}
- GDD Mini: ${gddFile?.name || "Não enviado"}

## Reflexão sobre a Atividade

${reflectionText}

## Conclusão

Atividade completada com sucesso!
`;
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Relatorio_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canComplete = allUploaded && reflectionCompleted;

  if (!unlocked) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Complete a fase anterior para desbloquear esta seção.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-steam-blueLight mb-2 flex items-center gap-3">
          <Upload className="w-8 h-8" />
          Publicação e Reflexão
        </h2>
        <p className="text-gray-300">
          Envie todos os arquivos finais e compartilhe sua reflexão sobre a atividade.
        </p>
      </div>

      {/* Upload de Arquivos */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Upload Final
        </h3>
        {allUploaded && (
          <div className="mb-4 bg-steam-green/20 border border-steam-green rounded-lg p-4">
            <div className="flex items-center gap-2 text-steam-green">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Todos os arquivos foram enviados! +200 XP</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Código C# */}
          <div className="bg-steam-dark border border-steam-blue rounded-lg p-4">
            <FileText className="w-8 h-8 text-steam-blueLight mb-2" />
            <h4 className="font-semibold text-white mb-2">Código C#</h4>
            <input
              type="file"
              id="code-upload"
              accept=".cs"
              onChange={(e) => handleFileSelect("code", e)}
              className="hidden"
              disabled={allUploaded}
            />
            <label
              htmlFor="code-upload"
              className={`block text-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                codeFile
                  ? "bg-steam-green/20 text-steam-green border border-steam-green"
                  : allUploaded
                  ? "bg-steam-darker text-gray-500 cursor-not-allowed"
                  : "bg-steam-blue hover:bg-steam-blueLight text-white"
              }`}
            >
              {codeFile ? codeFile.name : "Selecionar .cs"}
            </label>
          </div>

          {/* Capa 3D */}
          <div className="bg-steam-dark border border-steam-blue rounded-lg p-4">
            <Upload className="w-8 h-8 text-steam-blueLight mb-2" />
            <h4 className="font-semibold text-white mb-2">Capa 3D</h4>
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              onChange={(e) => handleFileSelect("cover", e)}
              className="hidden"
              disabled={allUploaded}
            />
            <label
              htmlFor="cover-upload"
              className={`block text-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                coverFile
                  ? "bg-steam-green/20 text-steam-green border border-steam-green"
                  : allUploaded
                  ? "bg-steam-darker text-gray-500 cursor-not-allowed"
                  : "bg-steam-blue hover:bg-steam-blueLight text-white"
              }`}
            >
              {coverFile ? coverFile.name : "Selecionar Imagem"}
            </label>
          </div>

          {/* GDD */}
          <div className="bg-steam-dark border border-steam-blue rounded-lg p-4">
            <FileText className="w-8 h-8 text-steam-blueLight mb-2" />
            <h4 className="font-semibold text-white mb-2">GDD Mini</h4>
            <input
              type="file"
              id="gdd-upload"
              accept=".txt,.doc,.docx"
              onChange={(e) => handleFileSelect("gdd", e)}
              className="hidden"
              disabled={allUploaded}
            />
            <label
              htmlFor="gdd-upload"
              className={`block text-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                gddFile
                  ? "bg-steam-green/20 text-steam-green border border-steam-green"
                  : allUploaded
                  ? "bg-steam-darker text-gray-500 cursor-not-allowed"
                  : "bg-steam-blue hover:bg-steam-blueLight text-white"
              }`}
            >
              {gddFile ? gddFile.name : "Selecionar GDD"}
            </label>
          </div>
        </div>

        {!allUploaded && (
          <button
            onClick={handleUploadAll}
            disabled={!codeFile || !coverFile || !gddFile}
            className="w-full px-6 py-3 bg-steam-green hover:bg-steam-green/80 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Todos os Arquivos
          </button>
        )}
      </div>

      {/* Reflexão */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Autoavaliação e Reflexão
          </h3>
          {reflectionCompleted && (
            <div className="flex items-center gap-2 text-steam-green">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Concluída +50 XP</span>
            </div>
          )}
        </div>
        <p className="text-gray-300 mb-4">
          Reflita sobre sua experiência na atividade. O que você aprendeu? Quais foram os desafios?
          (Mínimo 50 caracteres)
        </p>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="Escreva sua reflexão aqui..."
          rows={8}
          className="w-full bg-steam-dark border border-steam-blue rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight resize-y mb-4"
          disabled={reflectionCompleted}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {reflectionText.length} caracteres (mínimo: 50)
          </span>
          {!reflectionCompleted && (
            <button
              onClick={handleReflectionSubmit}
              disabled={reflectionText.trim().length < 50}
              className="px-6 py-3 bg-steam-blueLight hover:bg-steam-blue text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Reflexão
            </button>
          )}
        </div>
      </div>

      {/* Chat em Tempo Real */}
      <ChatComponent activityId="prototipo-csharp" />

      {/* Ações Finais */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Ações Finais</h3>
        <div className="flex gap-4">
          <button
            onClick={handleGenerateReport}
            disabled={!canComplete}
            className="flex items-center gap-2 px-6 py-3 bg-steam-blue hover:bg-steam-blue/80 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Gerar Relatório PDF
          </button>
        </div>
      </div>

      {/* Conclusão */}
      {canComplete && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-steam-blueLight to-steam-green text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Concluir Atividade e Finalizar →
          </button>
        </div>
      )}
    </div>
  );
}

