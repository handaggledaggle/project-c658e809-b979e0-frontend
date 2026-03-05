"use client";

import * as React from "react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ArtworkCard, type ArtworkSummary } from "@/app/_components/home/ArtworkCard";

const MOCK: ArtworkSummary[] = [
  {
    artwork_id: "demo_art_001",
    title: "봄의 정원",
    artist_name: "김소연",
    medium: "캔버스 프린트",
    price: 120000,
    views: 1320,
  },
  {
    artwork_id: "demo_art_002",
    title: "여름의 창가",
    artist_name: "이민호",
    medium: "포스터",
    price: 95000,
    views: 860,
  },
  {
    artwork_id: "demo_art_003",
    title: "해변의 오후",
    artist_name: "박지우",
    medium: "아크릴",
    price: 155000,
    views: 2420,
  },
  {
    artwork_id: "demo_art_004",
    title: "가을의 길",
    artist_name: "윤하늘",
    medium: "수채",
    price: 110000,
    views: 530,
  },
  {
    artwork_id: "demo_art_005",
    title: "밤의 정원",
    artist_name: "정현",
    medium: "디지털",
    price: 89000,
    views: 4100,
  },
  {
    artwork_id: "demo_art_006",
    title: "드로잉 스터디",
    artist_name: "lee_haeun",
    medium: "연필",
    price: 45000,
    views: 220,
  },
];

export function ArtworkGridClient() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK;
    return MOCK.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.artist_name.toLowerCase().includes(q) ||
        a.medium.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="w-full max-w-[1120px]">
      <div className="flex flex-col gap-2">
        <h2 id="browse" className="text-3xl font-bold text-[#4C1D95]">
          인기 작품
        </h2>
        <p className="text-[#6D28D9]">
          데모 UI를 위한 목업 데이터입니다. 카드 클릭 시 상세 페이지 라우트 형태를 확인할 수 있습니다.
        </p>
      </div>

      <div className="mt-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="작품명/작가/매체로 검색"
          aria-label="작품 검색"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((artwork) => (
          <Link
            key={artwork.artwork_id}
            className={cn("block", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black")}
            href={`/artworks/${encodeURIComponent(artwork.artwork_id)}`}
          >
            <ArtworkCard artwork={artwork} className="h-full" />
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
          검색 결과가 없습니다.
        </div>
      ) : null}

      <div id="register" className="sr-only" />
      <div id="my" className="sr-only" />
      <div id="orders" className="sr-only" />
      <div id="admin" className="sr-only" />
    </div>
  );
}
