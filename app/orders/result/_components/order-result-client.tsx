"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Headset,
  Info,
  Loader2,
  Receipt,
  RefreshCcw,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Status = "SUCCESS" | "FAILED" | "PENDING";

type OrderItem = {
  id: string;
  title: string;
  artistName: string;
  option: string;
  quantity: number;
  price: number;
  thumbnailUrl?: string;
  eta?: string;
};

type OrderAddon = {
  id: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
};

type OrderResult = {
  orderId: string;
  status: Status;
  statusLabel: string;
  statusMessage: string;
  paidAt?: string;
  paymentMethod?: string;
  totalAmount: number;
  currency: "KRW";
  items: OrderItem[];
  addons: OrderAddon[];
  stats: {
    paymentSuccessRate: number;
    csWeeklyCount: number;
    avgOrderValue: number;
    avgIssueResolutionHours: number;
  };
  gateway?: {
    paymentKey?: string;
    amount?: string;
    code?: string;
    message?: string;
  };
};

function formatKRW(amount: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

function svgPlaceholder(width = 320, height = 240, label = "image") {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#EDE9FE'/>
        <stop offset='1' stop-color='#DDD6FE'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-family='ui-sans-serif, system-ui' font-size='16' fill='#6D28D9'>${label}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function OrderResultClient({
  initialOrderId,
  initialStatus,
  initialGatewayPayload,
}: {
  initialOrderId?: string;
  initialStatus: Status;
  initialGatewayPayload?: {
    paymentKey?: string;
    amount?: string;
    message?: string;
    code?: string;
  };
}) {
  const [data, setData] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = initialOrderId ?? "PT-20260305-1248";

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const qs = new URLSearchParams();
        qs.set("orderId", orderId);
        qs.set("status", initialStatus);
        if (initialGatewayPayload?.paymentKey) qs.set("paymentKey", initialGatewayPayload.paymentKey);
        if (initialGatewayPayload?.amount) qs.set("amount", initialGatewayPayload.amount);
        if (initialGatewayPayload?.code) qs.set("code", initialGatewayPayload.code);
        if (initialGatewayPayload?.message) qs.set("message", initialGatewayPayload.message);

        const res = await fetch(`/api/orders/result?${qs.toString()}`,
          {
            method: "GET",
            headers: { "Accept": "application/json" },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Request failed (${res.status})`);
        }

        const json = (await res.json()) as OrderResult;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "요청 처리 중 오류가 발생했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [orderId, initialStatus, initialGatewayPayload?.amount, initialGatewayPayload?.code, initialGatewayPayload?.message, initialGatewayPayload?.paymentKey]);

  const derived = useMemo(() => {
    if (data) return data;

    // fallback skeleton-ish data (used briefly before fetch finishes)
    return {
      orderId,
      status: initialStatus,
      statusLabel: initialStatus === "SUCCESS" ? "결제 성공" : initialStatus === "FAILED" ? "결제 실패" : "결제 확인 중",
      statusMessage:
        initialStatus === "SUCCESS"
          ? "감사합니다. 주문이 정상 처리되었습니다."
          : initialStatus === "FAILED"
            ? "결제가 완료되지 않았습니다. 다시 시도하거나 고객센터에 문의하세요."
            : "결제 결과를 확인하고 있습니다. 잠시만 기다려 주세요.",
      paidAt: "2026-03-05 14:28",
      paymentMethod: "신용카드 (Visa)",
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
      gateway: initialGatewayPayload,
    } satisfies OrderResult;
  }, [data, initialStatus, initialGatewayPayload, orderId]);

  const statusIcon =
    derived.status === "SUCCESS" ? (
      <CheckCircle2 className="h-5 w-5" />
    ) : derived.status === "FAILED" ? (
      <XCircle className="h-5 w-5" />
    ) : (
      <Info className="h-5 w-5" />
    );

  const statusBadgeVariant = derived.status === "SUCCESS" ? "default" : derived.status === "FAILED" ? "destructive" : "secondary";

  return (
    <>
      <section
        data-section-type="hero"
        className="flex flex-col lg:flex-row gap-6 items-stretch justify-between rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] p-6"
      >
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">결제 결과</h1>
            <Badge variant={statusBadgeVariant as any} className="bg-white/15 text-white border border-white/20">
              <span className="inline-flex items-center gap-1">
                {statusIcon}
                {derived.statusLabel}
              </span>
            </Badge>
          </div>
          <p className="text-white/80">
            결제 완료 여부와 주문 요약을 확인하세요. 문제가 있을 경우 재시도 또는 고객센터로 문의해 주세요.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 mt-2">
            <Card className={cn("flex-1 border-white/20 bg-white/10 text-white", derived.status === "SUCCESS" ? "ring-1 ring-white/40" : "opacity-80")}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-white/15 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">결제 성공</span>
                  <span className="text-white/75 text-sm">감사합니다. 주문이 정상 처리되었습니다.</span>
                </div>
              </CardContent>
            </Card>

            <Card className={cn("flex-1 border-white/20 bg-white/10 text-white", derived.status === "FAILED" ? "ring-1 ring-white/40" : "opacity-80")}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-md bg-white/15 flex items-center justify-center">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">결제 실패</span>
                  <span className="text-white/75 text-sm">결제가 완료되지 않았습니다. 다시 시도하거나 고객센터에 문의하세요.</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {derived.status === "FAILED" && (derived.gateway?.code || derived.gateway?.message) ? (
            <Card className="border-white/20 bg-white/10 text-white">
              <CardContent className="p-4 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Info className="h-4 w-4" />
                  실패 사유
                </div>
                <div className="mt-2 text-white/80 space-y-1">
                  {derived.gateway?.code ? <div>코드: {derived.gateway.code}</div> : null}
                  {derived.gateway?.message ? <div>메시지: {derived.gateway.message}</div> : null}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="w-full lg:w-96 border-white/20 bg-white/10 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Receipt className="h-5 w-5" /> 주문 요약
            </CardTitle>
            <CardDescription className="text-white/75">결제/주문 기본 정보를 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <span className="text-white/70">주문 번호</span>
                <span className="text-white font-medium">{derived.orderId}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/70 inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" /> 결제 일시
                </span>
                <span className="text-white">{derived.paidAt ?? "-"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-white/70 inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> 결제 수단
                </span>
                <span className="text-white">{derived.paymentMethod ?? "-"}</span>
              </div>
              <Separator className="my-3 bg-white/20" />
              <div>
                <div className="text-white/70">총 결제금액</div>
                <div className="text-xl font-bold text-white">{formatKRW(derived.totalAmount)}</div>
                {derived.gateway?.amount && (
                  <div className="mt-1 text-xs text-white/65">PG 전달 금액: {derived.gateway.amount}</div>
                )}
              </div>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="text-white/80 inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> 최신 상태를 불러오는 중…
                </div>
              ) : error ? (
                <div className="text-white/80">
                  최신 상태를 불러오지 못했습니다.
                  <div className="mt-1 text-xs text-white/65 break-words">{error}</div>
                </div>
              ) : (
                <div className="text-white/80">서버 기준 상태가 반영되었습니다.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section data-section-type="features" className="flex flex-col bg-white shadow-lg px-4 py-8 rounded-xl">
        <h2 className="text-xl font-bold text-[#4C1D95]">구매 상품</h2>
        <div className="mt-4 flex flex-col lg:flex-row gap-4">
          <Card className="flex-1 border border-[#DDD6FE]">
            <CardContent className="p-4">
              {derived.items.map((it) => (
                <div key={it.id} className="flex gap-4 items-start">
                  <div className="relative w-28 h-20 rounded-sm overflow-hidden bg-gray-100">
                    <Image
                      src={it.thumbnailUrl ?? svgPlaceholder(280, 200, "artwork")}
                      alt={it.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="text-[#4C1D95] font-semibold">작품명: {it.title}</h3>
                        <p className="text-[#6D28D9] text-sm">아티스트: {it.artistName}</p>
                        <p className="text-[#6D28D9] text-sm">옵션: {it.option}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#4C1D95] font-semibold">{formatKRW(it.price)}</p>
                        <p className="text-[#6D28D9] text-sm">수량 {it.quantity}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-[#6D28D9] text-sm">배송 예정일: {it.eta ?? "-"}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="w-full lg:w-96 border border-[#DDD6FE]">
            <CardContent className="p-4">
              {derived.addons.length === 0 ? (
                <div className="text-sm text-[#6D28D9]">추가 옵션이 없습니다.</div>
              ) : (
                derived.addons.map((ad) => (
                  <div key={ad.id} className="flex gap-4 items-start">
                    <div className="relative w-20 h-16 rounded-sm overflow-hidden bg-gray-100">
                      <Image
                        src={ad.thumbnailUrl ?? svgPlaceholder(200, 160, "option")}
                        alt={ad.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#4C1D95] font-semibold">추가 옵션: {ad.title}</h3>
                      <p className="text-[#6D28D9] text-sm">{formatKRW(ad.price)}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section data-section-type="stats" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white shadow-lg px-4 py-8 rounded-xl">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex flex-col items-start" data-component="card">
            <p className="text-2xl font-bold text-[#4C1D95]">결제 성공률</p>
            <p className="text-[#6D28D9]">{derived.stats.paymentSuccessRate.toFixed(1)}%</p>
          </div>
          <div className="flex flex-col items-start" data-component="card">
            <p className="text-2xl font-bold text-[#4C1D95]">CS 문의(결제)</p>
            <p className="text-[#6D28D9]">주간 {derived.stats.csWeeklyCount}건</p>
          </div>
          <div className="flex flex-col items-start" data-component="card">
            <p className="text-2xl font-bold text-[#4C1D95]">평균 객단가</p>
            <p className="text-[#6D28D9]">{formatKRW(derived.stats.avgOrderValue)}</p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <p className="text-[#6D28D9] text-sm">문제 신고/처리 시간</p>
          <p className="text-[#4C1D95] font-semibold">평균 {derived.stats.avgIssueResolutionHours}시간</p>
        </div>
      </section>

      <section data-section-type="cta" className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#FFFFFF] px-4 py-8 rounded-xl">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-[#4C1D95]">결제에 문제가 있나요?</h3>
          <p className="text-[#6D28D9]">
            결제 실패시 아래 버튼으로 재시도하거나 고객센터로 문의해 주세요. 주문이 이미 생성된 경우 취소/환불 절차를 안내해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button asChild variant="outline" className="border-[#DDD6FE] text-[#4C1D95] shadow-sm">
              <Link href={`/checkout?orderId=${encodeURIComponent(orderId)}`} className="inline-flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" /> 결제 다시 시도
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-[#DDD6FE] text-[#4C1D95]">
              <a href="mailto:help@printtie.example" className="inline-flex items-center gap-2">
                <Headset className="h-4 w-4" /> 고객센터 문의
              </a>
            </Button>
          </div>
          <div className="mt-4">
            <Button asChild variant="secondary">
              <Link href={`/orders?highlight=${encodeURIComponent(orderId)}`}>구매 내역 보기</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <p className="text-[#6D28D9] text-sm">주문/결제 관련 문의</p>
          <p className="text-[#4C1D95] font-semibold">help@printtie.example</p>
          <p className="text-[#6D28D9] text-sm mt-2">운영시간: 평일 09:00 - 18:00</p>
        </div>
      </section>
    </>
  );
}
