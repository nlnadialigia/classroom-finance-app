import logger from "@/lib/logger";
import { userService } from "@/lib/services/user-service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await userService.update(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating user:", "USER", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }>; }
) {
  try {
    const { id } = await params;
    await userService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting user:", "USER", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
