/**
 * Upload direto do cliente para Firebase Storage
 * Isso evita limitações do Vercel (4.5MB/50MB) e permite arquivos grandes
 */

// Função helper para gerar UUID no browser
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para navegadores mais antigos
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function uploadToFirebaseDirect(
  file: File,
  type: "image" | "executable"
): Promise<{ url: string; path: string; fileName: string }> {
  // Verificar se Firebase está configurado
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!storageBucket) {
    throw new Error("Firebase Storage não está configurado");
  }

  // Importar Firebase Storage dinamicamente
  const { storage } = await import("./firebase/config");
  const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");

  // Gerar nome único
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
  const uniqueFileName = `${generateUUID()}.${fileExtension}`;
  const storagePath = type === "image" 
    ? `images/${uniqueFileName}`
    : `games/${uniqueFileName}`;

  const storageRef = ref(storage, storagePath);

  // Fazer upload direto
  await uploadBytes(storageRef, file);

  // Obter URL pública
  const url = await getDownloadURL(storageRef);

  return {
    url,
    path: storagePath,
    fileName: uniqueFileName,
  };
}

/**
 * Verifica se deve usar upload direto (Firebase) ou via servidor
 */
export function shouldUseDirectUpload(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.ENABLE_LOCAL_STORAGE !== "true";
}

