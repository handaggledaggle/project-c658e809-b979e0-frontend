import CheckoutClient from "./_components/CheckoutClient";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const getStr = (key: string) => {
    const v = sp[key];
    return typeof v === "string" ? v : undefined;
  };

  const paymentStatus = getStr("paymentStatus");
  const orderId = getStr("orderId");
  const reason = getStr("reason");

  // NOTE: MVP 데모를 위한 기본값. 실제 구현에서는 artworkId로 서버에서 작품 정보를 조회해 렌더링합니다.
  const artworkId = getStr("artworkId") ?? "demo_artwork_001";

  return (
    <CheckoutClient
      initialArtwork={{
        artworkId,
        title: getStr("title") ?? "작품 제목 예시",
        artistName: getStr("artist") ?? "아티스트",
        year: getStr("year") ?? "2026",
      }}
      paymentResult={{
        status: paymentStatus,
        orderId,
        reason,
      }}
    />
  );
}
