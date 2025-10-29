import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      fileName: uniqueFileName,
      originalFileName: file.name,
      fileSize: file.size,
      path: publicPath,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    );
  }
}
