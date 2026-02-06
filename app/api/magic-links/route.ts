import prisma from "@/lib/db/prisma";
import { getSession } from "@/lib/session";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: { in: ["EDITOR", "VIEWER"] },
      },
      select: {
        id: true,
        username: true,
        role: true,
        editorToken: true,
        viewerToken: true,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    const usersWithLinks = users.map(user => ({
      ...user,
      editorLink: user.editorToken ? `${baseUrl}/api/auth/magic?token=${user.editorToken}` : null,
      viewerLink: user.viewerToken ? `${baseUrl}/api/auth/magic?token=${user.viewerToken}` : null,
    }));

    return NextResponse.json(usersWithLinks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await request.json();

    const editorToken = randomBytes(32).toString("hex");
    const viewerToken = randomBytes(32).toString("hex");

    // Verificar se usuário já existe e atualizar tokens, senão criar novo
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { username },
        data: {
          editorToken,
          viewerToken,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          username,
          role: "EDITOR",
          editorToken,
          viewerToken,
        },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    const editorLink = `${baseUrl}/api/auth/magic?token=${editorToken}`;
    const viewerLink = `${baseUrl}/api/auth/magic?token=${viewerToken}`;

    return NextResponse.json({
      user: { id: user.id, username: user.username, role: user.role },
      editorLink,
      viewerLink
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create magic links" }, { status: 500 });
  }
}
