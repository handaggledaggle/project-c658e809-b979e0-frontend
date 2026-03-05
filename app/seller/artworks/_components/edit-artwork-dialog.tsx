"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Artwork } from "./artwork-card";
import { Loader2 } from "lucide-react";

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

export default function EditArtworkDialog({
  open,
  onOpenChange,
  artwork,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: Artwork;
  onSaved: (updated: Artwork) => void | Promise<void>;
}) {
  const [title, setTitle] = React.useState(artwork.title);
  const [medium, setMedium] = React.useState(artwork.medium);
  const [size, setSize] = React.useState(artwork.size);
  const [price, setPrice] = React.useState(String(artwork.priceKrw));
  const [tags, setTags] = React.useState(artwork.tags.join(","));
  const [isPublic, setIsPublic] = React.useState(artwork.isPublic);

  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setTitle(artwork.title);
    setMedium(artwork.medium);
    setSize(artwork.size);
    setPrice(String(artwork.priceKrw));
    setTags(artwork.tags.join(","));
    setIsPublic(artwork.isPublic);
    setError(null);
  }, [open, artwork]);

  async function save() {
    const priceNumber = Number(price);
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setError("가격은 0 이상 숫자여야 합니다.");
      return;
    }

    const nextTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);

    setBusy(true);
    setError(null);
    try {
      const { updated } = await patchArtwork(artwork.artworkId, {
        title,
        medium,
        size,
        priceKrw: priceNumber,
        tags: nextTags,
        isPublic,
      });
      await onSaved(updated);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "저장 중 오류";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-[#4C1D95]">작품 정보 수정</DialogTitle>
          <DialogDescription className="text-[#6D28D9]">
            제목/가격/태그/공개 여부 등 기본 정보를 수정할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-[#4C1D95]">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[#DDD6FE]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="medium" className="text-[#4C1D95]">재료/형태</Label>
              <Input
                id="medium"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="border-[#DDD6FE]"
                placeholder="예: 아크릴화"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="size" className="text-[#4C1D95]">크기</Label>
              <Input
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="border-[#DDD6FE]"
                placeholder="예: 50x70cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-[#4C1D95]">가격 (KRW)</Label>
              <Input
                id="price"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-[#DDD6FE]"
                placeholder="예: 120000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="public" className="text-[#4C1D95]">공개 여부</Label>
              <select
                id="public"
                value={isPublic ? "Y" : "N"}
                onChange={(e) => setIsPublic(e.target.value === "Y")}
                className={cn(
                  "h-9 rounded-md border border-[#DDD6FE] bg-white px-3 text-sm text-[#4C1D95]",
                  "focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30"
                )}
              >
                <option value="Y">공개</option>
                <option value="N">비공개</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-[#4C1D95]">태그 (쉼표로 구분, 최대 10개)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border-[#DDD6FE]"
              placeholder="예: 풍경,아크릴"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-[#DDD6FE] text-[#4C1D95]"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            취소
          </Button>
          <Button
            type="button"
            className="bg-[#6D28D9] hover:bg-[#5B21B6]"
            onClick={() => void save()}
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                저장 중…
              </n            ) : (
              "저장"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
