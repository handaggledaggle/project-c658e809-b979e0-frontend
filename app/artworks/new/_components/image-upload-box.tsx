"use client";

import Image from "next/image";
import { useCallback, useId, useMemo, useState } from "react";
import { ImageUp, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  file: File | null;
  previewUrl: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
};

function isSupportedImage(file: File) {
  return file.type === "image/jpeg" || file.type === "image/png";
}

export function ImageUploadBox({ file, previewUrl, onChange }: Props) {
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hint = useMemo(() => {
    if (file) return `${file.name} (${Math.round(file.size / 1024)}KB)`;
    return "클릭 또는 드래그&드롭으로 업로드";
  }, [file]);

  const readAsDataUrl = useCallback(async (f: File) => {
    const maxBytes = 10 * 1024 * 1024;
    if (!isSupportedImage(f)) throw new Error("JPG/PNG만 업로드할 수 있습니다.");
    if (f.size > maxBytes) throw new Error("최대 10MB까지 업로드할 수 있습니다.");

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(f);
    });
  }, []);

  const handleFile = useCallback(
    async (f: File) => {
      setError(null);
      try {
        const url = await readAsDataUrl(f);
        onChange(f, url);
      } catch (e) {
        onChange(null, null);
        setError(e instanceof Error ? e.message : "업로드 중 오류가 발생했습니다.");
      }
    },
    [onChange, readAsDataUrl]
  );

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className={cn(
          "h-48 bg-white shadow-lg border border-[#DDD6FE] rounded-lg flex items-center justify-center text-[#6D28D9]",
          "cursor-pointer select-none overflow-hidden",
          dragOver && "ring-2 ring-[#A78BFA]"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
      >
        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />

        {previewUrl ? (
          <div className="relative h-full w-full">
            <Image src={previewUrl} alt="대표 이미지 미리보기" fill className="object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm">
            <div className="flex items-center">
              <ImageUp className="mr-2 h-4 w-4" />
              이미지 업로드 박스
            </div>
            <div className="text-xs text-[#6D28D9]/80">{hint}</div>
          </div>
        )}
      </label>

      {file ? (
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-[#6D28D9] truncate">{hint}</div>
          <Button
            type="button"
            variant="outline"
            className="border-[#DDD6FE] text-[#4C1D95]"
            onClick={() => onChange(null, null)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            제거
          </Button>
        </div>
      ) : null}

      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
