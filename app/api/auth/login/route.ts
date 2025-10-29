import { NextRequest, NextResponse } from "next/server";
import { validateLogin, getUserByEmail } from "@/lib/auth";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validação no servidor (segura)
    const isValid = validateLogin(email, password);
    
    if (isValid) {
      const user = getUserByEmail(email);
      if (user) {
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    }

    return NextResponse.json(
      { error: "E-mail ou senha incorretos" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}

