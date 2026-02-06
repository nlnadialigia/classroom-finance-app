import prisma from "@/lib/db/prisma";
import { createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid-token", request.url));
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { editorToken: token },
          { viewerToken: token }
        ]
      },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=invalid-token", request.url));
    }

    // Determinar role baseado no token usado
    const sessionRole = user.editorToken === token ? "EDITOR" : "VIEWER";
    
    // Criar sessão com role específico
    await createSession(user.id, sessionRole);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Magic auth error:", error);
    return NextResponse.redirect(new URL("/login?error=auth-failed", request.url));
  }
}
