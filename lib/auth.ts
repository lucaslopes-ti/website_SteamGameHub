// Sistema de autenticação básico
// Em produção, use Firebase Auth ou NextAuth.js

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

// Mock de usuários (em produção, use banco de dados)
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@senai.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Professor Silva",
    email: "professor@senai.com",
    role: "teacher",
  },
];

export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email === email);
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export function isTeacher(user: User | null): boolean {
  return user?.role === "teacher" || user?.role === "admin";
}

