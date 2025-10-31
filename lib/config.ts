/**
 * Configurações centralizadas para detectar modo de operação
 */

export const isProduction = () => {
  return (
    process.env.NODE_ENV === "production" ||
    (process.env.ENABLE_LOCAL_STORAGE !== "true" &&
      !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  );
};

export const shouldUseLocalStorage = () => {
  return process.env.ENABLE_LOCAL_STORAGE === "true" || !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
};

// Manter compatibilidade com código existente
export const useLocalStorage = shouldUseLocalStorage;

export const shouldUseLocalDatabase = () => {
  return process.env.ENABLE_LOCAL_STORAGE === "true" || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
};

// Manter compatibilidade com código existente
export const useLocalDatabase = shouldUseLocalDatabase;

