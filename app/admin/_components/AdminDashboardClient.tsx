"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Download, RotateCcw, Search, ShieldAlert, UserX, Wrench } from "lucide-react";

type Overview = {
  newArtistsWeekly: number;
  artworksCompletedWeekly: number;
  paymentSuccessRateDaily: number; // percent
};

type AdminSearchType = "artwork" | "user" | "order";

type AdminStatus = "PUBLIC" | "PRIVATE" | "REPORTED" | "ACTIVE" | "BLOCKED" | "PENDING" | "SUCCESS" | "FAILED";

type SearchItem = {
  id: string;
  type: AdminSearchType;
  title: string;
  subtitle?: string;
  status: AdminStatus;
  createdAt: string; // ISO
};

function formatTypeLabel(t: AdminSearchType) {
  switch (t) {
    case "artwork":
      return "작품";
    case "user":
      return "사용자";
    case "order":
      return "주문";
  }
}

function formatStatusLabel(s: AdminStatus) {
  switch (s) {
    case "PUBLIC":
      return "공개";
    case "PRIVATE":
      return "비공개";
    case "REPORTED":
      return "신고중";
    case "ACTIVE":
      return "활성";
    case "BLOCKED":
      return "차단";
    case "PENDING":
      return "대기";
    case "SUCCESS":
      return "성공";
    case "FAILED":
      return "실패";
  }
}

function statusVariant(s: AdminStatus): "default" | "secondary" | "destructive" | "outline" {
  if (s === "REPORTED" || s === "FAILED" || s === "BLOCKED") return "destructive";
  if (s === "PRIVATE" || s === "PENDING") return "secondary";
  if (s === "PUBLIC" || s === "SUCCESS" || s === "ACTIVE") return "default";
  return "outline";
}

