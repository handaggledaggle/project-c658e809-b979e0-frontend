import { NextResponse } from "next/server";

type SizeOption = "Small" | "Medium" | "Large";

const PRICE_BY_SIZE: Record<SizeOption, number> = {
  Small: 120_000,
  Medium: 150_000,
  Large: 180_000,
};

const FRAME_OPTION_PRICE = 15_000;
const SHIPPING_FEE = 3_500;

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const items = body.items as unknown;
    const shipping = body.shipping_address as unknown;

    if (!Array.isArray(items) || items.length < 1) {
      return NextResponse.json({ error: "items is required" }, { status: 400 });
    }

    const first = items[0] as any;
    const artworkId = typeof first?.artwork_id === "string" ? first.artwork_id : null;
    const option = typeof first?.option === "string" ? first.option : "Small";
    const quantity = Number(first?.quantity ?? 1);

    if (!artworkId) {
      return NextResponse.json({ error: "artwork_id is required" }, { status: 400 });
    }
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json({ error: "quantity must be between 1 and 99" }, { status: 400 });
    }

    const address = (shipping as any)?.address;
    const phone = (shipping as any)?.phone;

    if (typeof address !== "string" || !address.trim()) {
      return NextResponse.json({ error: "shipping_address.address is required" }, { status: 400 });
    }
    if (typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ error: "shipping_address.phone is required" }, { status: 400 });
    }

    const normalizedOption: SizeOption =
      option === "Small" || option === "Medium" || option === "Large" ? option : "Small";

    // IMPORTANT: 서버에서 금액을 재계산(클라이언트 금액 신뢰 금지)
    const unitPrice = PRICE_BY_SIZE[normalizedOption];
    const artworkAmount = unitPrice * quantity;
    const optionAmount = FRAME_OPTION_PRICE * quantity;
    const totalAmount = artworkAmount + optionAmount + SHIPPING_FEE;

    const orderId = randomId("order");

    return NextResponse.json(
      {
        order_id: orderId,
        status: "PENDING",
        total_amount: totalAmount,
        created_at: new Date().toISOString(),
        payment_payload: {
          orderId,
          amount: totalAmount,
          orderName: `printtie - ${artworkId} (${normalizedOption}) x${quantity}`,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
