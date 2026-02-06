import logger from "@/lib/logger";
import { extraReceiptService } from "@/lib/services/extra-receipt-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const receipts = await extraReceiptService.getAll();
    return NextResponse.json(receipts);
  } catch (error) {
    logger.error("Error fetching extra receipts:", "EXTRA_RECEIPT", error);
    return NextResponse.json({ error: "Failed to fetch extra receipts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const receipt = await extraReceiptService.create(data);
    return NextResponse.json(receipt);
  } catch (error) {
    logger.error("Error creating extra receipt:", "EXTRA_RECEIPT", error);
    return NextResponse.json({ error: "Failed to create extra receipt" }, { status: 500 });
  }
}