export default function AdminDashboardClient() {
  const [overview, setOverview] = React.useState<Overview | null>(null);
  const [overviewLoading, setOverviewLoading] = React.useState<boolean>(true);

  const [query, setQuery] = React.useState<string>("");
  const [type, setType] = React.useState<AdminSearchType>("artwork");
  const [status, setStatus] = React.useState<string>("ALL");

  const [items, setItems] = React.useState<SearchItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const selectedCount = selectedIds.size;

  const fetchOverview = React.useCallback(async () => {
    setOverviewLoading(true);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      if (!res.ok) throw new Error("overview_fetch_failed");
      const data = (await res.json()) as Overview;
      setOverview(data);
    } catch {
      setOverview({ newArtistsWeekly: 12, artworksCompletedWeekly: 48, paymentSuccessRateDaily: 97 });
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  const runSearch = React.useCallback(async () => {
    setLoading(true);
    setSelectedIds(new Set());
    try {
      const sp = new URLSearchParams();
      if (query.trim()) sp.set("q", query.trim());
      sp.set("type", type);
      if (status !== "ALL") sp.set("status", status);

      const res = await fetch(`/api/admin/search?${sp.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("search_failed");
      const data = (await res.json()) as { items: SearchItem[] };
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [query, status, type]);

  React.useEffect(() => {
    void fetchOverview();
    void runSearch();
  }, [fetchOverview, runSearch]);

  const reset = () => {
    setQuery("");
    setType("artwork");
    setStatus("ALL");
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const downloadCsv = async () => {
    const sp = new URLSearchParams();
    if (query.trim()) sp.set("q", query.trim());
    sp.set("type", type);
    if (status !== "ALL") sp.set("status", status);

    const res = await fetch(`/api/admin/export?${sp.toString()}`, { cache: "no-store" });
    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin_export_${type}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const quickAction = async (action: "HIDE_ARTWORKS" | "WARN_USER" | "RETRY_PAYMENT") => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, targetIds: ids }),
    });

    await runSearch();
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4C1D95]">운영 대시보드</h1>
          <p className="text-sm text-[#6D28D9]">작품·사용자·주문을 검색하고 리스크를 관리하는 최소 관리자 도구</p>
        </div>

        <div className="flex gap-4">
          <Card className="flex flex-col items-end rounded-xl border border-[#DDD6FE] p-4 shadow-lg">
            <span className="text-sm text-[#6D28D9]">신규 가입 아티스트(주간)</span>
            <span className="text-lg font-semibold text-[#4C1D95]">
              {overviewLoading ? "…" : overview?.newArtistsWeekly ?? 0}
            </span>
          </Card>
          <Card className="flex flex-col items-end rounded-xl border border-[#DDD6FE] p-4 shadow-lg">
            <span className="text-sm text-[#6D28D9]">주간 작품 등록 완료</span>
            <span className="text-lg font-semibold text-[#4C1D95]">
              {overviewLoading ? "…" : overview?.artworksCompletedWeekly ?? 0}
            </span>
          </Card>
          <Card className="flex flex-col items-end rounded-xl border border-[#DDD6FE] p-4 shadow-lg">
            <span className="text-sm text-[#6D28D9]">결제 성공률(일)</span>
            <span className="text-lg font-semibold text-[#4C1D95]">
              {overviewLoading ? "…" : `${overview?.paymentSuccessRateDaily ?? 0}%`}
            </span>
          </Card>
        </div>
      </div>

      <div className="flex gap-6">
        <Card className="flex-1 rounded-xl border border-[#DDD6FE] p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-[#4C1D95]">검색 및 필터</h2>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-sm text-[#4C1D95]" htmlFor="admin-q">
                  검색어 (작품ID/작가명/주문ID)
                </Label>
                <div className="mt-1">
                  <Input
                    className="h-10 border-[#DDD6FE] text-[#4C1D95] shadow-lg"
                    id="admin-q"
                    placeholder='예: 작품123, artist_kim'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void runSearch();
                    }}
                  />
                </div>
              </div>

              <div className="w-48">
                <Label className="text-sm text-[#4C1D95]">타입</Label>
                <div className="mt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="h-10 w-full justify-between border border-[#DDD6FE] bg-white text-[#4C1D95] shadow-lg hover:bg-white"
                        variant="outline"
                      >
                        {formatTypeLabel(type)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => setType("artwork")}>작품</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setType("user")}>사용자</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setType("order")}>주문</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="w-48">
                <Label className="text-sm text-[#4C1D95]">상태</Label>
                <div className="mt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="h-10 w-full justify-between border border-[#DDD6FE] bg-white text-[#4C1D95] shadow-lg hover:bg-white"
                        variant="outline"
                      >
                        {status === "ALL" ? "전체" : status}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem onClick={() => setStatus("ALL")}>전체</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("PUBLIC")}>공개</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("PRIVATE")}>비공개</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("REPORTED")}>신고중</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("ACTIVE")}>활성</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("BLOCKED")}>차단</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("PENDING")}>대기</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("SUCCESS")}>성공</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("FAILED")}>실패</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]" onClick={() => void runSearch()}>
                <Search className="mr-2 h-4 w-4" />
                검색
              </Button>
              <Button
                className="border border-[#DDD6FE] bg-white text-[#4C1D95] shadow-lg hover:bg-white"
                variant="outline"
                onClick={reset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                초기화
              </Button>
              <Button
                className="border border-[#DDD6FE] bg-white text-[#4C1D95] shadow-lg hover:bg-white"
                variant="outline"
                onClick={() => void downloadCsv()}
              >
                <Download className="mr-2 h-4 w-4" />
                CSV 다운로드
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#DDD6FE] bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-[#DDD6FE] px-4 py-3">
              <div className="text-sm font-medium text-[#4C1D95]">
                검색 결과 {loading ? "(로딩 중)" : `(${items.length}건)`}
              </div>
              <div className="text-xs text-[#6D28D9]">선택: {selectedCount}건</div>
            </div>

            <div className="divide-y">
              {items.length === 0 ? (
                <div className="px-4 py-8 text-sm text-gray-500">결과가 없습니다.</div>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 px-4 py-3">
                    <input
                      aria-label="select"
                      checked={selectedIds.has(it.id)}
                      className="h-4 w-4 accent-[#6D28D9]"
                      type="checkbox"
                      onChange={() => toggleSelect(it.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-[#4C1D95]">
                        {it.title}
                        <span className="ml-2 text-xs font-normal text-[#6D28D9]">({formatTypeLabel(it.type)})</span>
                      </div>
                      {it.subtitle ? (
                        <div className="truncate text-xs text-gray-500">{it.subtitle}</div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusVariant(it.status)}>{formatStatusLabel(it.status)}</Badge>
                      <div className="w-36 text-right text-xs text-gray-500">
                        {new Date(it.createdAt).toLocaleString("ko-KR")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        <Card className="w-80 rounded-xl border border-[#DDD6FE] p-6 shadow-lg">
          <h3 className="text-md font-semibold text-[#4C1D95]">빠른 조치</h3>
          <div className="mt-4 flex flex-col gap-3">
            <Button
              className="bg-[#FAF5FF] text-[#4C1D95] hover:bg-[#F3E8FF]"
              disabled={selectedCount === 0}
              onClick={() => void quickAction("HIDE_ARTWORKS")}
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              선택 작품 비공개 처리
            </Button>
            <Button
              className="border border-[#DDD6FE] bg-white text-[#4C1D95] shadow-lg hover:bg-white"
              variant="outline"
              disabled={selectedCount === 0}
              onClick={() => void quickAction("WARN_USER")}
            >
              <UserX className="mr-2 h-4 w-4" />
              사용자 경고 발송
            </Button>
            <Button
              className="border border-[#DDD6FE] bg-white text-[#4C1D95] shadow-lg hover:bg-white"
              variant="outline"
              disabled={selectedCount === 0}
              onClick={() => void quickAction("RETRY_PAYMENT")}
            >
              <Wrench className="mr-2 h-4 w-4" />
              결제 오류 재처리
            </Button>
            <p className="pt-2 text-xs text-gray-500">
              빠른 조치는 MVP에서 “운영 프로세스 정의/기록”을 위한 최소 액션이며, 실제 권한/감사로그/알림 연동은 백엔드 정책에 맞춰 확장하세요.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
