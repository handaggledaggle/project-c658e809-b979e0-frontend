import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Visibility = "PUBLIC" | "PRIVATE";

type CreateArtworkPayload = {
  title?: unknown;
  category?: unknown;
  price?: unknown;
  stock?: unknown;
  description?: unknown;
  size_cm?: unknown;
  shipping_fee_type?: unknown;
  visibility?: unknown;
  tags?: unknown;
};

type ArtworkRecord = {
  artwork_id: string;
  created_at: string;
  status: "CREATED";
  title: string;
  category: string;
  price: number;
  stock: number | null;
  description: string | null;
  size_cm: string | null;
  shipping_fee_type: "COLLECT" | "PREPAID";
  visibility: Visibility;
  tags: string[];
  images: string[];
};

declare global {
  // eslint-disable-next-line no-var
  var __printtie_artworks: Map<string, ArtworkRecord> | undefined;
}

function artworksStore() {
  if (!globalThis.__printtie_artworks) globalThis.__printtie_artworks = new Map();
  return globalThis.__printtie_artworks;
}

function requireAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.toLowerCase().startsWith("bearer ")) return false;
  const token = auth.slice("bearer ".length).trim();
  return token.length > 0;
}

function badRequest(message: string, details?: Record<string, unknown>) {
  return NextResponse.json(
    {
      error: {
        message,
        details: details ?? null,
      },
    },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json(
      { error: { message: "Unauthorized", details: { reason: "Missing Bearer token" } } },
      { status: 401 }
    );
  }

  let body: CreateArtworkPayload;
  try {
    body = (await req.json()) as CreateArtworkPayload;
  } catch {
    return badRequest("Invalid JSON");
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const price = typeof body.price === "number" ? body.price : Number.NaN;
  const stock =
    typeof body.stock === "number" ? body.stock : body.stock === null || typeof body.stock === "undefined" ? null : Number.NaN;
  const description = typeof body.description === "string" ? body.description : body.description === null ? null : null;
  const size_cm = typeof body.size_cm === "string" ? body.size_cm : body.size_cm === null ? null : null;
  const shipping_fee_type = body.shipping_fee_type === "PREPAID" ? "PREPAID" : "COLLECT";
  const visibility: Visibility = body.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC";
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string") : [];

  if (!title) return badRequest("Missing required field", { field: "title" });
  if (!category) return badRequest("Missing required field", { field: "category" });
  if (!Number.isFinite(price) || price < 0) return badRequest("Invalid price", { field: "price" });
  if (stock !== null && (!Number.isFinite(stock) || stock < 0)) return badRequest("Invalid stock", { field: "stock" });

  const artwork_id = crypto.randomUUID();
  const created_at = new Date().toISOString();

  const record: ArtworkRecord = {
    artwork_id,
    created_at,
    status: "CREATED",
    title,
    category,
    price,
    stock,
    description,
    size_cm,
    shipping_fee_type,
    visibility,
    tags,
    images: [],
  };

  artworksStore().set(artwork_id, record);

  return NextResponse.json(
    {
      artwork_id,
      created_at,
      status: record.status,
    },
    { status: 201 }
  );
}
