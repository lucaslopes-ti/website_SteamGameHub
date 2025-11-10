"use client";

import { useState } from "react";
import { Upload, FileText, Image as ImageIcon, Link as LinkIcon, MessageSquare, CheckCircle, Loader2, AlertCircle, Gamepad2 } from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import { getLocalUserId, getLocalUserName } from "@/lib/local-user";

export default function AtividadeMathQuestPage() {
  const { showToast } = useToast();
  const userId = getLocalUserId();
  const userName = getLocalUserName();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    prototypeLink: "",
    gddLink: "",
    comments: "",
  });

  // Estados para arquivos
  const [characterArt, setCharacterArt] = useState<File | null>(null);
  const [characterPreview, setCharacterPreview] = useState<string | null>(null);
  const [scenarioArt, setScenarioArt] = useState<File | null>(null);
  const [scenarioPreview, setScenarioPreview] = useState<string | null>(null);
  const [gddFile, setGddFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (type: "character" | "scenario", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Por favor, selecione uma imagem válida", "warning");
      return;
    }

    if (type === "character") {
      setCharacterArt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCharacterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setScenarioArt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScenarioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aceitar PDF ou documentos
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
      showToast("Por favor, selecione um arquivo PDF ou DOC", "warning");
      return;
    }

    setGddFile(file);
  };

  const validateForm = () => {
    if (!formData.projectTitle.trim()) {
      showToast("Por favor, preencha o título do projeto", "warning");
      return false;
    }

    if (!formData.description.trim() || formData.description.trim().length < 50) {
      showToast("A descrição deve ter pelo menos 50 caracteres", "warning");
      return false;
    }

    if (!characterArt) {
      showToast("Por favor, faça upload da arte do personagem", "warning");
      return false;
    }

    if (!scenarioArt) {
      showToast("Por favor, faça upload da arte do cenário", "warning");
      return false;
    }

    // Validar que pelo menos um método de protótipo foi fornecido
    if (!formData.prototypeLink && !formData.gddLink && !gddFile) {
      showToast("Por favor, forneça um link do protótipo ou um link/arquivo do GDD", "warning");
      return false;
    }

    // Validar que pelo menos um método de GDD foi fornecido
    if (!formData.gddLink && !gddFile) {
      showToast("Por favor, forneça um link do GDD ou faça upload do arquivo", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Upload das imagens
      let characterArtUrl = "";
      let scenarioArtUrl = "";
      let gddFileUrl = "";

      // Upload da arte do personagem
      if (characterArt) {
        const characterFormData = new FormData();
        characterFormData.append("file", characterArt);
        characterFormData.append("type", "image");

        const characterResponse = await fetch("/api/upload", {
          method: "POST",
          body: characterFormData,
        });

        if (characterResponse.ok) {
          const characterData = await characterResponse.json();
          characterArtUrl = characterData.url || characterData.path;
        } else {
          throw new Error("Erro ao fazer upload da arte do personagem");
        }
      }

      // Upload da arte do cenário
      if (scenarioArt) {
        const scenarioFormData = new FormData();
        scenarioFormData.append("file", scenarioArt);
        scenarioFormData.append("type", "image");

        const scenarioResponse = await fetch("/api/upload", {
          method: "POST",
          body: scenarioFormData,
        });

        if (scenarioResponse.ok) {
          const scenarioData = await scenarioResponse.json();
          scenarioArtUrl = scenarioData.url || scenarioData.path;
        } else {
          throw new Error("Erro ao fazer upload da arte do cenário");
        }
      }

      // Upload do GDD (se for arquivo)
      if (gddFile) {
        const gddFormData = new FormData();
        gddFormData.append("file", gddFile);
        gddFormData.append("type", "document");

        const gddResponse = await fetch("/api/upload", {
          method: "POST",
          body: gddFormData,
        });

        if (gddResponse.ok) {
          const gddData = await gddResponse.json();
          gddFileUrl = gddData.url || gddData.path;
        } else {
          // Não bloquear se o upload do GDD falhar, já que pode ter link
          console.warn("Erro ao fazer upload do GDD, mas continuando com link se fornecido");
        }
      }

      // Validar que temos pelo menos um método de GDD
      const validGddLink = formData.gddLink && formData.gddLink.trim() !== "" ? formData.gddLink.trim() : null;
      const validGddFileUrl = gddFileUrl && gddFileUrl.trim() !== "" ? gddFileUrl.trim() : null;
      
      if (!validGddLink && !validGddFileUrl) {
        throw new Error("É necessário fornecer um link do GDD ou fazer upload do arquivo GDD");
      }

      // Salvar submissão
      const submissionData = {
        userId,
        userName,
        projectTitle: formData.projectTitle.trim(),
        description: formData.description.trim(),
        characterArtUrl: characterArtUrl.trim(),
        scenarioArtUrl: scenarioArtUrl.trim(),
        prototypeLink: formData.prototypeLink && formData.prototypeLink.trim() !== "" ? formData.prototypeLink.trim() : null,
        gddLink: validGddLink,
        gddFileUrl: validGddFileUrl,
        comments: formData.comments && formData.comments.trim() !== "" ? formData.comments.trim() : null,
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/atividades/mathquest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        let errorMessage = "Erro ao salvar submissão";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
          if (errorData.suggestion) {
            errorMessage += ` (${errorData.suggestion})`;
          }
        } catch (parseError) {
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setSubmitted(true);
      showToast("Submissão enviada com sucesso! 🎉", "success");
    } catch (error: any) {
      console.error("Erro ao enviar submissão:", error);
      showToast(error.message || "Erro ao enviar submissão. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-steam-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-steam-blue via-steam-blueLight to-steam-green rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Atividade MathQuest - Semana 1</h1>
          </div>
          <p className="text-lg text-gray-200">
            Submissão de Personagem e Cenário para o Jogo 2D MathQuest
          </p>
        </div>

        {/* Instruções */}
        <div className="bg-steam-darker border border-steam-blue rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-steam-blueLight mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Instruções
          </h2>
          <div className="text-gray-300 space-y-2">
            <p>Preencha todos os campos abaixo com as informações do seu projeto MathQuest:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Título do Projeto:</strong> Nome do jogo ou protótipo</li>
              <li><strong>Descrição Resumida:</strong> Conceito do jogo, destacando personagem e cenário</li>
              <li><strong>Arte do Personagem:</strong> Imagem ou ilustração do personagem</li>
              <li><strong>Arte do Cenário:</strong> Imagem do cenário estilo plataforma</li>
              <li><strong>Protótipo:</strong> Link ou arquivo do protótipo inicial</li>
              <li><strong>GDD:</strong> Link ou arquivo do Game Design Document</li>
              <li><strong>Comentários:</strong> Justificativas, desafios ou intenções de design</li>
            </ul>
          </div>
        </div>

        {submitted ? (
          <div className="bg-gradient-to-br from-steam-green/20 to-steam-blue/20 border-2 border-steam-green rounded-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-steam-green mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Submissão Enviada com Sucesso! 🎉</h2>
            <p className="text-gray-300 mb-6">
              Sua atividade foi registrada. O professor receberá sua submissão para análise e feedback.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  projectTitle: "",
                  description: "",
                  prototypeLink: "",
                  gddLink: "",
                  comments: "",
                });
                setCharacterArt(null);
                setCharacterPreview(null);
                setScenarioArt(null);
                setScenarioPreview(null);
                setGddFile(null);
              }}
              className="px-6 py-3 bg-steam-blueLight hover:bg-steam-blue text-white rounded-lg font-semibold transition-colors"
            >
              Fazer Nova Submissão
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título do Projeto */}
            <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
              <label htmlFor="projectTitle" className="block text-lg font-semibold text-white mb-2">
                Título do Projeto <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleInputChange}
                placeholder="Ex: MathQuest - Protótipo 1"
                className="w-full bg-steam-dark border border-steam-blue rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight"
                required
              />
            </div>

            {/* Descrição Resumida */}
            <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
              <label htmlFor="description" className="block text-lg font-semibold text-white mb-2">
                Descrição Resumida <span className="text-red-400">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-2">
                Breve texto explicando o conceito do jogo, destacando o personagem e o cenário criados (mínimo 50 caracteres)
              </p>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o conceito do jogo, o personagem principal e o cenário estilo plataforma..."
                rows={6}
                className="w-full bg-steam-dark border border-steam-blue rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight resize-y"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.description.length} caracteres (mínimo: 50)
              </p>
            </div>

            {/* Arte do Personagem */}
            <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
              <label className="block text-lg font-semibold text-white mb-2">
                Arte do Personagem <span className="text-red-400">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-4">
                Imagens ou ilustrações digitais (ou fotos de esboços) do personagem idealizado
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    id="characterArt"
                    accept="image/*"
                    onChange={(e) => handleImageChange("character", e)}
                    className="hidden"
                    required
                  />
                  <label
                    htmlFor="characterArt"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      characterArt
                        ? "border-steam-green bg-steam-green/10"
                        : "border-steam-blue bg-steam-dark hover:bg-steam-darker"
                    }`}
                  >
                    {characterPreview ? (
                      <img
                        src={characterPreview}
                        alt="Preview do personagem"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-400 text-center px-4">
                          Clique para fazer upload da arte do personagem
                        </p>
                      </>
                    )}
                  </label>
                </div>
                {characterArt && (
                  <div className="flex items-center gap-2 text-steam-green">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">{characterArt.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Arte do Cenário */}
            <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
              <label className="block text-lg font-semibold text-white mb-2">
                Arte e Design do Cenário <span className="text-red-400">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-4">
                Imagens representando o cenário estilo plataforma, contendo plataformas, obstáculos e elementos visuais
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    id="scenarioArt"
                    accept="image/*"
                    onChange={(e) => handleImageChange("scenario", e)}
                    className="hidden"
                    required
                  />
                  <label
                    htmlFor="scenarioArt"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      scenarioArt
                        ? "border-steam-green bg-steam-green/10"
                        : "border-steam-blue bg-steam-dark hover:bg-steam-darker"
                    }`}
                  >
                    {scenarioPreview ? (
                      <img
                        src={scenarioPreview}
                        alt="Preview do cenário"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-400 text-center px-4">
                          Clique para fazer upload da arte do cenário
                        </p>
                      </>
                    )}
                  </label>
                </div>
                {scenarioArt && (
                  <div className="flex items-center gap-2 text-steam-green">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">{scenarioArt.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Protótipo */}
            <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
              <label htmlFor="prototypeLink" className="block text-lg font-semibold text-white mb-2">
                Arquivo ou Link do Protótipo <span className="text-red-400">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-4">
                Pode ser um protótipo simples em formato digital (PDF com storyboard, images, ou link para ferramenta online de mockup)
              </p>
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  id="prototypeLink"
                  name="prototypeLink"
                  value={formData.prototypeLink}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/prototipo ou link do Google Drive"
                  className="flex-1 bg-steam-dark border border-steam-blue rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Ou faça upload do GDD abaixo (que pode conter o protótipo)
              </p>
            </div>

            {/* GDD */}
            <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
              <label className="block text-lg font-semibold text-white mb-2">
                Game Design Document (versão inicial) <span className="text-red-400">*</span>
              </label>
              <p className="text-sm text-gray-400 mb-4">
                Documento PDF ou link para edição online que contenha as primeiras descrições e o planejamento inicial do jogo
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="gddLink" className="block text-sm text-gray-300 mb-2">
                    Link do GDD (Google Docs, Notion, etc.)
                  </label>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      id="gddLink"
                      name="gddLink"
                      value={formData.gddLink}
                      onChange={handleInputChange}
                      placeholder="https://docs.google.com/document/..."
                      className="flex-1 bg-steam-dark border border-steam-blue rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight"
                    />
                  </div>
                </div>

                <div className="border-t border-steam-blue pt-4">
                  <p className="text-sm text-gray-300 mb-2">Ou faça upload do arquivo GDD:</p>
                  <input
                    type="file"
                    id="gddFile"
                    accept=".pdf,.doc,.docx"
                    onChange={handleGddFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="gddFile"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      gddFile
                        ? "bg-steam-green/20 text-steam-green border border-steam-green"
                        : "bg-steam-blue hover:bg-steam-blueLight text-white border border-steam-blue"
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>{gddFile ? gddFile.name : "Selecionar arquivo GDD (PDF, DOC, DOCX)"}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Comentários */}
            <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
              <label htmlFor="comments" className="block text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comentários ou Observações
              </label>
              <p className="text-sm text-gray-400 mb-4">
                Campo para adicionar justificativas, desafios encontrados, ou intenções de design (opcional)
              </p>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="Adicione suas observações, justificativas de design, desafios encontrados..."
                rows={5}
                className="w-full bg-steam-dark border border-steam-blue rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight resize-y"
              />
            </div>

            {/* Botão de Envio */}
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-steam-blueLight to-steam-green text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Enviar Submissão</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

