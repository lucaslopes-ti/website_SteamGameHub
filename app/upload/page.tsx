"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, FileText, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

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
    const file = e.target.files?.[0];
    if (file) {
      // Validar extensão
      const allowedExtensions = [".exe", ".zip", ".rar", ".7z", ".app", ".dmg"];
      const fileName = file.name.toLowerCase();
      const isValid = allowedExtensions.some((ext) => fileName.endsWith(ext));

      if (!isValid) {
        showToast("Formato não permitido. Use: .exe, .zip, .rar, .7z, .app, .dmg", "error");
        return;
      }

      // Validar tamanho (500MB)
      if (file.size > 500 * 1024 * 1024) {
        showToast("Arquivo muito grande. Tamanho máximo: 500MB", "error");
        return;
      }

      setSelectedFile(file);
    }
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
    
    if (!selectedFile) {
      showToast("Por favor, selecione o arquivo executável do jogo", "warning");
      return;
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
      // Validação de arquivo
      const allowedExtensions = [".exe", ".zip", ".rar", ".7z", ".app", ".dmg"];
      const fileExtension = "." + selectedFile.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error(`Formato não permitido. Use: ${allowedExtensions.join(", ")}`);
      }
      
      if (selectedFile.size > 500 * 1024 * 1024) {
        throw new Error("Arquivo muito grande. Tamanho máximo: 500MB");
      }

      let uploadData: { url: string; path: string; fileName: string };

      // Verificar se deve usar upload direto para Firebase (para arquivos grandes)
      const shouldUseDirect = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET && 
                               process.env.ENABLE_LOCAL_STORAGE !== "true";

      if (shouldUseDirect && selectedFile.size > 10 * 1024 * 1024) {
        // Upload direto para Firebase (sem passar pelo servidor)
        setUploadProgress(10);
        const { uploadToFirebaseDirect } = await import("@/lib/client-upload");
        uploadData = await uploadToFirebaseDirect(selectedFile, "executable");
        setUploadProgress(40);
      } else {
        // Upload via servidor (para arquivos pequenos ou modo local)
        const executableFormData = new FormData();
        executableFormData.append("file", selectedFile);
        executableFormData.append("type", "executable");

        // Timeout de 5 minutos (300s) para arquivos grandes
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: executableFormData,
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));

        if (!uploadResponse.ok) {
          // Tentar ler como JSON, mas tratar caso seja texto/HTML
          let errorMessage = "Erro ao fazer upload do arquivo";
          try {
            const contentType = uploadResponse.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const error = await uploadResponse.json();
              errorMessage = error.error || errorMessage;
            } else {
              // Se não for JSON, ler como texto
              const text = await uploadResponse.text();
              errorMessage = text || errorMessage;
              // Tentar extrair mensagem de erro comum
              if (text.includes("Request Entity Too Large") || text.includes("413")) {
                errorMessage = "Arquivo muito grande para upload via servidor. Use um arquivo menor ou tente novamente.";
              } else if (text.includes("Request timeout") || text.includes("504")) {
                errorMessage = "Timeout no upload. Tente com um arquivo menor ou verifique sua conexão.";
              }
            }
          } catch (parseError) {
            errorMessage = `Erro ${uploadResponse.status}: ${uploadResponse.statusText}`;
          }
          throw new Error(errorMessage);
        }

        uploadData = await uploadResponse.json();
        setUploadProgress(40);
      }

      // Upload da imagem de capa (se houver)
      let imageUrl = "";
      if (imageFile) {
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
          imageUrl = imageData.path;
        }
      }

      setUploadProgress(60);

      // Upload de screenshots (múltiplos)
      const screenshotUrls: string[] = [];
      for (let i = 0; i < screenshotFiles.length; i++) {
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
          screenshotUrls.push(screenshotData.path);
        }
        setUploadProgress(60 + (i + 1) * (20 / screenshotFiles.length));
      }

      setUploadProgress(85);

      // Criar registro do jogo
      const gameResponse = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          author: formData.author,
          authorEmail: formData.authorEmail,
          genres: selectedGenres,
          technologies: selectedTechnologies,
          trailerUrl: formData.trailerUrl || undefined,
          executableFile: uploadData.fileName,
          executableFileName: uploadData.originalFileName,
          executableFileSize: uploadData.fileSize,
          image: imageUrl || undefined,
          screenshots: screenshotUrls.length > 0 ? screenshotUrls : undefined,
        }),
      });

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
      <h1 className="text-4xl font-bold mb-8 text-steam-blueLight">
        Enviar Novo Jogo
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-steam-dark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Informações Básicas
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-steam-blueLight mb-2">
                Título do Jogo *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
              />
            </div>

            <div>
              <label className="block text-steam-blueLight mb-2">
                Descrição *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-steam-blueLight mb-2">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
                />
              </div>

              <div>
                <label className="block text-steam-blueLight mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.authorEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, authorEmail: e.target.value })
                  }
                  className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Gêneros *</h2>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className={`px-4 py-2 rounded transition ${
                  selectedGenres.includes(genre)
                    ? "bg-steam-blueLight text-white"
                    : "bg-steam-darker text-gray-300 hover:bg-steam-blue"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Tecnologias *</h2>
          <div className="flex flex-wrap gap-2">
            {availableTechnologies.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechnologyToggle(tech)}
                className={`px-4 py-2 rounded transition ${
                  selectedTechnologies.includes(tech)
                    ? "bg-steam-green text-white"
                    : "bg-steam-darker text-gray-300 hover:bg-steam-blue"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Arquivo Executável do Jogo *
          </h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-steam-blue rounded p-8 text-center">
              <input
                type="file"
                id="executable-file"
                accept=".exe,.zip,.rar,.7z,.app,.dmg"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="executable-file"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-2">
                  Clique para selecionar o arquivo executável
                </p>
                <p className="text-gray-400 text-sm">
                  Formatos aceitos: .exe, .zip, .rar, .7z, .app, .dmg (máx. 500MB)
                </p>
              </label>
            </div>
            {selectedFile && (
              <div className="bg-steam-darker rounded p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-steam-green" />
                  <div>
                    <p className="text-white font-semibold">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remover
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Imagem de Capa (Opcional)
          </h2>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded border border-steam-blue"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Remover
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-steam-blue rounded p-8 text-center">
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
              <div className="bg-steam-darker rounded p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-steam-green" />
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

        <div className="bg-steam-dark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Screenshots do Jogo (Opcional)
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Adicione até 5 screenshots para mostrar seu jogo em ação
          </p>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-steam-blue rounded p-8 text-center">
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
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-32 object-cover rounded border border-steam-blue"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = screenshotFiles.filter((_, i) => i !== index);
                        const newPreviews = screenshotPreviews.filter((_, i) => i !== index);
                        setScreenshotFiles(newFiles);
                        setScreenshotPreviews(newPreviews);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-steam-dark rounded-lg p-6">
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
            className="w-full bg-steam-darker border border-steam-blue rounded px-4 py-2 text-white focus:outline-none focus:border-steam-blueLight"
          />
          <p className="text-gray-400 text-sm mt-2">
            Cole o link do YouTube ou Vimeo do trailer do seu jogo
          </p>
        </div>

        {loading && (
          <div className="bg-steam-dark rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-steam-blueLight" />
              <div className="flex-1">
                <p className="text-white mb-2">Enviando jogo...</p>
                <div className="w-full bg-steam-darker rounded-full h-2">
                  <div
                    className="bg-steam-blueLight h-2 rounded-full transition-all"
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
            className="flex-1 bg-steam-blueLight hover:bg-steam-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
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
