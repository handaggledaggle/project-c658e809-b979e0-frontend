import { NextResponse } from "next/server";

function appendQuery(base: string, params: Record<string, string>) {
  const u = new URL(base);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return u.toString();
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const paymentId = url.searchParams.get("payment_id") ?? "";
  const orderId = url.searchParams.get("order_id") ?? "";
  const status = url.searchParams.get("status") ?? "success"; // success | fail | cancel
  const reason = url.searchParams.get("reason") ?? "";
  const returnUrl = url.searchParams.get("return_url") ?? "";

  if (!returnUrl || !orderId) {
    return NextResponse.json({ error: "Missing return_url or order_id" }, { status: 400 });
  }

  const redirectTo = appendQuery(returnUrl, {
    paymentStatus: status,
    orderId,
    ...(reason ? { reason } : {}),
  });

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Toss Payments (Mock)</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system; background: #faf5ff; margin: 0; }
    .wrap { max-width: 560px; margin: 64px auto; background: #fff; border: 1px solid #ddd6fe; border-radius: 16px; padding: 24px; }
    .title { font-size: 18px; font-weight: 800; color: #4c1d95; }
    .meta { margin-top: 12px; color: #6d28d9; font-size: 13px; }
    .btns { margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap; }
    button { border: 0; border-radius: 10px; padding: 10px 14px; cursor: pointer; font-weight: 700; }
    .primary { background: #7c3aed; color: #fff; }
    .ghost { background: #f3f4f6; color: #4c1d95; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="title">Toss Payments 결제창 (Mock)</div>
    <div class="meta">payment_id: ${paymentId}</div>
    <div class="meta">order_id: ${orderId}</div>
    <div class="meta">결제 시뮬레이션 후 return_url로 이동합니다.</div>
    <div class="btns">
      <button class="primary" id="go">계속</button>
      <button class="ghost" id="fail">실패로 이동</button>
      <button class="ghost" id="cancel">취소로 이동</button>
    </div>
  </div>
  <script>
    const ok = ${JSON.stringify(redirectTo)};
    const mk = (s) => {
      const u = new URL(ok);
      u.searchParams.set('paymentStatus', s);
      if (s === 'fail') u.searchParams.set('reason', 'mock_failure');
      return u.toString();
    };
    document.getElementById('go').addEventListener('click', () => location.href = ok);
    document.getElementById('fail').addEventListener('click', () => location.href = mk('fail'));
    document.getElementById('cancel').addEventListener('click', () => location.href = mk('cancel'));
    // auto proceed (success)
    setTimeout(() => location.href = ok, 900);
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
