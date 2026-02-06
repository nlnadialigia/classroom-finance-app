import { generateHash } from "@/lib/auth";
import logger from "@/lib/logger";
import { userService } from "@/lib/services/user-service";
import { generatePublicSlug } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await userService.getAll();
    return NextResponse.json(users);
  } catch (error) {
    logger.error("Error fetching users:", "USER", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Senha é opcional agora (apenas para ADMIN)
    if (data.password) {
      data.password = await generateHash(data.password);
    } else {
      delete data.password; // Remove o campo se não fornecido
    }
    data.publicSlug = generatePublicSlug();
    
    logger.info("Data to create user", "DATABASE", data);
    
    const user = await userService.create(data);
    return NextResponse.json(user);
  } catch (error) {
    logger.error("Error creating user:", "USER", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
