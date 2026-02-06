import logger from "@/lib/logger";
import { expenseService } from "@/lib/services/expense-service";
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

    const expenses = await expenseService.getByFilter({ userId });
    return NextResponse.json(expenses);
  } catch (error) {
    logger.error("Error fetching expenses:", "EXPENSE", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const expense = await expenseService.create(data);
    return NextResponse.json(expense);
  } catch (error) {
    logger.error("Error creating expense:", "EXPENSE", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
