"use client";

import { useState, useEffect } from "react";
import { Boxes, Upload, Image as ImageIcon, Clock, CheckCircle, Download } from "lucide-react";

interface BlenderSectionProps {
  onComplete: () => void;
  addXP: (amount: number) => void;
  unlocked: boolean;
}

export default function BlenderSection({
  onComplete,
  addXP,
  unlocked,
}: BlenderSectionProps) {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [gddDescription, setGddDescription] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gddDownloaded, setGddDownloaded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione uma imagem");
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!coverImage) {
      alert("Selecione uma imagem primeiro");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", coverImage);
      formData.append("type", "image");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploaded(true);
        addXP(150);
      } else {
        alert("Erro ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert("Erro ao fazer upload");
    }
  };

  const handleDownloadGDD = () => {
    const gddContent = `# GDD Mini - Protótipo Codificado

## Descrição da Capa 3D

${gddDescription}

## Técnicas Utilizadas
- Modelagem 3D no Blender
- Texturização
- Renderização

## Tempo de Produção
${Math.floor(timeElapsed / 60)} minutos

## Data de Criação
${new Date().toLocaleDateString("pt-BR")}
`;

    const blob = new Blob([gddContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GDD_Mini.txt";
    a.click();
    URL.revokeObjectURL(url);
    setGddDownloaded(true);
    addXP(50);
  };

  useEffect(() => {
    if (timerStarted) {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const canComplete = uploaded && gddDownloaded && gddDescription.trim().length > 0;

  if (!unlocked) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Boxes className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Complete a fase anterior para desbloquear esta seção.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-steam-blueLight mb-2 flex items-center gap-3">
          <Boxes className="w-8 h-8" />
          Modelagem Blender
        </h2>
        <p className="text-gray-300">
          Crie uma capa 3D para seu protótipo usando Blender. Tempo sugerido: 45 minutos.
        </p>
      </div>

      {/* Timer */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-steam-blueLight" />
            <span className="text-white font-semibold">Tempo decorrido:</span>
            <span
              className={`text-2xl font-bold ${
                timeElapsed > 45 * 60 ? "text-red-400" : "text-steam-green"
              }`}
            >
              {formatTime(timeElapsed)}
            </span>
          </div>
          {!timerStarted && (
            <button
              onClick={() => setTimerStarted(true)}
              className="px-4 py-2 bg-steam-green hover:bg-steam-green/80 text-white rounded-lg font-semibold transition-colors"
            >
              Iniciar Timer
            </button>
          )}
        </div>
        {timeElapsed > 45 * 60 && (
          <p className="text-red-400 text-sm mt-2">
            ⚠️ Você ultrapassou o tempo sugerido de 45 minutos.
          </p>
        )}
      </div>

      {/* Guia Passo a Passo */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Guia Passo a Passo</h3>
        <div className="space-y-4 text-gray-300">
          <div className="flex gap-4">
            <span className="font-bold text-steam-blueLight">1.</span>
            <p>Crie um novo projeto no Blender e configure a cena.</p>
          </div>
          <div className="flex gap-4">
            <span className="font-bold text-steam-blueLight">2.</span>
            <p>Modele objetos básicos (cubo, esfera, etc.) para sua capa.</p>
          </div>
          <div className="flex gap-4">
            <span className="font-bold text-steam-blueLight">3.</span>
            <p>Adicione texturas e materiais aos objetos.</p>
          </div>
          <div className="flex gap-4">
            <span className="font-bold text-steam-blueLight">4.</span>
            <p>Configure iluminação e renderize a imagem final (PNG, 1920x1080 recomendado).</p>
          </div>
        </div>
      </div>

      {/* Upload da Capa */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Upload da Capa 3D
          </h3>
          {uploaded && (
            <div className="flex items-center gap-2 text-steam-green">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Enviado +150 XP</span>
            </div>
          )}
        </div>

        {coverPreview ? (
          <div className="mb-4">
            <img
              src={coverPreview}
              alt="Preview da capa"
              className="w-full max-w-md mx-auto rounded-lg border-2 border-steam-blue"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-steam-blue rounded-lg p-8 text-center mb-4">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300 mb-2">Clique para selecionar a imagem da capa</p>
            <p className="text-gray-400 text-sm">PNG recomendado (1920x1080)</p>
          </div>
        )}

        <input
          type="file"
          id="cover-upload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          disabled={uploaded}
        />
        <div className="flex gap-4">
          <label
            htmlFor="cover-upload"
            className={`px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
              uploaded
                ? "bg-steam-darker text-gray-500 cursor-not-allowed"
                : "bg-steam-blue hover:bg-steam-blueLight text-white"
            }`}
          >
            {coverPreview ? "Trocar Imagem" : "Selecionar Imagem"}
          </label>
          <button
            onClick={handleUpload}
            disabled={!coverImage || uploaded}
            className="px-6 py-3 bg-steam-green hover:bg-steam-green/80 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploaded ? "Enviado ✓" : "Enviar Capa"}
          </button>
        </div>
      </div>

      {/* GDD Mini */}
      <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="w-6 h-6" />
            GDD Mini - Descrição da Capa
          </h3>
          {gddDownloaded && (
            <div className="flex items-center gap-2 text-steam-green">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Baixado +50 XP</span>
            </div>
          )}
        </div>
        <textarea
          value={gddDescription}
          onChange={(e) => setGddDescription(e.target.value)}
          placeholder="Descreva sua capa 3D: objetos modelados, texturas usadas, tema visual..."
          rows={6}
          className="w-full bg-steam-dark border border-steam-blue rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight resize-y mb-4"
        />
        <button
          onClick={handleDownloadGDD}
          disabled={gddDescription.trim().length === 0 || gddDownloaded}
          className="px-6 py-3 bg-steam-blueLight hover:bg-steam-blue text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {gddDownloaded ? "GDD Baixado ✓" : "Gerar e Baixar GDD Mini"}
        </button>
      </div>

      {/* Conclusão */}
      {canComplete && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-steam-blueLight to-steam-green text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Concluir Modelagem e Avançar →
          </button>
        </div>
      )}
    </div>
  );
}

