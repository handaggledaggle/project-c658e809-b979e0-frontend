import { NextResponse } from "next/server";

type Artwork = {
  artworkId: string;
  title: string;
  internalIdLabel: string;
  medium: string;
  size: string;
  priceKrw: number;
  tags: string[];
  isPublic: boolean;
  salesCount: number;
  sellStatus: "SELLING" | "SOLD_OUT";
  thumbnailUrl?: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __printtie_artworks__: Artwork[] | undefined;
}

function seed(): Artwork[] {
  return [
    {
      artworkId: "art_1",
      title: "햇빛 아래 풍경",
      internalIdLabel: "PT-1023",
      medium: "아크릴화",
      size: "50x70cm",
      priceKrw: 120000,
      tags: ["풍경", "아크릴"],
      isPublic: true,
      salesCount: 3,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_2",
      title: "은하수 드로잉",
      internalIdLabel: "PT-0987",
      medium: "혼합 재료",
      size: "30x40cm",
      priceKrw: 85000,
      tags: ["드로잉", "우주"],
      isPublic: false,
      salesCount: 0,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_3",
      title: "미니멀 라인",
      internalIdLabel: "PT-1102",
      medium: "판화",
      size: "20x20cm",
      priceKrw: 35000,
      tags: ["미니멀", "판화"],
      isPublic: true,
      salesCount: 12,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_4",
      title: "블루 타임",
      internalIdLabel: "PT-1150",
      medium: "디지털",
      size: "A3",
      priceKrw: 45000,
      tags: ["밤", "도시"],
      isPublic: true,
      salesCount: 2,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_5",
      title: "정원 스케치",
      internalIdLabel: "PT-1158",
      medium: "연필",
      size: "21x29.7cm",
      priceKrw: 22000,
      tags: ["스케치", "식물"],
      isPublic: false,
      salesCount: 1,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_6",
      title: "바다의 리듬",
      internalIdLabel: "PT-1163",
      medium: "수채화",
      size: "40x50cm",
      priceKrw: 98000,
      tags: ["바다", "수채"],
      isPublic: true,
      salesCount: 6,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_7",
      title: "레트로 포스터",
      internalIdLabel: "PT-1171",
      medium: "디지털",
      size: "A2",
      priceKrw: 39000,
      tags: ["레트로", "포스터"],
      isPublic: true,
      salesCount: 0,
      sellStatus: "SOLD_OUT",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_8",
      title: "모노톤 인물",
      internalIdLabel: "PT-1177",
      medium: "목탄",
      size: "42x59.4cm",
      priceKrw: 76000,
      tags: ["인물", "모노톤"],
      isPublic: true,
      salesCount: 4,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_9",
      title: "포근한 오후",
      internalIdLabel: "PT-1182",
      medium: "오일파스텔",
      size: "25x25cm",
      priceKrw: 54000,
      tags: ["따뜻", "정물"],
      isPublic: true,
      salesCount: 7,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_10",
      title: "산책로",
      internalIdLabel: "PT-1190",
      medium: "펜드로잉",
      size: "A4",
      priceKrw: 28000,
      tags: ["풍경", "펜"],
      isPublic: true,
      salesCount: 1,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_11",
      title: "핑크 노을",
      internalIdLabel: "PT-1195",
      medium: "아크릴화",
      size: "60x60cm",
      priceKrw: 135000,
      tags: ["노을", "아크릴"],
      isPublic: false,
      salesCount: 0,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
    {
      artworkId: "art_12",
      title: "정적",
      internalIdLabel: "PT-1201",
      medium: "판화",
      size: "15x15cm",
      priceKrw: 18000,
      tags: ["미니멀", "흑백"],
      isPublic: true,
      salesCount: 9,
      sellStatus: "SELLING",
      thumbnailUrl: null,
    },
  ];
}

function getStore(): Artwork[] {
  if (!globalThis.__printtie_artworks__) globalThis.__printtie_artworks__ = seed();
  return globalThis.__printtie_artworks__;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const size = Math.min(30, Math.max(1, Number(searchParams.get("size") ?? "9")));
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const status = (searchParams.get("status") ?? "ALL").toUpperCase();

  let items = getStore().slice();

  if (q) {
    items = items.filter((a) => {
      const hay = `${a.title} ${a.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }

  if (status === "SELLING") {
    items = items.filter((a) => a.sellStatus === "SELLING" && a.isPublic);
  } else if (status === "PRIVATE") {
    items = items.filter((a) => !a.isPublic);
  } else if (status === "SOLD_OUT") {
    items = items.filter((a) => a.sellStatus === "SOLD_OUT");
  }

  // newest first (seed order is old->new; reverse to emulate)
  items = items.reverse();

  const total = items.length;
  const start = (page - 1) * size;
  const paged = items.slice(start, start + size);

  return NextResponse.json({ items: paged, total, page, size });
}
