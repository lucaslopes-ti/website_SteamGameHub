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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  const emergencyAdminEmails = [
    "lucas.lopes0@outlook.com.br",
    "lucaslopes0@outlook.com.br",
  ];
  const emergencyAdminLocalParts = new Set(["lucaslopes0"]);

  const parseEmailList = (value?: string): string[] => {
    if (!value) return [];
    return value
      .split(/[;,]/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  };

  const getAdminEmails = (): string[] => {
    const envEmails = parseEmailList(
      process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
        process.env.ADMIN_EMAILS ||
        process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
        process.env.ADMIN_EMAIL
    );
    return Array.from(new Set([...emergencyAdminEmails, ...envEmails]));
  };

  const isEmergencyAdminEmail = (email?: string | null): boolean => {
    if (!email) return false;
    const normalizedEmail = email.trim().toLowerCase();
    if (emergencyAdminEmails.includes(normalizedEmail)) return true;

    const localPart = normalizedEmail.split("@")[0]?.replaceAll(/[^a-z0-9]/g, "") || "";
    return emergencyAdminLocalParts.has(localPart);
  };

  const resolveRole = (email?: string | null): User["role"] => {
    if (!email) return "student";

    const normalizedEmail = email.trim().toLowerCase();

    if (isEmergencyAdminEmail(normalizedEmail)) {
      return "admin";
    }

    const adminEmails = getAdminEmails();

    const teacherEmails = parseEmailList(
      process.env.NEXT_PUBLIC_TEACHER_EMAILS || process.env.TEACHER_EMAILS
    );

    if (adminEmails.includes(normalizedEmail)) {
      return "admin";
    }

    if (teacherEmails.includes(normalizedEmail)) {
      return "teacher";
    }

    return "student";
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuário",
        email: firebaseUser.email || "",
        role: resolveRole(firebaseUser.email),
      });
      setLoading(false);
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
    const normalizedEmail = (user?.email || "").trim().toLowerCase();
    const adminEmails = getAdminEmails();
    const teacherEmails = parseEmailList(
      process.env.NEXT_PUBLIC_TEACHER_EMAILS || process.env.TEACHER_EMAILS
    );
    const hasAdminAccess =
      (!!normalizedEmail && adminEmails.includes(normalizedEmail)) ||
      isEmergencyAdminEmail(normalizedEmail);
    const hasTeacherAccess =
      hasAdminAccess || (!!normalizedEmail && teacherEmails.includes(normalizedEmail));

    return {
      user,
      login,
      loginWithGoogle,
      register,
      resetPassword,
      logout,
      loading,
      isAuthenticated: !!user,
      isAdmin: hasAdminAccess || user?.role === "admin",
      isTeacher: hasTeacherAccess || user?.role === "teacher" || user?.role === "admin",
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

