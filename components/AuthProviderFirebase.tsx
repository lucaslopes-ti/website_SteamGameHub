"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

interface UserData {
  email: string;
  displayName: string;
  role: "student" | "teacher" | "admin";
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role?: "student" | "teacher" | "admin") => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderFirebase({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Buscar dados do usuário no Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              email: firebaseUser.email || "",
              displayName: data.displayName || firebaseUser.displayName || "",
              role: data.role || "student",
            });
          } else {
            // Criar documento do usuário se não existir
            setUserData({
              email: firebaseUser.email || "",
              displayName: firebaseUser.displayName || "",
              role: "student",
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setUserData({
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "",
            role: "student",
          });
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: "student" | "teacher" | "admin" = "student"
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Atualizar perfil
    await updateProfile(firebaseUser, { displayName });

    // Criar documento no Firestore
    await setDoc(doc(db, "users", firebaseUser.uid), {
      email,
      displayName,
      role,
      createdAt: new Date().toISOString(),
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isAdmin: userData?.role === "admin",
    isTeacher: userData?.role === "teacher" || userData?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthFirebase() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthFirebase must be used within an AuthProviderFirebase");
  }
  return context;
}

