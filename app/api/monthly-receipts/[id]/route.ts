import { prisma } from "@/lib/services/prisma.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { value, paymentDate } = await request.json();

    const updatedReceipt = await prisma.monthlyReceipt.update({
      where: { id },
      data: {
        value,
        paymentDate: new Date(paymentDate),
      },
    });

    return NextResponse.json(updatedReceipt);
  } catch (error) {
    console.error("Error updating monthly receipt:", error);
    return NextResponse.json(
      { error: "Failed to update monthly receipt" },
      { status: 500 },
    );
  }
}
