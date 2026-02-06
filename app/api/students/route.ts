import logger from "@/lib/logger";
import { studentService } from "@/lib/services/student-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId é um campo obrigatório" },
        { status: 400 },
      );
    }
    const students = await studentService.getStudentsWithInclude(userId, 'user');
    return NextResponse.json(students);
  } catch (error) {
    logger.error("Error fetching students:", "STUDENT", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const student = await studentService.create(data);
    return NextResponse.json(student);
  } catch (error) {
    logger.error("Error creating student:", "STUDENT", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 },
    );
  }
}
