import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Status = "SUCCESS" | "FAILED" | "PENDING";

function parseStatus(input: string | null): Status {
  const v = (input ?? "").toLowerCase();
  if (v === "success") return "SUCCESS";
  if (v === "fail" || v === "failed") return "FAILED";
  if (v === "pending") return "PENDING";
  return "PENDING";
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const orderId = url.searchParams.get("orderId") ?? url.searchParams.get("order_id") ?? "PT-20260305-1248";
  const status = parseStatus(url.searchParams.get("status"));

  const paymentKey = url.searchParams.get("paymentKey") ?? undefined;
  const amount = url.searchParams.get("amount") ?? undefined;
  const code = url.searchParams.get("code") ?? undefined;
  const message = url.searchParams.get("message") ?? undefined;

  // NOTE: MVP stub implementation.
  // In production, read the authoritative order/payment status from DB (DATABASE_URL) and/or PG confirmation.
  const statusLabel = status === "SUCCESS" ? "결제 성공" : status === "FAILED" ? "결제 실패" : "결제 확인 중";
  const statusMessage =
    status === "SUCCESS"
      ? "감사합니다. 주문이 정상 처리되었습니다."
      : status === "FAILED"
        ? "결제가 완료되지 않았습니다. 다시 시도하거나 고객센터에 문의하세요."
        : "결제 결과를 확인하고 있습니다. 잠시만 기다려 주세요.";

  const payload = {
    orderId,
    status,
    statusLabel,
    statusMessage,
    paidAt: status === "SUCCESS" ? "2026-03-05 14:28" : undefined,
    paymentMethod: status === "SUCCESS" ? "신용카드 (Visa)" : undefined,
    totalAmount: 120000,
    currency: "KRW" as const,
    items: [
      {
        id: "item_1",
        title: "별빛의 정원",
        artistName: "김수현",
        option: "A3 프린트 / 무광",
        quantity: 1,
        price: 90000,
        eta: "2026-03-12",
      },
    ],
    addons: [{ id: "addon_1", title: "패키지 포장", price: 30000 }],
    stats: {
      paymentSuccessRate: 98.2,
      csWeeklyCount: 12,
      avgOrderValue: 85400,
      avgIssueResolutionHours: 6,
    },
    gateway: {
      paymentKey,
      amount,
      code,
      message,
    },
  };

  return NextResponse.json(payload, { status: 200 });
}
