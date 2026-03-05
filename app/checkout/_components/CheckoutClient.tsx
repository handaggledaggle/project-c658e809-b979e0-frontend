"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  CreditCard,
  Headset,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";

type SizeOption = "Small" | "Medium" | "Large";

const PRICE_BY_SIZE: Record<SizeOption, number> = {
  Small: 120_000,
  Medium: 150_000,
  Large: 180_000,
};

const FRAME_OPTION_PRICE = 15_000;
const SHIPPING_FEE = 3_500;

function formatKRW(amount: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

type Props = {
  initialArtwork: {
    artworkId: string;
    title: string;
    artistName: string;
    year: string;
  };
  paymentResult: {
    status?: string;
    orderId?: string;
    reason?: string;
  };
};

export default function CheckoutClient({ initialArtwork, paymentResult }: Props) {
  const router = useRouter();

  const [size, setSize] = useState<SizeOption>("Small");
  const [quantity, setQuantity] = useState<number>(1);
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricing = useMemo(() => {
    const artworkAmount = PRICE_BY_SIZE[size] * quantity;
    const optionAmount = FRAME_OPTION_PRICE * quantity;
    const shipping = SHIPPING_FEE;
    const total = artworkAmount + optionAmount + shipping;

    return {
      artworkAmount,
      optionAmount,
      shipping,
      total,
    };
  }, [quantity, size]);

  const paymentBanner = useMemo(() => {
    if (!paymentResult.status) return null;

    const status = paymentResult.status;
    const orderId = paymentResult.orderId;

    if (status === "success") {
      return {
        tone: "success" as const,
        title: "결제가 완료되었습니다.",
        description: orderId ? `주문번호: ${orderId}` : "주문이 확정되었습니다.",
      };
    }

    if (status === "fail") {
      return {
        tone: "error" as const,
        title: "결제가 실패했습니다.",
        description:
          paymentResult.reason ??
          "인증 실패/취소 등의 사유로 결제가 완료되지 않았습니다. 다시 시도해 주세요.",
      };
    }

    if (status === "cancel") {
      return {
        tone: "warning" as const,
        title: "결제가 취소되었습니다.",
        description: "결제를 취소하셨습니다. 다시 결제할 수 있습니다.",
      };
    }

    return {
      tone: "warning" as const,
      title: "결제 결과를 확인할 수 없습니다.",
      description: "상태를 확인할 수 없어 주문/결제가 보류될 수 있습니다.",
    };
  }, [paymentResult.orderId, paymentResult.reason, paymentResult.status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!address.trim()) {
      setError("배송지를 입력해 주세요.");
      return;
    }
    if (!phone.trim()) {
      setError("연락처를 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);

      // 1) 주문 생성
      const orderRes = await fetch("/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo_user_001",
          items: [
            {
              artwork_id: initialArtwork.artworkId,
              option: size,
              quantity,
            },
          ],
          shipping_address: {
            address,
            phone,
            memo: memo.trim() ? memo : undefined,
          },
        }),
      });

      const orderJson = await orderRes.json().catch(() => null);
      if (!orderRes.ok) {
        setError(orderJson?.error ?? "주문 생성에 실패했습니다.");
        return;
      }

      const orderId = orderJson?.order_id as string | undefined;
      const totalAmount = orderJson?.total_amount as number | undefined;

      if (!orderId || typeof totalAmount !== "number") {
        setError("주문 응답이 올바르지 않습니다.");
        return;
      }

      // 2) 결제 요청 생성 (Toss 데모)
      const returnUrl = `${window.location.origin}/checkout`;

      const payRes = await fetch("/api/v1/payments/toss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          payment_method: "TOSS",
          amount: totalAmount,
          return_url: returnUrl,
        }),
      });

      const payJson = await payRes.json().catch(() => null);
      if (!payRes.ok) {
        setError(payJson?.error ?? "결제 요청 생성에 실패했습니다.");
        return;
      }

      const paymentUrl = payJson?.payment_url as string | undefined;
      if (!paymentUrl) {
        setError("결제 URL이 생성되지 않았습니다.");
        return;
      }

      // 3) 결제창 이동(데모: mock redirect)
      window.location.href = paymentUrl;
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-white">
      <nav className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8">
        <span className="text-xl font-bold text-[#4C1D95]">printtie</span>
        <div className="hidden md:flex gap-6">
          <Link className="text-gray-500 hover:text-gray-900" href="#">
            작품 둘러보기
          </Link>
          <Link className="text-gray-500 hover:text-gray-900" href="#">
            작품 등록
          </Link>
          <Link className="text-gray-500 hover:text-gray-900" href="#">
            내 작품
          </Link>
          <Link className="text-gray-500 hover:text-gray-900" href="/checkout">
            주문/결제
          </Link>
          <Link className="text-gray-500 hover:text-gray-900" href="#">
            관리자 콘솔
          </Link>
        </div>
        <Button variant="secondary">Sign Up</Button>
      </nav>

      <main className="flex flex-col gap-12 bg-white px-8 py-12">
        {paymentBanner && (
          <Card
            className={cn(
              "border-[#DDD6FE]",
              paymentBanner.tone === "success" && "bg-[#F5F3FF]",
              paymentBanner.tone === "error" && "bg-[#FEF2F2] border-[#FCA5A5]",
              paymentBanner.tone === "warning" && "bg-[#FFFBEB] border-[#FCD34D]"
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-[#4C1D95]">{paymentBanner.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#4C1D95]">
              <div className="flex flex-col gap-1">
                <p>{paymentBanner.description}</p>
                <p className="text-[#6D28D9]">
                  동일 페이지에서 다시 결제를 시도할 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <section
          className="flex flex-col lg:flex-row items-start gap-8 rounded-2xl p-8 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] border border-white/20"
          aria-label="결제 및 주문 생성"
        >
          <div className="flex flex-col gap-4 lg:w-[55%]">
            <h1 className="text-2xl font-bold text-white">결제 및 주문 생성</h1>
            <p className="text-white/90 max-w-2xl">
              선택한 사이즈로 주문을 생성하고 Toss Payments 결제창으로 안전하게 이동합니다.
              결제 상태는 실시간으로 반영되어 주문 성공/실패 안내를 제공합니다.
            </p>
            <div className="flex gap-3 items-center mt-4 flex-wrap">
              <Badge className="bg-white/15 text-white border border-white/20 hover:bg-white/20">
                주문 전환율 최적화
              </Badge>
              <Badge className="bg-white/15 text-white border border-white/20 hover:bg-white/20">
                결제 성공률 모니터링
              </Badge>
              <Badge className="bg-white/15 text-white border border-white/20 hover:bg-white/20">
                <ShieldCheck className="mr-1 h-4 w-4" />
                서버 기준 금액 검증
              </Badge>
            </div>
          </div>

          <Card className="flex-1 bg-white/10 border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative w-36 h-36 rounded-md overflow-hidden border border-white/30 bg-white/10">
                  <Image
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='288' height='288'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%237C3AED'/%3E%3Cstop offset='1' stop-color='%23A78BFA'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E"
                    alt="작품 썸네일"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-semibold">{initialArtwork.title}</h3>
                    <p className="text-sm text-white/70">
                      {initialArtwork.artistName} • {initialArtwork.year}
                    </p>
                  </div>
                  <p className="text-sm text-white/90">
                    간단한 작품 요약과 주문 시 참고할 설명을 표시합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col lg:flex-row gap-8" aria-label="주문 입력">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 lg:w-1/2"
          >
            <Card className="border border-[#DDD6FE] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#4C1D95]">
                  주문 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm text-[#4C1D95]">사이즈 선택</Label>
                  <div className="flex gap-3 flex-wrap">
                    {(["Small", "Medium", "Large"] as SizeOption[]).map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        variant={size === opt ? "default" : "outline"}
                        className={cn(
                          size === opt
                            ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                            : "border-[#DDD6FE] text-[#4C1D95]"
                        )}
                        onClick={() => setSize(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-[#4C1D95]">수량</Label>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-[#DDD6FE] bg-white shadow-sm px-2 py-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-[#4C1D95]"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || submitting}
                      aria-label="수량 감소"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-medium text-[#4C1D95]">
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-[#4C1D95]"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      disabled={quantity >= 99 || submitting}
                      aria-label="수량 증가"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-[#4C1D95]">배송지 (간단 입력)</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="예) 서울시 강남구 ..."
                    className="border-[#DDD6FE] shadow-sm"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-[#4C1D95]">연락처</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="예) 010-1234-5678"
                    className="border-[#DDD6FE] shadow-sm"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-[#4C1D95]">메모 (선택)</Label>
                  <Input
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="배송 요청사항 등을 입력"
                    className="border-[#DDD6FE] shadow-sm"
                    disabled={submitting}
                  />
                </div>

                {error && (
                  <Card className="border-[#FCA5A5] bg-[#FEF2F2]">
                    <CardContent className="p-3 text-sm text-[#991B1B]">
                      {error}
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-col gap-3">
                  <p className="text-sm text-[#6D28D9]">
                    주문 생성 시 결제 창으로 이동합니다. 결제 완료 후 주문이 확정됩니다.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[#4C1D95]"
                      onClick={() => router.back()}
                      disabled={submitting}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> 이전
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                      disabled={submitting}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {submitting ? "결제 준비 중..." : "결제하기 (Toss)"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#DDD6FE]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#4C1D95]">
                  결제 안내
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[#4C1D95]">
                <ul className="flex flex-col gap-2">
                  <li>1) 주문 생성 후 Toss Payments 결제창이 팝업/리다이렉트 됩니다.</li>
                  <li>2) 결제 성공 시 주문번호와 함께 확인 페이지로 이동합니다.</li>
                  <li>
                    3) 결제 실패 또는 취소 시, 주문은 자동으로 취소되며 재결제 가능합니다.
                  </li>
                  <li>
                    4) 문제가 발생하면 고객센터로 문의해 주세요: support@printtie.example
                  </li>
                </ul>
              </CardContent>
            </Card>
          </form>

          <aside className="lg:w-1/2 flex flex-col gap-6">
            <Card className="bg-[#FAF5FF] border border-[#DDD6FE]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#4C1D95]">
                  결제 요약
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#4C1D95]">작품 금액</span>
                  <span className="text-[#4C1D95]">{formatKRW(pricing.artworkAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4C1D95]">옵션 (프레임)</span>
                  <span className="text-[#4C1D95]">{formatKRW(pricing.optionAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4C1D95]">배송비</span>
                  <span className="text-[#4C1D95]">{formatKRW(pricing.shipping)}</span>
                </div>
                <Separator className="bg-[#DDD6FE]" />
                <div className="flex justify-between items-end">
                  <span className="text-[#4C1D95] font-semibold">총 결제금액</span>
                  <span className="text-[#4C1D95] text-xl font-bold">
                    {formatKRW(pricing.total)}
                  </span>
                </div>
                <div className="text-sm text-[#6D28D9]">
                  결제 수단: Toss Payments (신용카드, 계좌이체 등)
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#DDD6FE]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#4C1D95]">
                  결제 상태 처리 흐름
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[#4C1D95]">
                <ol className="flex flex-col gap-2">
                  <li>1. 주문 생성 요청 → 서버에서 주문 레코드 생성 (결제 대기 상태)</li>
                  <li>2. Toss 결제창 호출 → 사용자가 결제 진행</li>
                  <li>3. 결제 결과 콜백 수신 → 결제 성공/실패 처리 및 DB 업데이트</li>
                  <li>4. 결제 성공 시 아티스트에 판매 알림 및 정산 대상 등록</li>
                  <li>5. 결제 실패 시 사용자 안내 및 재결제 유도</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-[#FAF5FF] border-[#DDD6FE]">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <h4 className="text-lg font-bold text-[#4C1D95]">문제가 발생했나요?</h4>
                <p className="text-sm text-[#6D28D9] mt-2">
                  결제 오류가 반복되면 고객센터에서 결제 로그와 주문번호로 도움을 드립니다.
                </p>
                <Button
                  asChild
                  className="mt-4 bg-[#7C3AED] hover:bg-[#6D28D9]"
                >
                  <a href="mailto:support@printtie.example?subject=printtie%20%EA%B2%B0%EC%A0%9C%20%EB%AC%B8%EC%9D%98">
                    <Headset className="mr-2 h-4 w-4" /> 고객센터 문의
                  </a>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>

      <footer className="flex flex-col md:flex-row md:items-start justify-between gap-8 py-12 px-8 bg-[#FFFFFF] border-t border-[#F3E8FF]">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">printtie</span>
          <p className="text-[#6D28D9] text-sm">© 2026 printtie. All rights reserved.</p>
        </div>
        <div className="flex gap-12 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className="text-[#6D28D9] text-sm">Company</p>
            <p className="text-[#6D28D9] text-sm">About</p>
            <p className="text-[#6D28D9] text-sm">Careers</p>
            <p className="text-[#6D28D9] text-sm">Contact</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#6D28D9] text-sm">Support</p>
            <p className="text-[#6D28D9] text-sm">Help Center</p>
            <p className="text-[#6D28D9] text-sm">Terms</p>
            <p className="text-[#6D28D9] text-sm">Privacy Policy</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#6D28D9] text-sm">For Artists</p>
            <p className="text-[#6D28D9] text-sm">How to Sell</p>
            <p className="text-[#6D28D9] text-sm">Fees & Payouts</p>
            <p className="text-[#6D28D9] text-sm">Guidelines</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
