import { NextResponse } from "next/server";

function svgDataUrl(label: string, bg = "#F3F4F6", fg = "#6B7280") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'>
  <rect width='100%' height='100%' fill='${bg}'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-size='42' font-family='ui-sans-serif,system-ui'>${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ artworkId: string }> }
) {
  const { artworkId } = await params;

  if (!artworkId || artworkId.trim().length === 0) {
    return NextResponse.json({ message: "Invalid artwork_id" }, { status: 400 });
  }

  // MVP: mock response for UI composition (DB 연동은 추후).
  // 도메인 제한 없이 next/image를 사용할 수 있도록 data URL을 반환합니다.
  const payload = {
    artwork_detail: {
      artwork_id: artworkId,
      title: "봄의 정원 - 캔버스 프린트",
      description_short:
        "부드러운 수채 느낌의 봄 풍경을 캔버스에 인쇄한 작품입니다. 원본은 60x80cm이며, 주문 제작 옵션을 지원합니다.",
      description_long:
        "이 작품은 작가 김소연의 2025년 컬렉션 중 하나로, 아크릴과 수채의 혼합 기법을 사용해 따뜻한 봄빛을 표현했습니다. 캔버스 인쇄는 고해상도 프린팅으로 원작의 질감을 재현합니다.",
      images: [
        svgDataUrl("Main", "#FFFFFF", "#111827"),
        svgDataUrl("Thumb 1", "#111827", "#E5E7EB"),
        svgDataUrl("Thumb 2", "#111827", "#E5E7EB"),
        svgDataUrl("Thumb 3", "#111827", "#E5E7EB"),
        svgDataUrl("Thumb 4", "#111827", "#E5E7EB"),
      ],
      price: 120000,
      stock: 5,
      created_at: "2026-02-15",
      tags: ["수채", "봄", "풍경", "캔버스"],
      artist_info: {
        name: "김소연",
        bio: "김소연 - 서울 기반 회화 작가. 자연의 색채와 질감을 캔버스에 담아내는 작업을 이어오고 있습니다. 신규 등록 아티스트 전용 지원 프로그램을 통해 전시 및 판매를 지원합니다.",
      },
      related_items: [
        {
          artwork_id: "related_1",
          title: "여름의 창가",
          artist_name: "이민호",
          price: 95000,
          thumbnail_url: svgDataUrl("Related 1", "#EF4444", "#FFFFFF"),
        },
        {
          artwork_id: "related_2",
          title: "해변의 오후",
          artist_name: "박지우",
          price: 155000,
          thumbnail_url: svgDataUrl("Related 2", "#8B5CF6", "#FFFFFF"),
        },
        {
          artwork_id: "related_3",
          title: "가을의 길",
          artist_name: "윤하늘",
          price: 110000,
          thumbnail_url: svgDataUrl("Related 3", "#EF4444", "#FFFFFF"),
        },
      ],
    },
  };

  return NextResponse.json(payload, { status: 200 });
}
