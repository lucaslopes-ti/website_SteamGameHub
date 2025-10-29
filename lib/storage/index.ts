/**
 * Abstração de storage para facilitar migração entre local e Firebase
 */

const USE_LOCAL_STORAGE = process.env.ENABLE_LOCAL_STORAGE === "true" || !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

export interface StorageService {
  uploadFile(file: File | Buffer, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
}

// Storage local (desenvolvimento)
class LocalStorageService implements StorageService {
  async uploadFile(file: File | Buffer, path: string): Promise<string> {
    const FormData = (await import("form-data")).default;
    const formData = new FormData();
    
    if (file instanceof File) {
      formData.append("file", file);
    } else {
      formData.append("file", file, { filename: path });
    }
    formData.append("type", path.includes("games") ? "executable" : "image");

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData as any,
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer upload do arquivo");
    }

    const data = await response.json();
    return data.url;
  }

  async deleteFile(path: string): Promise<void> {
    // Remover do sistema de arquivos local
    const response = await fetch(`/api/files/${encodeURIComponent(path)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar arquivo");
    }
  }

  async getFileUrl(path: string): Promise<string> {
    return path.startsWith("/") ? path : `/${path}`;
  }
}

// Storage Firebase (produção)
class FirebaseStorageService implements StorageService {
  async uploadFile(file: File | Buffer, path: string): Promise<string> {
    const { storage } = await import("./firebase");
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");

    const storageRef = ref(storage, path);
    
    let blob: Blob;
    if (file instanceof File) {
      blob = file;
    } else {
      blob = new Blob([file]);
    }

    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    return url;
  }

  async deleteFile(path: string): Promise<void> {
    const { storage } = await import("./firebase");
    const { ref, deleteObject } = await import("firebase/storage");

    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  async getFileUrl(path: string): Promise<string> {
    const { storage } = await import("./firebase");
    const { ref, getDownloadURL } = await import("firebase/storage");

    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  }
}

// Exportar service baseado na configuração
export const storageService: StorageService = USE_LOCAL_STORAGE
  ? new LocalStorageService()
  : new FirebaseStorageService();

