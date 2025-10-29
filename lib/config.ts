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

export const useLocalStorage = () => {
  return process.env.ENABLE_LOCAL_STORAGE === "true" || !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
};

export const useLocalDatabase = () => {
  return process.env.ENABLE_LOCAL_STORAGE === "true" || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
};

