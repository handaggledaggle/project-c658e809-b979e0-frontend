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

function getStore(): Artwork[] {
  if (!globalThis.__printtie_artworks__) {
    // If list route hasn't been hit yet, initialize minimal store.
    globalThis.__printtie_artworks__ = [];
  }
  return globalThis.__printtie_artworks__;
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ artworkId: string }> }
) {
  const { artworkId } = await ctx.params;

  let body: Partial<Artwork>;
  try {
    body = (await req.json()) as Partial<Artwork>;
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const store = getStore();
  const idx = store.findIndex((a) => a.artworkId === artworkId);
  if (idx < 0) return new NextResponse("Not found", { status: 404 });

  if (typeof body.priceKrw === "number" && (Number.isNaN(body.priceKrw) || body.priceKrw < 0)) {
    return new NextResponse("Invalid priceKrw", { status: 400 });
  }

  if (body.tags && !Array.isArray(body.tags)) {
    return new NextResponse("Invalid tags", { status: 400 });
  }

  if (body.sellStatus && body.sellStatus !== "SELLING" && body.sellStatus !== "SOLD_OUT") {
    return new NextResponse("Invalid sellStatus", { status: 400 });
  }

  const current = store[idx];
  const updated: Artwork = {
    ...current,
    ...body,
    tags: body.tags ? body.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 10) : current.tags,
  };

  store[idx] = updated;

  return NextResponse.json({ updated });
}
