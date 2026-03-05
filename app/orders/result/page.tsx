import Link from "next/link";
import { OrderResultClient } from "./_components/order-result-client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const orderId = typeof sp.orderId === "string" ? sp.orderId : typeof sp.order_id === "string" ? sp.order_id : undefined;

  // Common payment gateways include these query params:
  // - success page: ?orderId=...&paymentKey=...&amount=...
  // - fail page:    ?orderId=...&code=...&message=...
  const statusFromQuery = (() => {
    const status = typeof sp.status === "string" ? sp.status.toLowerCase() : undefined;
    const success = typeof sp.success === "string" ? sp.success.toLowerCase() : undefined;
    const code = typeof sp.code === "string" ? sp.code : undefined;

    if (status === "success") return "SUCCESS" as const;
    if (status === "fail" || status === "failed") return "FAILED" as const;

    if (success === "true") return "SUCCESS" as const;
    if (success === "false") return "FAILED" as const;

    if (code) return "FAILED" as const;
    return "PENDING" as const;
  })();

  const paymentKey = typeof sp.paymentKey === "string" ? sp.paymentKey : undefined;
  const amount = typeof sp.amount === "string" ? sp.amount : undefined;
  const message = typeof sp.message === "string" ? sp.message : undefined;
  const code = typeof sp.code === "string" ? sp.code : undefined;

  return (
    <div className="w-[1440px] max-w-full mx-auto flex flex-col">
      <nav
        className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8"
        data-section-type="navbar"
      >
        <Link href="/" className="text-xl font-bold text-[#4C1D95]">
          printtie
        </Link>
        <div className="hidden md:flex gap-6">
          <Link href="/artworks" className="text-[#6D28D9] hover:underline">
            작품 둘러보기
          </Link>
          <Link href="/artworks/new" className="text-[#6D28D9] hover:underline">
            작품 등록
          </Link>
          <Link href="/me/artworks" className="text-[#6D28D9] hover:underline">
            내 작품
          </Link>
          <Link href="/orders" className="text-[#6D28D9] hover:underline">
            주문/결제
          </Link>
          <Link href="/admin" className="text-[#6D28D9] hover:underline">
            관리자 콘솔
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/signup"
            className="bg-gray-100 text-[#6D28D9] rounded-lg px-4 py-2 text-sm font-medium"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="flex flex-col gap-8 bg-white px-8 py-10">
        <OrderResultClient
          initialOrderId={orderId}
          initialStatus={statusFromQuery}
          initialGatewayPayload={{ paymentKey, amount, message, code }}
        />
      </main>

      <footer data-section-type="footer" className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between py-12 px-8 bg-[#FFFFFF]">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">printtie</span>
          <p className="text-[#6D28D9] text-sm">© 2026 printtie. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[#6D28D9] text-sm">About</p>
          <p className="text-[#6D28D9] text-sm">Careers</p>
          <p className="text-[#6D28D9] text-sm">Contact</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[#6D28D9] text-sm">Help Center</p>
          <p className="text-[#6D28D9] text-sm">Terms</p>
          <p className="text-[#6D28D9] text-sm">Privacy</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[#6D28D9] text-sm">How to Sell</p>
          <p className="text-[#6D28D9] text-sm">Fees & Payouts</p>
          <p className="text-[#6D28D9] text-sm">Guidelines</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[#6D28D9] text-sm">Blog</p>
          <p className="text-[#6D28D9] text-sm">FAQ</p>
          <p className="text-[#6D28D9] text-sm">API & Docs</p>
        </div>
      </footer>
    </div>
  );
}
