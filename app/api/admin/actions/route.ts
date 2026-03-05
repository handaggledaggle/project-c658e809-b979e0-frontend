import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  action: string;
  targetIds?: string[];
  incidentId?: string;
};

export async function POST(req: Request) {
  let body: Body | null = null;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.action) {
    return NextResponse.json({ ok: false, message: "Missing action" }, { status: 400 });
  }

  // MVP: 여기서 관리자 인증/권한검증, 감사로그 기록, DB 업데이트를 수행.
  // - HIDE_ARTWORKS: 작품 상태 PRIVATE로 변경
  // - WARN_USER: 사용자에게 경고 이벤트 기록/알림 발송
  // - RETRY_PAYMENT: 결제 재처리 큐 적재
  // - TEMP_HIDE/PERMA_HIDE/REQUEST_REVIEW: 사건(incident) 워크플로 상태 변경

  const targetCount = body.targetIds?.length ?? 0;

  return NextResponse.json({
    ok: true,
    message:
      body.incidentId
        ? `사건(${body.incidentId}) 조치가 기록되었습니다: ${body.action}`
        : `요청이 접수되었습니다: ${body.action} (targets=${targetCount})`,
    receivedAt: new Date().toISOString(),
  });
}
