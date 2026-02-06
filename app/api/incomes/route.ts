import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { month: "asc" },
    });

    return NextResponse.json(incomes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch incomes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value, month, userId } = body;

    const income = await prisma.income.create({
      data: {
        type,
        value: parseFloat(value),
        month: parseInt(month),
        userId,
      },
    });

    return NextResponse.json(income);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create income" }, { status: 500 });
  }
}
