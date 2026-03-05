"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";
import ArtworkCard, { type Artwork } from "./artwork-card";

type ListResponse = {
  items: Artwork[];
  total: number;
  page: number;
  size: number;
};

type StatusFilter = "ALL" | "SELLING" | "PRIVATE" | "SOLD_OUT";

function toCsv(items: Artwork[]) {
  const header = [
    "artwork_id",
    "title",
    "price_krw",
    "medium",
    "size",
    "tags",
    "is_public",
    "sales_count",
    "status",
  ];
  const rows = items.map((a) => [
    a.artworkId,
    a.title,
    String(a.priceKrw),
    a.medium,
    a.size,
    a.tags.join("|"),
    a.isPublic ? "Y" : "N",
    String(a.salesCount),
    a.sellStatus,
  ]);
  const escape = (v: string) => {
    const needs = /[",\n]/.test(v);
    const vv = v.replaceAll('"', '""');
    return needs ? `"${vv}"` : vv;
  };
  return [header, ...rows].map((r) => r.map((c) => escape(c)).join(",")).join("\n");
}

export default function ArtworkDashboard() {
  const [items, setItems] = React.useState<Artwork[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [size] = React.useState(9);

  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("ALL");

  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canLoadMore = items.length < total;

  const fetchList = React.useCallback(
    async (opts: { page: number; append: boolean }) => {
      const { page: nextPage, append } = opts;
      const sp = new URLSearchParams();
      sp.set("page", String(nextPage));
      sp.set("size", String(size));
      if (query.trim()) sp.set("q", query.trim());
      if (status !== "ALL") sp.set("status", status);

      const url = `/api/v1/artist/artworks?${sp.toString()}`;

      try {
        setError(null);
        append ? setLoadingMore(true) : setLoading(true);

        const res = await fetch(url, { method: "GET" });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `Failed: ${res.status}`);
        }
        const data = (await res.json()) as ListResponse;
        setTotal(data.total);
        setPage(data.page);
        setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "알 수 없는 오류";
        setError(msg);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, size, status]
  );

  React.useEffect(() => {
    void fetchList({ page: 1, append: false });
  }, [fetchList]);

  async function refresh() {
    await fetchList({ page: 1, append: false });
  }

  async function handleUpdated(_updated: Artwork) {
    // 서버에서 재조회(정합성 단순화)
    await refresh();
  }

  function exportCsv() {
    const csv = toCsv(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `printtie_my_artworks_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  React.useEffect(() => {
    const btn = document.getElementById("export-dashboard");
    if (!btn) return;
    const onClick = () => exportCsv();
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  }, [items]);

  return (
    <section className="flex flex-col bg-white border border-[#DDD6FE] rounded-lg p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#4C1D95]">등록한 작품 ({total})</h2>

        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex items-center gap-2 text-[#6D28D9]">
            <Label htmlFor="search" className="text-sm whitespace-nowrap">
              검색
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-[#6D28D9]" />
              <Input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void fetchList({ page: 1, append: false });
                }}
                className={cn(
                  "pl-9 w-[260px] border-[#DDD6FE] text-[#4C1D95] bg-white shadow-sm",
                  "placeholder:text-[#6D28D9]/70"
                )}
                placeholder="제목, 태그로 검색"
              />
            </div>
            <Button
              variant="outline"
              className="border-[#DDD6FE] text-[#4C1D95]"
              onClick={() => void fetchList({ page: 1, append: false })}
            >
              적용
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="status" className="text-sm text-[#6D28D9] whitespace-nowrap">
              상태
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className={cn(
                "h-9 rounded-md border border-[#DDD6FE] bg-white px-3 text-sm text-[#4C1D95] shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
              )}
            >
              <option value="ALL">전체 상태</option>
              <option value="SELLING">판매 중</option>
              <option value="PRIVATE">비공개</option>
              <option value="SOLD_OUT">품절</option>
            </select>
            <Button
              variant="outline"
              className="border-[#DDD6FE] text-[#4C1D95]"
              onClick={() => void fetchList({ page: 1, append: false })}
            >
              필터 적용
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <Card className="border-[#DDD6FE] p-4 mb-6">
          <div className="text-[#4C1D95] font-semibold">목록을 불러오지 못했어요.</div>
          <div className="text-sm text-[#6D28D9] mt-1 break-words">{error}</div>
          <div className="mt-3">
            <Button
              variant="outline"
              className="border-[#DDD6FE] text-[#4C1D95]"
              onClick={() => void fetchList({ page: 1, append: false })}
            >
              다시 시도
            </Button>
          </div>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#6D28D9]">
          <Loader2 className="size-5 animate-spin" />
          <span className="ml-2">불러오는 중…</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a) => (
              <ArtworkCard key={a.artworkId} artwork={a} onUpdated={handleUpdated} />
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-2">
            <Button
              variant="outline"
              className="border-[#DDD6FE] text-[#4C1D95]"
              disabled={!canLoadMore || loadingMore}
              onClick={() => void fetchList({ page: page + 1, append: true })}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  더 불러오는 중…
                </n              ) : (
                "더 보기"
              )}
            </Button>

            <Button
              variant="ghost"
              className="text-[#6D28D9]"
              onClick={() => void refresh()}
            >
              새로고침
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
