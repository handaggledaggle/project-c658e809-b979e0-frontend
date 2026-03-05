"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type RelatedItem = {
  artwork_id: string;
  title: string;
  artist_name: string;
  price: number;
  thumbnail_url: string;
};

type ArtworkDetail = {
  artwork_id: string;
  title: string;
  description_short: string;
  description_long: string;
  images: string[];
  price: number;
  stock: number;
  created_at: string;
  tags: string[];
  artist_info: {
    name: string;
    bio: string;
  };
  related_items: RelatedItem[];
};

type ApiResponse = {
  artwork_detail: ArtworkDetail;
};

const purple = {
  deep: "#4C1D95",
  mid: "#6D28D9",
  border: "#DDD6FE",
  lavender: "#FAF5FF",
};

function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function useArtworkDetail(artworkId: string) {
  const [data, setData] = React.useState<ArtworkDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/v1/artworks/${encodeURIComponent(artworkId)}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          const msg = `작품 정보를 불러오지 못했습니다. (${res.status})`;
          throw new Error(msg);
        }

        const json = (await res.json()) as ApiResponse;
        if (mounted) setData(json.artwork_detail);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "알 수 없는 오류");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [artworkId]);

  return { data, loading, error };
}

function NavBar() {
  return (
    <nav
      className={cn(
        "h-16 bg-white border-b shadow-sm flex items-center justify-between px-8",
        "border-[--border]"
      )}
      style={{
        // @ts-expect-error css var
        "--border": purple.border,
      }}
    >
      <span className="text-xl font-bold" style={{ color: purple.deep }}>
        printtie
      </span>

      <div className="flex gap-6">
        <Link className="text-sm" href="#" style={{ color: purple.mid }}>
          작품 둘러보기
        </Link>
        <Link className="text-sm" href="#" style={{ color: purple.mid }}>
          작품 등록
        </Link>
        <Link className="text-sm" href="#" style={{ color: purple.mid }}>
          내 작품
        </Link>
        <Link className="text-sm" href="#" style={{ color: purple.mid }}>
          주문/결제
        </Link>
        <Link className="text-sm" href="#" style={{ color: purple.mid }}>
          관리자 콘솔
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="secondary"
          className="rounded-lg px-4 py-2 bg-gray-100"
          style={{ color: purple.mid }}
        >
          로그인
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="rounded-lg px-4 py-2 bg-gray-100"
          style={{ color: purple.mid }}
        >
          가입하기
        </Button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="flex justify-between py-12 px-8 bg-white">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-bold text-gray-900">printtie</span>
        <p className="text-sm" style={{ color: purple.mid }}>
          © 2026 printtie. All rights reserved.
        </p>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col gap-2">
          <p className="text-gray-700 font-semibold">Company</p>
          <p className="text-sm" style={{ color: purple.mid }}>
            About
          </p>
          <p className="text-sm" style={{ color: purple.mid }}>
            Careers
          </p>
          <p className="text-sm" style={{ color: purple.mid }}>
            Contact
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-gray-700 font-semibold">Support</p>
          <p className="text-sm" style={{ color: purple.mid }}>
            Help Center
          </p>
          <p className="text-sm" style={{ color: purple.mid }}>
            Terms
          </p>
          <p className="text-sm" style={{ color: purple.mid }}>
            Privacy Policy
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-gray-700 font-semibold">For Artists</p>
          <p className="text-sm" style={{ color: purple.mid }}>
            How to Sell
          </p>
          <p className="text-sm" style={{ color: purple.mid }}>
            Fees & Payouts
          </p>
          <p className="text-sm" style={{ color: purple.mid }}>
            Guidelines
          </p>
        </div>
      </div>
    </footer>
  );
}

