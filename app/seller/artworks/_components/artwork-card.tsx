"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MoreVertical, Pencil, Eye, EyeOff, PackageX } from "lucide-react";
import EditArtworkDialog from "./edit-artwork-dialog";

export type Artwork = {
  artworkId: string;
  title: string;
  internalIdLabel: string; // e.g. PT-1023
  medium: string;
  size: string;
  priceKrw: number;
  tags: string[];
  isPublic: boolean;
  salesCount: number;
  sellStatus: "SELLING" | "SOLD_OUT";
  thumbnailUrl?: string | null;
};

function formatKrw(amount: number) {
  try {
    return new Intl.NumberFormat("ko-KR").format(amount);
  } catch {
    return String(amount);
  }
}

async function patchArtwork(artworkId: string, body: Partial<Artwork>) {
  const res = await fetch(`/api/v1/artist/artworks/${encodeURIComponent(artworkId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Failed: ${res.status}`);
  }
  return (await res.json()) as { updated: Artwork };
}

export default function ArtworkCard({
  artwork,
  onUpdated,
}: {
  artwork: Artwork;
  onUpdated: (updated: Artwork) => void | Promise<void>;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const visibilityBadge = artwork.isPublic
    ? { label: "공개", className: "bg-[#DDD6FE] text-[#4C1D95]" }
    : { label: "비공개", className: "bg-white border border-[#DDD6FE] text-[#6D28D9]" };

  const sellBadge =
    artwork.sellStatus === "SOLD_OUT"
      ? { label: "품절", className: "bg-white border border-[#DDD6FE] text-[#6D28D9]" }
      : { label: "판매중", className: "bg-[#6D28D9] text-white" };

  async function togglePublic(next: boolean) {
    setBusy(true);
    try {
      const { updated } = await patchArtwork(artwork.artworkId, { isPublic: next });
      await onUpdated(updated);
    } finally {
      setBusy(false);
    }
  }

  async function markSoldOut() {
    setBusy(true);
    try {
      const { updated } = await patchArtwork(artwork.artworkId, { sellStatus: "SOLD_OUT" });
      await onUpdated(updated);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="overflow-hidden border border-[#DDD6FE] shadow-lg rounded-xl">
      <div className="w-full h-48 bg-white flex items-center justify-center text-[#6D28D9] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF5FF] to-white" />
        <div className="relative z-10 text-sm">작품 썸네일</div>
      </div>

      <CardContent className="p-6 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-lg font-semibold text-[#4C1D95] leading-snug">{artwork.title}</h3>
          <span className="text-sm text-[#6D28D9] whitespace-nowrap">작품ID: {artwork.internalIdLabel}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={cn("rounded-md", visibilityBadge.className)}>{visibilityBadge.label}</Badge>
          <Badge className={cn("rounded-md", sellBadge.className)}>{sellBadge.label}</Badge>
        </div>

        <p className="text-[#6D28D9] text-sm">
          {artwork.medium} / {artwork.size}
        </p>

        <p className="text-[#4C1D95] font-semibold">₩{formatKrw(artwork.priceKrw)}</p>

        <div className="flex justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2 text-sm text-[#6D28D9]">
            {artwork.tags.slice(0, 3).map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#DDD6FE] text-[#4C1D95] shadow-sm"
              onClick={() => setEditOpen(true)}
              disabled={busy}
            >
              <Pencil className="size-4" />
              수정
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#DDD6FE] text-[#4C1D95] shadow-sm"
                  disabled={busy}
                >
                  <MoreVertical className="size-4" />
                  상태
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>작품 상태</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void togglePublic(true)} disabled={artwork.isPublic || busy}>
                  <Eye className="size-4" />
                  공개로 전환
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void togglePublic(false)} disabled={!artwork.isPublic || busy}>
                  <EyeOff className="size-4" />
                  비공개로 전환
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void markSoldOut()}
                  disabled={artwork.sellStatus === "SOLD_OUT" || busy}
                >
                  <PackageX className="size-4" />
                  품절 처리
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[#DDD6FE]">
          <div className="text-sm text-[#6D28D9]">
            공개: <span className="text-[#4C1D95]">{artwork.isPublic ? "예" : "아니오"}</span>
          </div>
          <div className="text-sm text-[#6D28D9]">
            판매수: <span className="text-[#4C1D95]">{artwork.salesCount}</span>
          </div>
        </div>
      </CardContent>

      <EditArtworkDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        artwork={artwork}
        onSaved={async (updated) => {
          setEditOpen(false);
          await onUpdated(updated);
        }}
      />
    </Card>
  );
}
