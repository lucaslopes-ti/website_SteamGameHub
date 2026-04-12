import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let appInstance: FirebaseApp | null = null;
let storageInstance: FirebaseStorage | null = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

if (hasFirebaseConfig) {
  try {
    appInstance = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    storageInstance = getStorage(appInstance);
    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
  } catch (error) {
    console.warn("⚠️ Firebase não inicializado no carregamento do módulo:", error);
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (!appInstance) {
    throw new TypeError("Firebase App não foi inicializado. Verifique as variáveis NEXT_PUBLIC_FIREBASE_*.");
  }
  return appInstance;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storageInstance) {
    throw new TypeError("Firebase Storage não foi inicializado. Verifique as variáveis NEXT_PUBLIC_FIREBASE_*.");
  }
  return storageInstance;
}

export function getFirebaseDb(): Firestore {
  if (!dbInstance) {
    throw new TypeError("Firestore não foi inicializado. Verifique as variáveis NEXT_PUBLIC_FIREBASE_*.");
  }
  return dbInstance;
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    throw new TypeError("Firebase Auth não foi inicializado. Verifique as variáveis NEXT_PUBLIC_FIREBASE_*.");
  }
  return authInstance;
}

// Compatibilidade com imports legados
export const app = appInstance as FirebaseApp;
export const storage = storageInstance as FirebaseStorage;
export const db = dbInstance as Firestore;
export const auth = authInstance as Auth;

