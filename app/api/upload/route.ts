import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { useLocalStorage } from "@/lib/config";

// Configuração de rota segment - Next.js 14+
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    let allowedExtensions: string[];
    let maxSize: number;
    let uploadDir: string;

    if (type === "image") {
      // Upload de imagem
      allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      maxSize = 10 * 1024 * 1024; // 10MB
      uploadDir = path.join(process.cwd(), "public", "uploads", "images");
    } else {
      // Upload de executável
      allowedExtensions = [".exe", ".zip", ".rar", ".7z", ".app", ".dmg"];
      maxSize = 500 * 1024 * 1024; // 500MB
      uploadDir = path.join(process.cwd(), "public", "uploads", "games");
    }

    // Validar tipo de arquivo
    const fileExtension = path.extname(file.name).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Tipo de arquivo não permitido. Use: ${allowedExtensions.join(", ")}` },
        { status: 400 }
      );
    }

    // Validar tamanho máximo
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Tamanho máximo: ${Math.round(maxSize / 1024 / 1024)}MB` },
        { status: 400 }
      );
    }

    // Em produção (Vercel), sempre usar Firebase Storage (sistema de arquivos é read-only)
    const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL;
    
    if (!useLocalStorage() || isProduction) {
      try {
        // Verificar se Firebase Storage está configurado
        const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
        if (!storageBucket) {
          console.error("Firebase Storage não está configurado - storageBucket ausente");
          return NextResponse.json(
            { 
              error: "Firebase Storage não está configurado",
              details: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET não está definido"
            },
            { status: 500 }
          );
        }

        // Gerar caminho único
        const uniqueFileName = `${randomUUID()}${fileExtension}`;
        const storagePath = type === "image" 
          ? `images/${uniqueFileName}`
          : `games/${uniqueFileName}`;

        console.log(`Iniciando upload para Firebase Storage: ${storagePath}, tamanho: ${file.size} bytes`);

        // Tentar usar Firebase Admin SDK primeiro (se tiver Service Account)
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
          try {
            const admin = await import("firebase-admin");
            
            // Inicializar Admin SDK se necessário
            if (admin.apps.length === 0) {
              try {
                const serviceAccount = JSON.parse(serviceAccountKey);
                admin.initializeApp({
                  credential: admin.credential.cert(serviceAccount),
                  storageBucket: storageBucket,
                });
              } catch (parseError: any) {
                console.error("Erro ao fazer parse do service account:", parseError?.message);
                throw new Error(`Erro ao fazer parse do service account: ${parseError?.message || "Formato JSON inválido"}`);
              }
            }

            const bucket = admin.storage().bucket();
            const fileRef = bucket.file(storagePath);
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            await fileRef.save(buffer, {
              contentType: file.type || "application/octet-stream",
              metadata: {
                contentType: file.type || "application/octet-stream",
              },
            });

            await fileRef.makePublic();
            const url = `https://storage.googleapis.com/${storageBucket}/${storagePath}`;
            
            console.log(`Upload concluído via Admin SDK: ${url}`);
            
            return NextResponse.json({
              success: true,
              url: url,
              path: storagePath,
              fileName: uniqueFileName,
            });
          } catch (adminError: any) {
            console.warn("Admin SDK falhou, tentando REST API:", adminError?.message);
            // Continuar para tentar REST API
          }
        }

        // Fallback: usar Firebase Storage REST API diretamente
        // Como as regras permitem uploads não autenticados, podemos fazer upload direto
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // URL do Firebase Storage REST API
          const encodedPath = encodeURIComponent(storagePath);
          const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o?name=${encodedPath}`;
          
          console.log(`Fazendo upload via REST API para: ${uploadUrl}`);

          const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Content-Type': file.type || 'application/octet-stream',
            },
            body: buffer,
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error("Erro na resposta do REST API:", uploadResponse.status, errorText);
            throw new Error(`Upload falhou: ${uploadResponse.status} - ${errorText}`);
          }

          const uploadResult = await uploadResponse.json();
          console.log("Resultado do upload:", uploadResult);

          // Obter URL pública do arquivo
          const downloadToken = uploadResult.downloadTokens?.[0] || '';
          const url = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedPath}?alt=media${downloadToken ? `&token=${downloadToken}` : ''}`;
          
          console.log(`Upload concluído via REST API: ${url}`);

          return NextResponse.json({
            success: true,
            url: url,
            path: storagePath,
            fileName: uniqueFileName,
          });
        } catch (restError: any) {
          console.error("Erro ao usar REST API:", restError);
          return NextResponse.json(
            { 
              error: "Erro ao fazer upload no Firebase Storage",
              details: restError?.message || "Erro desconhecido",
              code: "UPLOAD_FAILED",
              suggestion: "Verifique as regras do Firebase Storage. As regras devem permitir uploads não autenticados para /images/ e /games/"
            },
            { status: 500 }
          );
        }
      } catch (firebaseError: any) {
        console.error("Erro no Firebase Storage:", {
          message: firebaseError?.message,
          code: firebaseError?.code,
          stack: firebaseError?.stack,
          name: firebaseError?.name,
        });
        
        // Em produção, não tentar fallback local
        if (isProduction) {
          return NextResponse.json(
            { 
              error: "Erro ao fazer upload no Firebase Storage", 
              details: firebaseError?.message || firebaseError?.code || "Erro desconhecido",
              code: firebaseError?.code || "UNKNOWN"
            },
            { status: 500 }
          );
        }
        // Em desenvolvimento, tentar fallback local (ver linha 211)
        console.warn("Erro no Firebase Storage, tentando local:", firebaseError);
      }
    }

    // Modo local (apenas em desenvolvimento, não em produção)
    if (!isProduction) {
      try {
        // Criar diretório de uploads se não existir
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        // Gerar nome único para o arquivo
        const uniqueFileName = `${randomUUID()}${fileExtension}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        // Salvar arquivo
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Retornar caminho relativo para acesso público
        const publicPath = type === "image"
          ? `/uploads/images/${uniqueFileName}`
          : `/uploads/games/${uniqueFileName}`;

        return NextResponse.json({
          success: true,
          url: publicPath,
          path: publicPath,
          fileName: uniqueFileName,
        });
      } catch (localError: any) {
        console.error("Erro ao salvar arquivo localmente:", localError);
        return NextResponse.json(
          { 
            error: "Erro ao salvar arquivo localmente", 
            details: localError?.message || "Erro desconhecido" 
          },
          { status: 500 }
        );
      }
    }

    // Se chegou aqui, não conseguiu fazer upload nem local nem Firebase
    return NextResponse.json(
      { error: "Não foi possível fazer upload do arquivo" },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { 
        error: "Erro ao fazer upload do arquivo", 
        details: error?.message || "Erro desconhecido",
        stack: process.env.NODE_ENV !== "production" ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}
