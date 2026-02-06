import logger from "@/lib/logger";
import { expenseService } from "@/lib/services/expense-service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; }; }
) {
  try {
    await expenseService.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting expense:", "EXPENSE", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; }; }
) {
  try {
    const body = await request.json();
    const { description, value, paymentDate } = body;

    const updatedExpense = await expenseService.update(params.id, {
      description,
      value: parseFloat(value),
      paymentDate: new Date(paymentDate),
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    logger.error("Error updating expense:", "EXPENSE", error);
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
  }
}
