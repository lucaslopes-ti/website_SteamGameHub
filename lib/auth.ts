// Sistema de autenticação básico
// Em produção, use Firebase Auth ou NextAuth.js

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

// Usuários válidos (em produção, use banco de dados ou Firebase Auth)
// Email obtido de variável de ambiente para segurança
function getValidUsers(): User[] {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  if (adminEmail) {
    return [
      {
        id: "1",
        name: "Lucas Lopes",
        email: adminEmail,
        role: "teacher",
      },
    ];
  }
  return [];
}

const validUsers: User[] = getValidUsers();

export function getUserByEmail(email: string): User | undefined {
  return validUsers.find((u) => u.email === email);
}

export function validateLogin(email: string, password: string): boolean {
  // Validação usando variáveis de ambiente para segurança
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  
  if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
    return true;
  }
  return false;
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export function isTeacher(user: User | null): boolean {
  return user?.role === "teacher" || user?.role === "admin";
}

