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

        // Importar Firebase Admin SDK dinamicamente para upload no servidor
        const admin = await import("firebase-admin");
        
        // Verificar se Firebase Admin já foi inicializado
        let adminApp;
        try {
          if (admin.apps.length === 0) {
            // Tentar inicializar com service account (se disponível)
            const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
            if (serviceAccountKey) {
              try {
                const serviceAccount = JSON.parse(serviceAccountKey);
                adminApp = admin.initializeApp({
                  credential: admin.credential.cert(serviceAccount),
                  storageBucket: storageBucket,
                });
              } catch (parseError) {
                console.error("Erro ao fazer parse do service account:", parseError);
                // Continuar sem service account
              }
            }
            
            // Se não inicializou com service account, tentar com credenciais padrão
            if (!adminApp) {
              adminApp = admin.initializeApp({
                storageBucket: storageBucket,
              });
            }
          } else {
            adminApp = admin.apps[0];
          }

          // Usar Admin SDK para upload
          const bucket = admin.storage().bucket();

          // Gerar caminho único
          const uniqueFileName = `${randomUUID()}${fileExtension}`;
          const storagePath = type === "image" 
            ? `images/${uniqueFileName}`
            : `games/${uniqueFileName}`;

          console.log(`Iniciando upload para Firebase Storage (Admin SDK): ${storagePath}, tamanho: ${file.size} bytes`);

          // Converter File para Buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Criar referência do arquivo no bucket
          const fileRef = bucket.file(storagePath);

          // Fazer upload usando Admin SDK
          await fileRef.save(buffer, {
            contentType: file.type || "application/octet-stream",
            metadata: {
              contentType: file.type || "application/octet-stream",
            },
          });

          // Tornar o arquivo público
          await fileRef.makePublic();

          // Obter URL pública
          const url = `https://storage.googleapis.com/${storageBucket}/${storagePath}`;
          console.log(`Upload concluído para ${storagePath}, URL: ${url}`);
        } catch (adminError: any) {
          console.error("Erro ao usar Firebase Admin SDK:", adminError);
          // Fallback: usar Client SDK
          console.log("Tentando fallback para Client SDK...");
          
          const { storage } = await import("@/lib/firebase/config");
          const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
          
          if (!storage) {
            throw new Error("Firebase Storage não foi inicializado");
          }

          const uniqueFileName = `${randomUUID()}${fileExtension}`;
          const storagePath = type === "image" 
            ? `images/${uniqueFileName}`
            : `games/${uniqueFileName}`;

          console.log(`Iniciando upload para Firebase Storage (Client SDK): ${storagePath}, tamanho: ${file.size} bytes`);

          const storageRef = ref(storage, storagePath);
          const bytes = await file.arrayBuffer();
          const blob = new Blob([bytes], { type: file.type });

          await uploadBytes(storageRef, blob);
          const url = await getDownloadURL(storageRef);

          return NextResponse.json({
            success: true,
            url: url,
            path: storagePath,
            fileName: uniqueFileName,
          });
        }

        return NextResponse.json({
          success: true,
          url: url,
          path: storagePath,
          fileName: uniqueFileName,
        });
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
        // Em desenvolvimento, tentar fallback local apenas se não estiver em produção
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
