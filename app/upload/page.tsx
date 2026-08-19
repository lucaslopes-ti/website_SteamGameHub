"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, FileText, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { authedFetch } from "@/lib/client-auth";

export default function UploadPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    authorEmail: "",
    trailerUrl: "",
    downloadLink: "", // Link alternativo do Google Drive ou outro serviço
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const availableGenres = [
    "Aventura",
    "Corrida",
    "Puzzle",
    "Ação",
    "Simulação",
    "RPG",
    "Exploração",
    "Survival",
    "Estratégia",
    "Fantasia",
  ];

  const availableTechnologies = [
    "Unity",
    "Unreal Engine",
    "Godot",
    "GameMaker Studio",
    "RPG Maker",
    "Construct",
    "Outro",
  ];

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleTechnologyToggle = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      setSelectedTechnologies(selectedTechnologies.filter((t) => t !== tech));
    } else {
      setSelectedTechnologies([...selectedTechnologies, tech]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Bloqueado temporariamente: envio de arquivo executável desativado
    e.target.value = "";
    showToast("Envio de arquivo executável temporariamente desativado. Use o link do Google Drive.", "warning");
    return;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Por favor, selecione uma imagem", "warning");
        return;
      }
      setImageFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Temporariamente, apenas link externo é aceito
    if (!formData.downloadLink) {
      showToast("Por favor, forneça o link do Google Drive/OneDrive/Dropbox do seu jogo", "warning");
      return;
    }

    // Se forneceu link do Google Drive, validar URL
    if (formData.downloadLink && !selectedFile) {
      try {
        new URL(formData.downloadLink);
      } catch {
        showToast("Link do Google Drive inválido. Verifique a URL.", "error");
        return;
      }
    }

    if (selectedGenres.length === 0) {
      showToast("Selecione pelo menos um gênero", "warning");
      return;
    }

    if (selectedTechnologies.length === 0) {
      showToast("Selecione pelo menos uma tecnologia", "warning");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

      try {
      let uploadData: { url: string; path: string; fileName: string } | null = null;
      let executableFileName = "";
      let executableFileSize = 0;

      // Se forneceu link do Google Drive, usar ele (não fazer upload)
      if (formData.downloadLink && !selectedFile) {
        // Usar link externo - não precisa fazer upload
        // Validar que o link é do Google Drive ou um serviço conhecido
        const drivePattern = /drive\.google\.com|onedrive\.live\.com|dropbox\.com|mega\.nz/i;
        if (!drivePattern.test(formData.downloadLink)) {
          throw new Error("Link inválido. Use Google Drive, OneDrive, Dropbox ou MEGA.");
        }
        executableFileName = "Arquivo externo (Google Drive/OneDrive/etc)";
        executableFileSize = 0; // Tamanho desconhecido
        uploadData = null;
        setUploadProgress(40);
      }

      // Upload da imagem de capa (se houver)
      // Nota: Em produção (Vercel), usamos apenas API route devido a problemas de CORS com upload direto
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        try {
          const imageFormData = new FormData();
          imageFormData.append("file", imageFile);
          imageFormData.append("type", "image");

          const imageController = new AbortController();
          const imageTimeoutId = setTimeout(() => imageController.abort(), 60 * 1000); // 1 minuto para imagens

          const imageUploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: imageFormData,
            signal: imageController.signal,
          }).finally(() => clearTimeout(imageTimeoutId));

          if (imageUploadResponse.ok) {
            const imageData = await imageUploadResponse.json();
            imageUrl = imageData.url || imageData.path;
            console.log("Imagem enviada via API:", imageUrl);
          } else {
            const errorText = await imageUploadResponse.text();
            console.error("Erro ao fazer upload da imagem via API:", imageUploadResponse.status, errorText);
            // Continuar sem imagem se o upload falhar
            showToast("Aviso: Falha ao enviar imagem de capa. O jogo será criado sem imagem.", "warning");
          }
        } catch (imageError: any) {
          console.error("Erro ao fazer upload da imagem:", imageError);
          // Continuar sem imagem se o upload falhar
          imageUrl = undefined;
          // Não bloquear o processo, mas avisar o usuário
          showToast("Aviso: Falha ao enviar imagem de capa. O jogo será criado sem imagem.", "warning");
        }
      }

      setUploadProgress(60);

      // Upload de screenshots (múltiplos)
      // Nota: Em produção (Vercel), usamos apenas API route devido a problemas de CORS com upload direto
      const screenshotUrls: string[] = [];
      for (let i = 0; i < screenshotFiles.length; i++) {
        try {
          const screenshotFormData = new FormData();
          screenshotFormData.append("file", screenshotFiles[i]);
          screenshotFormData.append("type", "image");

          const screenshotController = new AbortController();
          const screenshotTimeoutId = setTimeout(() => screenshotController.abort(), 60 * 1000);

          const screenshotUploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: screenshotFormData,
            signal: screenshotController.signal,
          }).finally(() => clearTimeout(screenshotTimeoutId));

          if (screenshotUploadResponse.ok) {
            const screenshotData = await screenshotUploadResponse.json();
            const url = screenshotData.url || screenshotData.path;
            if (url) {
              screenshotUrls.push(url);
            }
          } else {
            console.error(`Erro ao fazer upload do screenshot ${i + 1} via API:`, screenshotUploadResponse.status);
            // Continuar mesmo se um screenshot falhar
          }
        } catch (screenshotError: any) {
          console.error(`Erro ao fazer upload do screenshot ${i + 1}:`, screenshotError);
          // Continuar mesmo se um screenshot falhar
        }
        setUploadProgress(60 + (i + 1) * (20 / screenshotFiles.length));
      }

      setUploadProgress(85);

      // Criar registro do jogo (com timeout)
      const gameController = new AbortController();
      const gameTimeoutId = setTimeout(() => gameController.abort(), 60 * 1000);
      const gameResponse = await authedFetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: gameController.signal,
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          author: formData.author,
          authorEmail: formData.authorEmail,
          genres: selectedGenres,
          technologies: selectedTechnologies,
          trailerUrl: formData.trailerUrl || undefined,
          executableFile: undefined,
          executableFileName: executableFileName || (formData.downloadLink ? "Arquivo externo (Google Drive/OneDrive/etc)" : undefined),
          executableFileSize: executableFileSize || 0,
          downloadLink: formData.downloadLink || undefined, // Link do Google Drive se fornecido
          image: imageUrl || undefined,
          screenshots: screenshotUrls.length > 0 ? screenshotUrls : undefined,
        }),
      }).finally(() => clearTimeout(gameTimeoutId));

      if (!gameResponse.ok) {
        let errorMessage = "Erro ao criar registro do jogo";
        try {
          const contentType = gameResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const error = await gameResponse.json();
            errorMessage = error.error || errorMessage;
          } else {
            errorMessage = await gameResponse.text() || errorMessage;
          }
        } catch (parseError) {
          errorMessage = `Erro ${gameResponse.status}: ${gameResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setUploadProgress(100);

      showToast("Jogo enviado com sucesso! Aguarde aprovação do professor.", "success");
      setTimeout(() => {
        router.push("/games");
      }, 1500);
    } catch (error: any) {
      console.error("Erro no upload:", error);
      
      // Tratamento específico para diferentes tipos de erro
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        showToast("Upload cancelado por timeout. Tente novamente com um arquivo menor ou verifique sua conexão.", "error");
      } else if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
        showToast("Erro de conexão. Verifique sua internet e tente novamente.", "error");
      } else if (error.message) {
        showToast(`Erro: ${error.message}`, "error");
      } else {
        showToast("Erro ao fazer upload. Tente novamente.", "error");
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-senai-orange">
        Enviar Novo Jogo
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Informações Básicas
          </h2>

          <div className="space-y-4">
            <div>
                <label htmlFor="game-title" className="block text-senai-orange mb-2">
                  Título do Jogo *
                </label>
                <input
                  id="game-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange"
                  placeholder="Digite o título do seu jogo"
                  aria-describedby="title-description"
                  aria-required="true"
                />
                <span id="title-description" className="sr-only">
                  O título deve ter pelo menos 3 caracteres
                </span>
              </div>

              <div>
                <label htmlFor="game-description" className="block text-senai-orange mb-2">
                  Descrição *
                </label>
                <textarea
                  id="game-description"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={5}
                  className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange resize-y"
                  placeholder="Descreva seu jogo, mecânicas principais, objetivo, etc."
                  aria-describedby="description-description"
                  aria-required="true"
                />
                <span id="description-description" className="sr-only">
                  A descrição deve ter pelo menos 10 caracteres
                </span>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author-name" className="block text-senai-orange mb-2">
                  Seu Nome *
                </label>
                <input
                  id="author-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange"
                  placeholder="Seu nome completo"
                  aria-describedby="author-description"
                  aria-required="true"
                />
                <span id="author-description" className="sr-only">
                  Digite seu nome completo
                </span>
              </div>

              <div>
                <label htmlFor="author-email" className="block text-senai-orange mb-2">
                  E-mail *
                </label>
                <input
                  id="author-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.authorEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, authorEmail: e.target.value })
                  }
                  className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange"
                  placeholder="seu@email.com"
                  aria-describedby="email-description"
                  aria-required="true"
                />
                <span id="email-description" className="sr-only">
                  Digite um endereço de e-mail válido
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white" id="genres-heading">Gêneros *</h2>
          <div 
            className="flex flex-wrap gap-2" 
            role="group" 
            aria-labelledby="genres-heading"
            aria-describedby="genres-description"
          >
            <span id="genres-description" className="sr-only">
              Selecione pelo menos um gênero para o seu jogo. Pressione Espaço ou Enter para selecionar ou desselecionar.
            </span>
            {availableGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleGenreToggle(genre);
                  }
                }}
                aria-pressed={selectedGenres.includes(genre)}
                aria-label={`${selectedGenres.includes(genre) ? "Selecionado" : "Não selecionado"}: ${genre}`}
                className={`px-4 py-2 rounded transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-orange focus-visible:outline-offset-2 ${
                  selectedGenres.includes(genre)
                    ? "bg-senai-orange text-slate-950"
                    : "bg-senai-dark text-gray-300 hover:bg-senai-blue"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          {selectedGenres.length === 0 && (
            <p className="text-yellow-400 text-sm mt-2" role="alert" aria-live="polite">
              Selecione pelo menos um gênero
            </p>
          )}
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white" id="technologies-heading">Tecnologias *</h2>
          <div 
            className="flex flex-wrap gap-2" 
            role="group" 
            aria-labelledby="technologies-heading"
            aria-describedby="technologies-description"
          >
            <span id="technologies-description" className="sr-only">
              Selecione pelo menos uma tecnologia usada no desenvolvimento do jogo. Pressione Espaço ou Enter para selecionar ou desselecionar.
            </span>
            {availableTechnologies.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechnologyToggle(tech)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleTechnologyToggle(tech);
                  }
                }}
                aria-pressed={selectedTechnologies.includes(tech)}
                aria-label={`${selectedTechnologies.includes(tech) ? "Selecionado" : "Não selecionado"}: ${tech}`}
                className={`px-4 py-2 rounded transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-senai-blueLight focus-visible:outline-offset-2 ${
                  selectedTechnologies.includes(tech)
                    ? "bg-senai-blueLight text-slate-950"
                    : "bg-senai-dark text-gray-300 hover:bg-senai-blue"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
          {selectedTechnologies.length === 0 && (
            <p className="text-yellow-400 text-sm mt-2" role="alert" aria-live="polite">
              Selecione pelo menos uma tecnologia
            </p>
          )}
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Arquivo Executável do Jogo (temporariamente indisponível)
          </h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-senai-blue rounded p-8 text-center">
              <input
                type="file"
                id="executable-file"
                accept=".exe,.zip,.rar,.7z,.app,.dmg"
                onChange={handleFileChange}
                className="hidden"
                disabled
              />
              <label
                htmlFor="executable-file"
                className="flex flex-col items-center opacity-60 cursor-not-allowed"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-2">
                  Envio de arquivo executável será liberado em breve
                </p>
                <p className="text-gray-400 text-sm">
                  Por enquanto, envie o link do Google Drive/OneDrive/Dropbox
                </p>
              </label>
            </div>
            {/* Se voltar a habilitar, mostrar o bloco de arquivo selecionado */}
            <div className="mt-4 pt-4 border-t border-senai-blue">
              <p className="text-gray-400 text-sm mb-2 text-center">
                Envie o link do Google Drive/OneDrive/Dropbox do seu jogo (obrigatório)
              </p>
              <label htmlFor="download-link" className="sr-only">
                Link de download do jogo (Google Drive, OneDrive, Dropbox, etc.)
              </label>
              <input
                id="download-link"
                type="url"
                value={formData.downloadLink}
                onChange={(e) =>
                  setFormData({ ...formData, downloadLink: e.target.value })
                }
                placeholder="https://drive.google.com/file/d/..."
                className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-senai-orange focus-visible:ring-2 focus-visible:ring-senai-orange"
                required
                aria-describedby="download-link-description"
                aria-required="true"
              />
              <p id="download-link-description" className="text-gray-500 text-xs mt-1">
                Se você já enviou o arquivo para Google Drive, cole o link compartilhado aqui (compartilhe como "Qualquer pessoa com o link")
              </p>
            </div>
          </div>
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Imagem de Capa (Opcional)
          </h2>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Preview da imagem de capa"
                  className="w-full h-64 object-cover rounded-lg border-2 border-senai-orange shadow-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition transform hover:scale-110"
                  aria-label="Remover imagem"
                >
                  <X className="w-5 h-5" />
                </button>
                {imageFile && (
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded backdrop-blur-sm">
                    {formatFileSize(imageFile.size)}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-senai-blue rounded p-8 text-center">
                <input
                  type="file"
                  id="image-file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-file"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-300 mb-2">
                    Clique para selecionar uma imagem
                  </p>
                  <p className="text-gray-400 text-sm">
                    Formatos: JPG, PNG, GIF (recomendado: 1280x720px)
                  </p>
                </label>
              </div>
            )}
            {imageFile && !imagePreview && (
              <div className="bg-senai-dark rounded p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-senai-blueLight" />
                  <div>
                    <p className="text-white font-semibold">{imageFile.name}</p>
                    <p className="text-gray-400 text-sm">
                      {formatFileSize(imageFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Screenshots do Jogo (Opcional)
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Adicione até 5 screenshots para mostrar seu jogo em ação
          </p>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-senai-blue rounded p-8 text-center">
              <input
                type="file"
                id="screenshots-files"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 5) {
                    showToast("Máximo de 5 screenshots permitido", "warning");
                    return;
                  }
                  setScreenshotFiles(files);
                  
                  // Criar previews
                  const previews: string[] = [];
                  files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      previews.push(reader.result as string);
                      if (previews.length === files.length) {
                        setScreenshotPreviews(previews);
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }}
                className="hidden"
              />
              <label
                htmlFor="screenshots-files"
                className="cursor-pointer flex flex-col items-center"
              >
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-2">
                  Clique para selecionar screenshots
                </p>
                <p className="text-gray-400 text-sm">
                  Máximo 5 imagens (JPG, PNG, GIF)
                </p>
              </label>
            </div>
            {screenshotPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {screenshotPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Screenshot ${index + 1} do jogo`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-senai-blue shadow-md group-hover:border-senai-orange transition-all"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = screenshotFiles.filter((_, i) => i !== index);
                        const newPreviews = screenshotPreviews.filter((_, i) => i !== index);
                        setScreenshotFiles(newFiles);
                        setScreenshotPreviews(newPreviews);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 shadow-lg"
                      aria-label={`Remover screenshot ${index + 1}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {screenshotFiles[index] && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm text-[10px]">
                        {formatFileSize(screenshotFiles[index].size)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Trailer do Jogo (Opcional)
          </h2>
          <input
            type="url"
            value={formData.trailerUrl}
            onChange={(e) =>
              setFormData({ ...formData, trailerUrl: e.target.value })
            }
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white focus:outline-none focus:border-senai-orange"
          />
          <p className="text-gray-400 text-sm mt-2">
            Cole o link do YouTube ou Vimeo do trailer do seu jogo
          </p>
        </div>

        {loading && (
          <div className="bg-senai-blueDark rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-senai-orange" />
              <div className="flex-1">
                <p className="text-white mb-2">Enviando jogo...</p>
                <div className="w-full bg-senai-dark rounded-full h-2">
                  <div
                    className="bg-senai-orange h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-senai-orange hover:bg-senai-blue disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 hover:text-white px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Enviar para Aprovação
              </>
            )}
          </button>
        </div>

        <p className="text-gray-400 text-sm text-center">
          * Campos obrigatórios. Seu jogo será revisado por um professor antes
          de ser publicado.
        </p>
      </form>
    </div>
  );
}
