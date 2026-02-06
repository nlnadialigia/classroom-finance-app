import logger from "@/lib/logger";
import { monthlyReceiptService } from "@/lib/services/monthly-receipt-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const receipts = await monthlyReceiptService.getAll();
    return NextResponse.json(receipts);
  } catch (error) {
    logger.error("Error fetching monthly receipts:", "MONTHLY_RECEIPT", error);
    return NextResponse.json({ error: "Failed to fetch monthly receipts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const receipt = await monthlyReceiptService.create(data);
    return NextResponse.json(receipt);
  } catch (error) {
    logger.error("Error creating monthly receipt:", "MONTHLY_RECEIPT", error);
    return NextResponse.json({ error: "Failed to create monthly receipt" }, { status: 500 });
  }
}
