"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArtworkCard, type ArtworkSummary } from "@/app/_components/home/ArtworkCard";

type ApiResponse = {
  items: ArtworkSummary[];
  total: number;
  page: number;
  size: number;
};

type SortKey = "latest" | "popular" | "price_asc";

export function ArtworkGridClient() {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("latest");
  const [items, setItems] = React.useState<ArtworkSummary[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const size = 4;

  const fetchPage = React.useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(nextPage),
          size: String(size),
          q,
          sort,
        });

        const res = await fetch(`/api/v1/artworks?${params.toString()}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Failed to load artworks: ${res.status}`);
        const data = (await res.json()) as ApiResponse;

        setTotal(data.total);
        setPage(data.page);
        setItems((prev) => (mode === "replace" ? data.items : [...prev, ...data.items]));
      } finally {
        setLoading(false);
      }
    },
    [q, sort]
  );

  React.useEffect(() => {
    const t = setTimeout(() => {
      fetchPage(1, "replace");
    }, 200);
    return () => clearTimeout(t);
  }, [fetchPage]);

  const canLoadMore = items.length < total;

  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#4C1D95]">작품 목록</h2>
          <p className="text-[#6D28D9] mt-1">
            최신 등록순으로 아티스트의 작품을 확인하세요. 필터와 검색으로 빠르게 원하는 작품을 찾을 수 있습니다.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <Input
            className="border border-[#DDD6FE] bg-white shadow-lg text-[#4C1D95] rounded-lg px-4 py-2 w-[260px]"
            placeholder="작가명 / 작품명으로 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="h-10 border border-[#DDD6FE] bg-white shadow-lg text-[#4C1D95] rounded-lg px-4 py-2"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="정렬"
          >
            <option className="text-[#4C1D95]" value="latest">
              최신순
            </option>
            <option className="text-[#4C1D95]" value="popular">
              인기순
            </option>
            <option className="text-[#4C1D95]" value="price_asc">
              가격 낮은순
            </option>
          </select>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                data-component="button"
                className="bg-white shadow-lg text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-4 py-2 hover:bg-white"
                variant="outline"
              >
                필터
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>필터 (MVP)</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-muted-foreground">
                MVP에서는 검색/정렬만 제공하며, 다음 단계에서 카테고리/태그/가격 범위 필터를 추가합니다.
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full">
        {items.map((art, idx) => (
          <ArtworkCard
            key={art.artwork_id}
            artwork={art}
            className={idx === 3 ? "col-span-3" : undefined}
          />
        ))}
      </div>

      <div className="w-full flex justify-center mt-8">
        <Button
          data-component="button"
          className="bg-white shadow-lg text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-6 py-2 hover:bg-white disabled:opacity-60"
          variant="outline"
          disabled={loading || !canLoadMore}
          onClick={() => fetchPage(page + 1, "append")}
        >
          더 보기
        </Button>
      </div>
    </div>
  );
}