function ShadowCard({
  title,
  description,
  children,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn("shadow-lg border rounded-lg")}
      style={{ borderColor: purple.border }}
    >
      {(title || description) && (
        <CardHeader className="p-6">
          {title ? (
            <CardTitle className="text-lg" style={{ color: purple.deep }}>
              {title}
            </CardTitle>
          ) : null}
          {description ? (
            <CardDescription className="text-sm" style={{ color: purple.mid }}>
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
      )}
      <CardContent className={cn(title || description ? "p-6 pt-0" : "p-6")}>
        {children}
      </CardContent>
    </Card>
  );
}

function RelatedArtworkCard({ item }: { item: RelatedItem }) {
  return (
    <Card
      className="flex flex-col bg-white shadow-lg rounded-xl border overflow-hidden"
      style={{ borderColor: purple.border }}
    >
      <div className="relative w-64 h-40 bg-gray-200">
        <Image
          src={item.thumbnail_url}
          alt={`${item.title} 썸네일`}
          fill
          sizes="256px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col p-4 gap-2">
        <h3 className="text-lg font-semibold" style={{ color: purple.deep }}>
          {item.title}
        </h3>
        <p className="text-sm" style={{ color: purple.mid }}>
          작가: {item.artist_name} · ₩{formatKRW(item.price)}
        </p>
      </div>
    </Card>
  );
}

export default function ArtworkDetailClient({ artworkId }: { artworkId: string }) {
  const { data, loading, error } = useArtworkDetail(artworkId);

  const fallback: ArtworkDetail = React.useMemo(
    () => ({
      artwork_id: artworkId,
      title: "봄의 정원 - 캔버스 프린트",
      description_short:
        "부드러운 수채 느낌의 봄 풍경을 캔버스에 인쇄한 작품입니다. 원본은 60x80cm이며, 주문 제작 옵션을 지원합니다.",
      description_long:
        "이 작품은 작가 김소연의 2025년 컬렉션 중 하나로, 아크릴과 수채의 혼합 기법을 사용해 따뜻한 봄빛을 표현했습니다. 캔버스 인쇄는 고해상도 프린팅으로 원작의 질감을 재현합니다.",
      images: [],
      price: 120000,
      stock: 5,
      created_at: "2026-02-15",
      tags: ["수채", "봄", "풍경", "캔버스"],
      artist_info: {
        name: "김소연",
        bio: "김소연 - 서울 기반 회화 작가. 자연의 색채와 질감을 캔버스에 담아내는 작업을 이어오고 있습니다. 신규 등록 아티스트 전용 지원 프로그램을 통해 전시 및 판매를 지원합니다.",
      },
      related_items: [],
    }),
    [artworkId]
  );

  const artwork = data ?? fallback;

  const images = artwork.images?.length
    ? artwork.images
    : [
        // If API is down, the page still renders safely.
        "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'><rect width='100%' height='100%' fill='#F3F4F6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6B7280' font-size='36' font-family='ui-sans-serif,system-ui'>Artwork</text></svg>`
          ),
        "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='560'><rect width='100%' height='100%' fill='#111827'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#E5E7EB' font-size='28' font-family='ui-sans-serif,system-ui'>Thumb 1</text></svg>`
          ),
        "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='560'><rect width='100%' height='100%' fill='#111827'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#E5E7EB' font-size='28' font-family='ui-sans-serif,system-ui'>Thumb 2</text></svg>`
          ),
        "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='560'><rect width='100%' height='100%' fill='#111827'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#E5E7EB' font-size='28' font-family='ui-sans-serif,system-ui'>Thumb 3</text></svg>`
          ),
        "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='560'><rect width='100%' height='100%' fill='#111827'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#E5E7EB' font-size='28' font-family='ui-sans-serif,system-ui'>Thumb 4</text></svg>`
          ),
      ];

  const mainImage = images[0];
  const thumbs = images.slice(1, 5);

  const [selectedMain, setSelectedMain] = React.useState(mainImage);
  React.useEffect(() => {
    setSelectedMain(mainImage);
  }, [mainImage]);

  const [sizeOpt, setSizeOpt] = React.useState<string>("60 x 80 cm");
  const [frameOpt, setFrameOpt] = React.useState<string>("프레임 포함");

  const related: RelatedItem[] = artwork.related_items?.length
    ? artwork.related_items
    : [
        {
          artwork_id: "rel_1",
          title: "여름의 창가",
          artist_name: "이민호",
          price: 95000,
          thumbnail_url:
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#F97316'/><stop offset='1' stop-color='#EF4444'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/></svg>`
            ),
        },
        {
          artwork_id: "rel_2",
          title: "해변의 오후",
          artist_name: "박지우",
          price: 155000,
          thumbnail_url:
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#60A5FA'/><stop offset='1' stop-color='#A78BFA'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/></svg>`
            ),
        },
        {
          artwork_id: "rel_3",
          title: "가을의 길",
          artist_name: "윤하늘",
          price: 110000,
          thumbnail_url:
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#F97316'/><stop offset='1' stop-color='#EF4444'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/></svg>`
            ),
        },
      ];

  const optionButtonBase =
    "bg-white text-[--deep] rounded-lg px-3 py-2 h-auto font-normal shadow-none";
  const optionButtonActive =
    "bg-[--lavender] text-[--deep] border border-[--border]";

  return (
    <div
      className="w-[1440px] mx-auto flex flex-col"
      style={
        {
          // @ts-expect-error css vars
          "--deep": purple.deep,
          "--mid": purple.mid,
          "--border": purple.border,
          "--lavender": purple.lavender,
        } as React.CSSProperties
      }
    >
      <NavBar />

      <main className="flex flex-col gap-10">
        {/* Gallery */}
        <section className="flex bg-white px-8 py-12">
          <div className="flex gap-8 w-full">
            <div className="flex flex-col gap-4 w-2/3">
              <div
                className="bg-white shadow-lg border rounded-lg overflow-hidden h-[560px] flex items-center justify-center"
                style={{ borderColor: purple.border }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={selectedMain}
                    alt="작품 메인 이미지"
                    fill
                    priority
                    sizes="(min-width: 1440px) 900px, 66vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {thumbs.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={cn(
                      "relative w-40 h-28 rounded-lg overflow-hidden",
                      selectedMain === src
                        ? "ring-2 ring-offset-2"
                        : "ring-0"
                    )}
                    style={{
                      // a subtle selection ring in theme
                      // @ts-expect-error
                      ringColor: purple.border,
                    }}
                    onClick={() => setSelectedMain(src)}
                    aria-label={`썸네일 ${idx + 1} 선택`}
                  >
                    <Image
                      src={src}
                      alt={`썸네일 ${idx + 1}`}
                      fill
                      sizes="160px"
                      className="object-cover bg-gray-200"
                    />
                  </button>
                ))}
              </div>
            </div>

            <aside className="w-1/3 flex flex-col gap-6">
              <Card
                className="flex flex-col bg-white shadow-lg border p-6 rounded-lg"
                style={{ borderColor: purple.border }}
              >
                <h1 className="text-2xl font-bold" style={{ color: purple.deep }}>
                  {artwork.title}
                </h1>
                <p className="text-sm" style={{ color: purple.mid }}>
                  작가: {artwork.artist_info?.name ?? "-"} · 등록일: {artwork.created_at}
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <span
                    className="text-xl font-semibold"
                    style={{ color: purple.deep }}
                  >
                    ₩{formatKRW(artwork.price)}
                  </span>
                  <span className="text-sm" style={{ color: purple.mid }}>
                    재고: {artwork.stock}개
                  </span>
                </div>

                <p className="text-sm mt-3" style={{ color: purple.mid }}>
                  {artwork.description_short}
                </p>

                {loading ? (
                  <p className="text-xs mt-4" style={{ color: purple.mid }}>
                    불러오는 중...
                  </p>
                ) : null}
                {error ? (
                  <p className="text-xs mt-4 text-red-600">{error}</p>
                ) : null}
              </Card>

              <ShadowCard title="사이즈 / 옵션">
                <div className="flex flex-col gap-3 mt-1">
                  <label className="text-sm" style={{ color: purple.deep }}>
                    사이즈
                  </label>
                  <div className="flex gap-2">
                    {[
                      "60 x 80 cm",
                      "40 x 53 cm",
                      "커스텀 문의",
                    ].map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        variant="ghost"
                        className={cn(
                          optionButtonBase,
                          sizeOpt === opt && optionButtonActive
                        )}
                        onClick={() => setSizeOpt(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>

                  <label
                    className="text-sm mt-2"
                    style={{ color: purple.deep }}
                  >
                    프레임
                  </label>
                  <div className="flex gap-2">
                    {["프레임 포함", "프레임 없음"].map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        variant="ghost"
                        className={cn(
                          optionButtonBase,
                          frameOpt === opt && optionButtonActive
                        )}
                        onClick={() => setFrameOpt(opt)}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </div>
              </ShadowCard>

              <ShadowCard title="구매 정보">
                <div className="flex justify-between mt-1">
                  <p className="text-sm" style={{ color: purple.mid }}>
                    배송비
                  </p>
                  <p className="text-sm" style={{ color: purple.deep }}>
                    ₩3,500 (기본)
                  </p>
                </div>

                <div className="flex justify-between mt-2">
                  <p className="text-sm" style={{ color: purple.mid }}>
                    결제 수단
                  </p>
                  <p className="text-sm" style={{ color: purple.deep }}>
                    신용카드, 계좌이체, 간편결제
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-lg px-4 py-3"
                    style={{ borderColor: purple.border, color: purple.deep }}
                    onClick={() => {
                      // MVP placeholder action
                      window.alert(
                        `장바구니에 담았습니다.\n- 옵션: ${sizeOpt} / ${frameOpt}`
                      );
                    }}
                  >
                    장바구니에 담기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-lg px-4 py-3"
                    style={{ borderColor: purple.border, color: purple.deep }}
                    onClick={() => {
                      window.alert(
                        `바로 구매(데모)\n- 옵션: ${sizeOpt} / ${frameOpt}`
                      );
                    }}
                  >
                    바로 구매
                  </Button>
                </div>

                <p className="text-xs mt-3" style={{ color: purple.mid }}>
                  결제는 안전한 결제 게이트웨이를 통해 처리됩니다. 결제 실패 시 CS로
                  문의해 주세요.
                </p>
              </ShadowCard>
            </aside>
          </div>
        </section>

        {/* Features / Info */}
        <section className="flex flex-col items-center bg-white shadow-lg px-8 py-12">
          <div className="w-full max-w-[1200px] flex flex-col gap-4">
            <h2 className="text-3xl font-bold" style={{ color: purple.deep }}>
              작품 정보
            </h2>
            <p style={{ color: purple.mid }}>
              상세 설명과 태그, 작가 소개를 확인하세요. 구매 전 사이즈, 배송,
              반품 정책을 반드시 확인해 주세요.
            </p>

            <div className="flex gap-6 mt-6">
              <div
                className="flex-1 bg-[--lavender] border p-6 rounded-lg"
                style={{ borderColor: purple.border }}
              >
                <h3 className="text-lg font-semibold" style={{ color: purple.deep }}>
                  상세 설명
                </h3>
                <p className="mt-3" style={{ color: purple.deep }}>
                  {artwork.description_long}
                </p>
              </div>

              <div
                className="w-80 bg-[--lavender] border p-6 rounded-lg"
                style={{ borderColor: purple.border }}
              >
                <h3 className="text-lg font-semibold" style={{ color: purple.deep }}>
                  태그
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {artwork.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="bg-white shadow-lg border px-3 py-1 rounded-full text-sm font-normal"
                      style={{ borderColor: purple.border, color: purple.deep }}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>

                <h3
                  className="text-lg font-semibold mt-6"
                  style={{ color: purple.deep }}
                >
                  작가 소개
                </h3>
                <p className="text-sm mt-2" style={{ color: purple.mid }}>
                  {artwork.artist_info?.bio}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="flex flex-col items-center bg-white px-8 py-12">
          <div className="w-full max-w-[1200px] flex flex-col gap-6">
            <h2 className="text-3xl font-bold" style={{ color: purple.deep }}>
              이 작품을 본 사람들이 함께 본 작품
            </h2>
            <div className="flex gap-6 mt-4">
              {related.slice(0, 3).map((item) => (
                <RelatedArtworkCard key={item.artwork_id} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center justify-center py-12 px-8 bg-[--lavender]">
          <div
            className="w-full max-w-[1000px] flex items-center justify-between bg-white shadow-lg border p-8 rounded-lg"
            style={{ borderColor: purple.border }}
          >
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold" style={{ color: purple.deep }}>
                지금 바로 주문하세요
              </h2>
              <p className="mt-2" style={{ color: purple.mid }}>
                원하시는 사이즈를 선택한 후 '바로 구매'를 눌러 주문생성 페이지로
                이동합니다. 아티스트 지원을 위한 등록/노출/결제 프로세스를 간단히
                제공하고 있습니다.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                className="bg-[--lavender] rounded-lg px-6 py-3"
                style={{ color: purple.deep }}
                onClick={() => window.alert("장바구니(데모)")}
              >
                장바구니
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="bg-[--lavender] rounded-lg px-6 py-3"
                style={{ color: purple.deep }}
                onClick={() => window.alert("주문 생성(데모)")}
              >
                주문 생성
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* bottom spacing to match screenshot whitespace */}
      <Separator className="opacity-0" />
    </div>
  );
}
