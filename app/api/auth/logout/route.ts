import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  // MVP: 실제 세션/쿠키(JWT) 삭제 처리.
  return NextResponse.json({ ok: true });
}
