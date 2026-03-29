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

## Relação com o Código C#

### Classes Implementadas:
- **Player**: Classe com propriedades x, y e método Move() para movimentação controlada
- **Enemy**: Classe com método Update() para movimento automático
- **GameObject**: Classe base para herança (se aplicável)
- **Sistema de Colisão**: Função CheckCollision() para detecção de colisão

### Objetos 3D Modelados:
Os objetos modelados no Blender representam visualmente as classes criadas em C#:
- Objeto Player → Classe Player (exercícios 11-12)
- Objeto Enemy → Classe Enemy (exercício 13)
- Interação visual → Sistema de colisão (exercício 15)

## Técnicas Utilizadas
- Modelagem 3D no Blender
- Texturização e materiais
- Iluminação e renderização
- Composição visual para capa de jogo

## Tempo de Produção
${Math.floor(timeElapsed / 60)} minutos

## Data de Criação
${new Date().toLocaleDateString("pt-BR")}

## Notas do Desenvolvedor
Esta capa representa visualmente o protótipo codificado em C#, mostrando os objetos que foram programados para se moverem e interagirem no jogo.
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
        <h2 className="text-3xl font-bold text-senai-orange mb-2 flex items-center gap-3">
          <Boxes className="w-8 h-8" />
          Modelagem Blender
        </h2>
        <p className="text-gray-300 mb-3">
          Crie uma capa 3D para seu protótipo usando Blender. Tempo sugerido: 45 minutos.
        </p>
        <div className="bg-gradient-to-r from-senai-blue/20 to-senai-blueLight/20 border border-senai-orange rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-400 font-bold text-lg">🎯</span>
            <div>
              <p className="text-senai-orange font-semibold mb-2">Objetivo desta seção:</p>
              <p className="text-gray-300 text-sm mb-2">
                A capa 3D que você criar no Blender é para <strong className="text-senai-blueLight">revisar conceitos de modelagem e criar a capa visual</strong> do seu projeto. 
                Esta capa será usada na seção de Publicação para representar visualmente o trabalho desenvolvido.
              </p>
              <p className="text-gray-300 text-sm">
                <strong className="text-senai-orange">Lembre-se:</strong> A capa deve representar visualmente os objetos que você programou em C# (Player, Enemy, etc.). 
                Ela será anexada junto com o código na publicação final desta unidade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-senai-dark border border-senai-blue rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-senai-orange" />
            <span className="text-white font-semibold">Tempo decorrido:</span>
            <span
              className={`text-2xl font-bold ${
                timeElapsed > 45 * 60 ? "text-red-400" : "text-senai-blueLight"
              }`}
            >
              {formatTime(timeElapsed)}
            </span>
          </div>
          {!timerStarted && (
            <button
              onClick={() => setTimerStarted(true)}
              className="px-4 py-2 bg-senai-blueLight hover:bg-senai-blueLight/80 text-white rounded-lg font-semibold transition-colors"
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
      <div className="bg-senai-dark border border-senai-blue rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Guia Passo a Passo - Modelagem para Jogo</h3>
        <div className="bg-senai-blue/10 border border-senai-orange rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 font-bold">🎯 Objetivo:</span>
            <span className="text-white font-semibold">Criar objetos 3D que serão controlados pelo código C# desenvolvido na prática guiada</span>
          </div>
          <p className="text-gray-300 text-sm">
            Os objetos que você modelar aqui serão os mesmos que você programou para se moverem nos exercícios 11-15 de C#. 
            Pense neles como o visual do seu jogo!
          </p>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <div className="flex gap-4">
            <span className="font-bold text-senai-orange">1.</span>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Crie um novo projeto no Blender e configure a cena</p>
              <p className="text-sm text-gray-400">- Abra o Blender e delete o cubo padrão (X → Delete)</p>
              <p className="text-sm text-gray-400">- Configure a resolução de render para 1920x1080 (Properties → Render Properties)</p>
              <p className="text-sm text-gray-400">- Ajuste a câmera para uma visão frontal ou isométrica</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <span className="font-bold text-senai-orange">2.</span>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Modele o PERSONAGEM PRINCIPAL (Player)</p>
              <p className="text-sm text-gray-400">- Crie um objeto que represente seu jogador (pode ser um cubo estilizado, uma esfera, ou uma forma personalizada)</p>
              <p className="text-sm text-gray-400">- Este objeto será controlado pelo código da classe Player que você criou nos exercícios 11-12</p>
              <p className="text-sm text-gray-400">- Posicione-o no centro da cena (posição inicial: x=0, y=0)</p>
              <p className="text-sm text-gray-400">- Dica: Use cores vibrantes para destacar o personagem principal</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <span className="font-bold text-senai-orange">3.</span>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Modele um INIMIGO ou OBJETO EM MOVIMENTO (Enemy)</p>
              <p className="text-sm text-gray-400">- Crie um objeto diferente do personagem (pode ser um cubo menor, uma pirâmide, ou outra forma)</p>
              <p className="text-sm text-gray-400">- Este objeto será controlado pelo código da classe Enemy do exercício 13</p>
              <p className="text-sm text-gray-400">- Posicione-o à direita da cena (será movido automaticamente pelo método Update())</p>
              <p className="text-sm text-gray-400">- Dica: Use cores diferentes do personagem para criar contraste visual</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <span className="font-bold text-senai-orange">4.</span>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Adicione texturas e materiais</p>
              <p className="text-sm text-gray-400">- Aplique materiais diferentes para cada objeto (Player e Enemy)</p>
              <p className="text-sm text-gray-400">- Use cores contrastantes para facilitar a identificação</p>
              <p className="text-sm text-gray-400">- Experimente com brilho (Metallic) e rugosidade (Roughness) nos materiais</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <span className="font-bold text-senai-orange">5.</span>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Configure iluminação e ambiente</p>
              <p className="text-sm text-gray-400">- Adicione uma luz principal (Sun ou Area Light) para iluminar os objetos</p>
              <p className="text-sm text-gray-400">- Configure um ambiente neutro (pode ser um plano de fundo simples ou gradiente)</p>
              <p className="text-sm text-gray-400">- Ajuste a câmera para capturar todos os objetos em uma composição interessante</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <span className="font-bold text-senai-orange">6.</span>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Renderize a imagem final</p>
              <p className="text-sm text-gray-400">- Configure o formato de saída como PNG (Properties → Output Properties)</p>
              <p className="text-sm text-gray-400">- Resolução recomendada: 1920x1080 (Full HD)</p>
              <p className="text-sm text-gray-400">- Renderize a imagem (F12 ou Render → Render Image)</p>
              <p className="text-sm text-gray-400">- Salve a imagem renderizada (Image → Save As)</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-senai-blueLight/10 border border-senai-blueLight rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-senai-blueLight font-bold text-lg">💡</span>
            <div>
              <p className="text-senai-blueLight font-semibold mb-2">Ligação com a Prática C#:</p>
              <p className="text-gray-300 text-sm mb-2">
                Os objetos que você modelar aqui representam visualmente as classes que você criou nos exercícios de C#:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm ml-4">
                <li><strong>Objeto Player:</strong> Representa a classe Player com propriedades x, y e método Move()</li>
                <li><strong>Objeto Enemy:</strong> Representa a classe Enemy com método Update() para movimento automático</li>
                <li><strong>Colisão:</strong> Quando os objetos se tocarem na renderização, isso representa a detecção de colisão do exercício 15</li>
              </ul>
              <p className="text-gray-300 text-sm mt-2">
                <strong>Dica:</strong> Pense na capa como uma "foto" do seu jogo em ação, mostrando os objetos que você programou para se moverem!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload da Capa */}
      <div className="bg-senai-dark border border-senai-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Upload da Capa 3D
          </h3>
          {uploaded && (
            <div className="flex items-center gap-2 text-senai-blueLight">
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
              className="w-full max-w-md mx-auto rounded-lg border-2 border-senai-blue"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-senai-blue rounded-lg p-8 text-center mb-4">
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
                ? "bg-senai-dark text-gray-500 cursor-not-allowed"
                : "bg-senai-blue hover:bg-senai-orange text-white"
            }`}
          >
            {coverPreview ? "Trocar Imagem" : "Selecionar Imagem"}
          </label>
          <button
            onClick={handleUpload}
            disabled={!coverImage || uploaded}
            className="px-6 py-3 bg-senai-blueLight hover:bg-senai-blueLight/80 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploaded ? "Enviado ✓" : "Enviar Capa"}
          </button>
        </div>
      </div>

      {/* GDD Mini */}
      <div className="bg-senai-dark border border-senai-blue rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="w-6 h-6" />
            GDD Mini - Descrição da Capa
          </h3>
          {gddDownloaded && (
            <div className="flex items-center gap-2 text-senai-blueLight">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Baixado +50 XP</span>
            </div>
          )}
        </div>
        <div className="mb-3 bg-senai-blue/10 border border-senai-blue rounded-lg p-3">
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-senai-orange">Dica:</strong> Descreva os objetos que você modelou e como eles se relacionam com o código C# que você desenvolveu:
          </p>
          <ul className="text-xs text-gray-400 list-disc list-inside space-y-1 ml-2">
            <li>Qual objeto representa o Player? (exercícios 11-12)</li>
            <li>Qual objeto representa o Enemy? (exercício 13)</li>
            <li>Como você visualizou o movimento desses objetos?</li>
            <li>Quais texturas e materiais você usou?</li>
            <li>Como a capa representa o conceito do seu jogo?</li>
          </ul>
        </div>
        <textarea
          value={gddDescription}
          onChange={(e) => setGddDescription(e.target.value)}
          placeholder="Descreva sua capa 3D detalhadamente:&#10;&#10;1. Objetos modelados (Player, Enemy) e suas características visuais&#10;2. Como esses objetos se relacionam com as classes C# criadas (Player, Enemy, GameObject)&#10;3. Texturas e materiais utilizados&#10;4. Tema visual e conceito do jogo&#10;5. Como a capa representa o movimento e interação programados no código..."
          rows={8}
          className="w-full bg-senai-blueDark border border-senai-blue rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange resize-y mb-4"
        />
        <button
          onClick={handleDownloadGDD}
          disabled={gddDescription.trim().length === 0 || gddDownloaded}
          className="px-6 py-3 bg-senai-orange hover:bg-senai-blue text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {gddDownloaded ? "GDD Baixado ✓" : "Gerar e Baixar GDD Mini"}
        </button>
      </div>

      {/* Conclusão */}
      {canComplete && (
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-gradient-to-r from-senai-orange to-senai-blueLight text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            Concluir Modelagem e Avançar →
          </button>
        </div>
      )}
    </div>
  );
}

