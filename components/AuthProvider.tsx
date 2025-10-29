"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Autenticação usando variáveis de ambiente para segurança
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";
    
    const validUsers: User[] = [
      {
        id: "1",
        name: "Lucas Lopes",
        email: adminEmail || "admin",
        role: "teacher",
      },
    ];

    // Validação usando variáveis de ambiente
    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      const user = validUsers.find((u) => u.email === email);
      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      }
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isTeacher: user?.role === "teacher" || user?.role === "admin",
      }}
    >
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

