import prisma from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.extraReceipt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete extra receipt" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { studentId, description, value, receiptDate } = body;

    const updatedReceipt = await prisma.extraReceipt.update({
      where: { id },
      data: {
        studentId,
        description,
        value: parseFloat(value),
        receiptDate: new Date(receiptDate),
      },
    });

    return NextResponse.json(updatedReceipt);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update extra receipt" },
      { status: 500 }
    );
  }
}
