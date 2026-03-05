import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ArtworkSummary = {
  artwork_id: string;
  title: string;
  artist_name: string;
  medium: string;
  price: number;
  views: number;
};

function formatKRW(value: number) {
  try {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₩${value.toLocaleString("ko-KR")}`;
  }
}

function formatViews(views: number) {
  if (views >= 1000) {
    const k = Math.round((views / 1000) * 10) / 10;
    return `${k}k`;
  }
  return String(views);
}

export function ArtworkCard({
  artwork,
  className,
}: {
  artwork: ArtworkSummary;
  className?: string;
}) {
  return (
    <Card
      data-component="card"
      className={cn(
        "flex flex-col bg-white shadow-lg rounded-xl border border-[#DDD6FE] overflow-hidden",
        className
      )}
    >
      <div className="w-full h-48 bg-gray-200" />
      <div className="flex flex-col p-4 gap-2">
        <h3 className="text-lg font-semibold text-[#4C1D95]">{artwork.title}</h3>
        <p className="text-[#6D28D9] text-sm">
          작가: {artwork.artist_name} · {artwork.medium} · {formatKRW(artwork.price)}
        </p>
        <div className="flex justify-between items-center mt-3">
          <Button
            data-component="button"
            className="bg-white shadow-lg text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-3 py-1 h-8 hover:bg-white"
            variant="outline"
          >
            상세보기
          </Button>
          <span className="text-[#6D28D9] text-sm">조회 {formatViews(artwork.views)}</span>
        </div>
      </div>
    </Card>
  );
}
