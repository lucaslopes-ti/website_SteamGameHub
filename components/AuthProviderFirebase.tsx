"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/config";

type UserRole = "student" | "teacher" | "admin";

interface UserData {
  email: string;
  displayName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderFirebase({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
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
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole = "student"
  ) => {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
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
    const auth = getFirebaseAuth();
    await signOut(auth);
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isAdmin: userData?.role === "admin",
    isTeacher: userData?.role === "teacher" || userData?.role === "admin",
  }), [user, userData, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthFirebase() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthFirebase must be used within an AuthProviderFirebase");
  }
  return context;
}

