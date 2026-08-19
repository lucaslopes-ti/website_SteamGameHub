"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { authedFetch } from "@/lib/client-auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Estado base imediato (papel ainda não resolvido).
      const baseUser: User = {
        id: firebaseUser.uid,
        name:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Usuário",
        email: firebaseUser.email || "",
        role: "student",
      };
      setUser(baseUser);

      // Papel efetivo vem do servidor (custom claims + allowlists
      // server-side). O servidor é a única barreira de segurança; aqui apenas
      // alinhamos a UI com a autorização real.
      try {
        const res = await authedFetch("/api/auth/me");
        // Evita aplicar um papel de uma sessão que já mudou (ex.: logout).
        if (auth.currentUser !== firebaseUser) return;
        if (res.ok) {
          const me = await res.json();
          setUser({
            ...baseUser,
            name: me.name || baseUser.name,
            role: me.role === "admin" || me.role === "teacher" ? me.role : "student",
          });
        }
      } catch (error) {
        console.error("Erro ao obter papel efetivo:", error);
      } finally {
        if (auth.currentUser === firebaseUser) {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const auth = getFirebaseAuth();
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }
      return true;
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      return false;
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
  };

  const value = useMemo(() => {
    const role = user?.role ?? "student";
    const isAdmin = role === "admin";
    const isTeacher = role === "teacher" || isAdmin;

    return {
      user,
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
      loading,
      isAuthenticated: !!user,
      isAdmin,
      isTeacher,
      isStaff: isTeacher || isAdmin,
    };
  }, [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
