import { NextResponse } from "next/server";

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function getOrigin(req: Request) {
  const url = new URL(req.url);
  const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host;
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const orderId = typeof (body as any).order_id === "string" ? (body as any).order_id : null;
    const returnUrl =
      typeof (body as any).return_url === "string" ? (body as any).return_url : null;
    const amount = Number((body as any).amount);

    if (!orderId) {
      return NextResponse.json({ error: "order_id is required" }, { status: 400 });
    }
    if (!returnUrl) {
      return NextResponse.json({ error: "return_url is required" }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    // NOTE: 실제 Toss Payments 연동에서는 서버에서 secret key로 Toss API를 호출해 payment_url/token을 받습니다.
    // 여기서는 데모를 위해 mock 결제창으로 리다이렉트하는 URL을 반환합니다.
    const origin = getOrigin(req);
    const paymentId = randomId("pay");

    const paymentUrl =
      `${origin}/api/v1/payments/toss/mock` +
      `?payment_id=${encodeURIComponent(paymentId)}` +
      `&order_id=${encodeURIComponent(orderId)}` +
      `&amount=${encodeURIComponent(String(amount))}` +
      `&status=success` +
      `&return_url=${encodeURIComponent(returnUrl)}`;

    return NextResponse.json(
      {
        payment_id: paymentId,
        payment_url: paymentUrl,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
