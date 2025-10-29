"use client";

import { ReactNode } from "react";

/**
 * Wrapper que escolhe automaticamente entre AuthProvider local ou Firebase
 * baseado nas variáveis de ambiente
 */
export default function AuthProviderWrapper({ children }: { children: ReactNode }) {
  const useFirebase = 
    typeof window !== "undefined" &&
    !process.env.NEXT_PUBLIC_ENABLE_LOCAL_STORAGE &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (useFirebase) {
    const { AuthProviderFirebase } = require("./AuthProviderFirebase");
    return <AuthProviderFirebase>{children}</AuthProviderFirebase>;
  } else {
    const { AuthProvider } = require("./AuthProvider");
    return <AuthProvider>{children}</AuthProvider>;
  }
}

// Export hook que funciona com ambos
export function useAuthWrapper() {
  const useFirebase = 
    typeof window !== "undefined" &&
    !process.env.NEXT_PUBLIC_ENABLE_LOCAL_STORAGE &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (useFirebase) {
    const { useAuthFirebase } = require("./AuthProviderFirebase");
    return useAuthFirebase();
  } else {
    const { useAuth } = require("./AuthProvider");
    return useAuth();
  }
}

