"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Game } from "@/lib/games";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { authedFetch } from "@/lib/client-auth";

export default function EditGamePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isTeacher, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [game, setGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    trailerUrl: "",
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

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

  useEffect(() => {
    // Aguarda a hidratação da sessão antes de redirecionar/buscar.
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadGame();
  }, [params.id, isAuthenticated, authLoading, router]);

  const loadGame = async () => {
    try {
      // authedFetch permite que autor/staff vejam jogos pendentes.
      const response = await authedFetch(`/api/games/${params.id}`);
      if (response.ok) {
        const data: Game = await response.json();
        
        // Verificar se o usuário é o autor ou staff (papel efetivo do servidor).
        const isOwner =
          data.authorUid === user?.id || data.authorEmail === user?.email;
        if (!isOwner && !isTeacher) {
          showToast("Você não tem permissão para editar este jogo", "error");
          router.push(`/games/${params.id}`);
          return;
        }

        setGame(data);
        setFormData({
          title: data.title,
          description: data.description,
          trailerUrl: data.trailerUrl || "",
        });
        setSelectedGenres(data.genres);
        setSelectedTechnologies(data.technologies);
        if (data.image) {
          setImagePreview(data.image);
        }
        if (data.screenshots && data.screenshots.length > 0) {
          setScreenshotPreviews(data.screenshots);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("Por favor, selecione uma imagem", "warning");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGenres.length === 0) {
      alert("Selecione pelo menos um gênero");
      return;
    }

    if (selectedTechnologies.length === 0) {
      alert("Selecione pelo menos uma tecnologia");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = game?.image || "";

      // Upload da nova imagem se houver
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("type", "image");

        const imageUploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (imageUploadResponse.ok) {
          const imageData = await imageUploadResponse.json();
          imageUrl = imageData.path;
        }
      }

      // Upload de novos screenshots se houver
      let screenshotUrls = game?.screenshots || [];
      if (screenshotFiles.length > 0) {
        const newScreenshotUrls: string[] = [];
        for (const file of screenshotFiles) {
          const screenshotFormData = new FormData();
          screenshotFormData.append("file", file);
          screenshotFormData.append("type", "image");

          const screenshotUploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: screenshotFormData,
          });

          if (screenshotUploadResponse.ok) {
            const screenshotData = await screenshotUploadResponse.json();
            newScreenshotUrls.push(screenshotData.path);
          }
        }
        screenshotUrls = [...screenshotUrls, ...newScreenshotUrls];
      }

      // Atualizar jogo
      const response = await authedFetch(`/api/games/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          genres: selectedGenres,
          technologies: selectedTechnologies,
          trailerUrl: formData.trailerUrl || undefined,
          image: imageUrl || undefined,
          screenshots: screenshotUrls.length > 0 ? screenshotUrls : undefined,
        }),
      });

      if (response.ok) {
        showToast("Jogo atualizado com sucesso!", "success");
        setTimeout(() => {
          router.push(`/games/${params.id}`);
        }, 1000);
      } else if (response.status === 401 || response.status === 403) {
        showToast("Você não tem permissão para editar este jogo", "error");
      } else {
        throw new Error("Erro ao atualizar jogo");
      }
    } catch (error) {
      showToast("Erro ao atualizar jogo", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-senai-orange mx-auto" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-xl">Jogo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-senai-orange">
        Editar Jogo
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Informações Básicas
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-senai-orange mb-2">
                Título do Jogo *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white focus:outline-none focus:border-senai-orange"
              />
            </div>

            <div>
              <label className="block text-senai-orange mb-2">
                Descrição *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={5}
                className="w-full bg-senai-dark border border-senai-blue rounded px-4 py-2 text-white focus:outline-none focus:border-senai-orange"
              />
            </div>
          </div>
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Gêneros *</h2>
          <div className="flex flex-wrap gap-2">
            {availableGenres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreToggle(genre)}
                className={`px-4 py-2 rounded transition ${
                  selectedGenres.includes(genre)
                    ? "bg-senai-orange text-slate-950"
                    : "bg-senai-dark text-gray-300 hover:bg-senai-blue"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Tecnologias *</h2>
          <div className="flex flex-wrap gap-2">
            {availableTechnologies.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechnologyToggle(tech)}
                className={`px-4 py-2 rounded transition ${
                  selectedTechnologies.includes(tech)
                    ? "bg-senai-blueLight text-slate-950"
                    : "bg-senai-dark text-gray-300 hover:bg-senai-blue"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-senai-blueDark rounded-lg p-6">
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
                  className="w-full h-64 object-cover rounded border border-senai-blue"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(game?.image || null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Remover Nova Imagem
                </button>
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
                    Clique para trocar a imagem
                  </p>
                </label>
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
            {screenshotPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {screenshotPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-32 object-cover rounded border border-senai-blue"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPreviews = screenshotPreviews.filter((_, i) => i !== index);
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
            <div className="border-2 border-dashed border-senai-blue rounded p-8 text-center">
              <input
                type="file"
                id="screenshots-files-edit"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length + screenshotPreviews.length > 5) {
                    showToast("Máximo de 5 screenshots permitido", "warning");
                    return;
                  }
                  setScreenshotFiles([...screenshotFiles, ...files]);
                  
                  // Criar previews
                  files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setScreenshotPreviews((prev) => [...prev, reader.result as string]);
                    };
                    reader.readAsDataURL(file);
                  });
                }}
                className="hidden"
              />
              <label
                htmlFor="screenshots-files-edit"
                className="cursor-pointer flex flex-col items-center"
              >
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-2">
                  Clique para adicionar screenshots
                </p>
                <p className="text-gray-400 text-sm">
                  Máximo 5 imagens (JPG, PNG, GIF)
                </p>
              </label>
            </div>
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
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-senai-orange hover:bg-senai-blue disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 hover:text-white px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

