import logger from "@/lib/logger";
import { studentService } from "@/lib/services/student-service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();
    await studentService.update(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating student:", "STUDENT", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await studentService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting student:", "STUDENT", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 },
    );
  }
}
