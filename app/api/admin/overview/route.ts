import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // MVP: DB/로그 기반으로 대시보드 KPI를 집계하도록 확장.
  return NextResponse.json({
    newArtistsWeekly: 12,
    artworksCompletedWeekly: 48,
    paymentSuccessRateDaily: 97,
  });
}
