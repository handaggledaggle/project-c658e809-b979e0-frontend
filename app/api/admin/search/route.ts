import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AdminSearchType = "artwork" | "user" | "order";

type AdminStatus =
  | "PUBLIC"
  | "PRIVATE"
  | "REPORTED"
  | "ACTIVE"
  | "BLOCKED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED";

type SearchItem = {
  id: string;
  type: AdminSearchType;
  title: string;
  subtitle?: string;
  status: AdminStatus;
  createdAt: string;
};

function mockItems(type: AdminSearchType): SearchItem[] {
  const now = Date.now();
  if (type === "artwork") {
    return [
      {
        id: "art_4521",
        type,
        title: 'art_4521 — "해변의 오후"',
        subtitle: "작가: 정현",
        status: "PRIVATE",
        createdAt: new Date(now - 1000 * 60 * 90).toISOString(),
      },
      {
        id: "art_7780",
        type,
        title: 'art_7780 — "밤의 정원"',
        subtitle: "작가: artist_kim",
        status: "PUBLIC",
        createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      },
      {
        id: "art_9012",
        type,
        title: 'art_9012 — "드로잉 스터디"',
        subtitle: "작가: lee_haeun",
        status: "REPORTED",
        createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
      },
    ];
  }
  if (type === "user") {
    return [
      {
        id: "user_1029",
        type,
        title: "user_1029 — minsu@example.com",
        subtitle: "역할: ARTIST",
        status: "ACTIVE",
        createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: "user_2031",
        type,
        title: "user_2031 — suspicious@example.com",
        subtitle: "최근 결제 실패 다수",
        status: "BLOCKED",
        createdAt: new Date(now - 1000 * 60 * 15).toISOString(),
      },
    ];
  }
  return [
    {
      id: "ord_20260305_0098",
      type,
      title: "ord_20260305_0098 — 12,000원",
      subtitle: "결제: Toss / 구매자: user_1029",
      status: "SUCCESS",
      createdAt: new Date(now - 1000 * 60 * 50).toISOString(),
    },
    {
      id: "ord_20260305_0111",
      type,
      title: "ord_20260305_0111 — 35,000원",
      subtitle: "결제 승인 오류(재처리 필요)",
      status: "FAILED",
      createdAt: new Date(now - 1000 * 60 * 10).toISOString(),
    },
  ];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const type = (searchParams.get("type") ?? "artwork") as AdminSearchType;
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const status = searchParams.get("status");

  const base = mockItems(type);

  let items = base;
  if (q) {
    items = items.filter(
      (it) => it.id.toLowerCase().includes(q) || it.title.toLowerCase().includes(q) || (it.subtitle ?? "").toLowerCase().includes(q)
    );
  }

  if (status && status !== "ALL") {
    items = items.filter((it) => it.status === status);
  }

  return NextResponse.json({ items });
}
