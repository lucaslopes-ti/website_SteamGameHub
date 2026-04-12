// Arquivo legado mantido apenas para compatibilidade histórica.
// A autenticação ativa do projeto foi migrada para Firebase Auth.

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

