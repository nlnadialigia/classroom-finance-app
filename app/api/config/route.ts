import logger from "@/lib/logger";
import { configService } from "@/lib/services/config-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 },
      );
    }

    const config = await configService.findFirst({ where: { userId } });

    return NextResponse.json(config);
  } catch (error) {
    logger.error("Error fetching config:", "CONFIG", error);
    return NextResponse.json(
      { error: "Failed to fetch config" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, year, monthlyValue, previousBalance } = data;

    const config = await configService.upSert(userId, year, monthlyValue, previousBalance);

    return NextResponse.json(config);
  } catch (error) {
    logger.error("Error saving config:", "CONFIG", error);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 },
    );
  }
}
