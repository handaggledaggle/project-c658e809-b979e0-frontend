import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

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
  visibility: "PUBLIC" | "PRIVATE";
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

function toDataUrl(file: File) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const ab = await file.arrayBuffer();
      const b64 = Buffer.from(ab).toString("base64");
      resolve(`data:${file.type};base64,${b64}`);
    } catch (e) {
      reject(e);
    }
  });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ artworkId: string }> }
) {
  if (!requireAuth(req)) {
    return NextResponse.json(
      { error: { message: "Unauthorized", details: { reason: "Missing Bearer token" } } },
      { status: 401 }
    );
  }

  const { artworkId } = await ctx.params;
  if (!artworkId) {
    return NextResponse.json({ error: { message: "Invalid artworkId" } }, { status: 400 });
  }

  const store = artworksStore();
  const record = store.get(artworkId);
  if (!record) {
    return NextResponse.json({ error: { message: "Artwork not found" } }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: { message: "Invalid multipart/form-data" } }, { status: 400 });
  }

  const files = form.getAll("files").filter((v): v is File => v instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: { message: "No files uploaded" } }, { status: 400 });
  }

  const maxBytes = 10 * 1024 * 1024;
  for (const f of files) {
    if (!(f.type === "image/jpeg" || f.type === "image/png")) {
      return NextResponse.json(
        { error: { message: "Unsupported Media Type", details: { allowed: ["image/jpeg", "image/png"], got: f.type } } },
        { status: 415 }
      );
    }
    if (f.size > maxBytes) {
      return NextResponse.json(
        { error: { message: "Payload Too Large", details: { max_bytes: maxBytes, got_bytes: f.size } } },
        { status: 413 }
      );
    }
  }

  const urls: string[] = [];
  for (const f of files) {
    urls.push(await toDataUrl(f));
  }

  record.images = [...record.images, ...urls];
  store.set(artworkId, record);

  return NextResponse.json(
    {
      urls,
      artwork_id: artworkId,
      uploaded_at: new Date().toISOString(),
    },
    { status: 200 }
  );
}
