"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Eye, ImageUp, Loader2, Lock, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImageUploadBox } from "./image-upload-box";

type Visibility = "PUBLIC" | "PRIVATE";

type CreateArtworkPayload = {
  title: string;
  category: string;
  price: number;
  stock?: number | null;
  description?: string | null;
  size_cm?: string | null;
  shipping_fee_type?: "COLLECT" | "PREPAID";
  visibility: Visibility;
  tags?: string[];
};

type CreateArtworkResponse = {
  artwork_id: string;
  created_at: string;
  status: string;
};

function numberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function ArtworkCreateForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("illustration");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [sizeCm, setSizeCm] = useState("");
  const [shippingFeeType, setShippingFeeType] = useState<"COLLECT" | "PREPAID">("COLLECT");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");

  const [agree, setAgree] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ artworkId: string } | null>(null);

  const previewTitle = title.trim() || "(제목 없음)";
  const previewPrice = useMemo(() => {
    const n = numberOrNull(price);
    return typeof n === "number" ? n : null;
  }, [price]);

  const authToken = useMemo(() => {
    // MVP: 로그인 구현이 페이지 범위 밖일 수 있어 localStorage 토큰을 가정합니다.
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("access_token");
  }, []);

  const canSubmit = useMemo(() => {
    const priceN = numberOrNull(price);
    return (
      title.trim().length > 0 &&
      category.trim().length > 0 &&
      typeof priceN === "number" &&
      priceN >= 0 &&
      !!imageFile &&
      agree
    );
  }, [title, category, price, imageFile, agree]);

  const missingAuth = useMemo(() => !authToken, [authToken]);

  const previewRef = useRef<HTMLButtonElement | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    setCreated(null);

    if (missingAuth) {
      setApiError("작품 등록은 로그인 후 가능합니다. (로컬스토리지 access_token 필요)");
      return;
    }

    if (!canSubmit) {
      setApiError("필수 항목(제목/카테고리/가격/대표 이미지/약관 동의)을 확인해주세요.");
      return;
    }

    if (!imageFile) {
      setApiError("대표 이미지를 선택해주세요.");
      return;
    }

    const priceN = numberOrNull(price);
    if (typeof priceN !== "number" || priceN < 0) {
      setApiError("가격을 올바르게 입력해주세요.");
      return;
    }

    const stockN = numberOrNull(stock);
    if (stockN !== null && stockN < 0) {
      setApiError("재고/수량은 0 이상이어야 합니다.");
      return;
    }

    const payload: CreateArtworkPayload = {
      title: title.trim(),
      category,
      price: priceN,
      stock: stockN,
      description: description.trim() ? description.trim() : null,
      size_cm: sizeCm.trim() ? sizeCm.trim() : null,
      shipping_fee_type: shippingFeeType,
      visibility,
      tags: [],
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `작품 생성 실패 (${res.status})`);
      }

      const data = (await res.json()) as CreateArtworkResponse;

      const form = new FormData();
      form.append("files", imageFile);

      const uploadRes = await fetch(`/api/v1/artworks/${encodeURIComponent(data.artwork_id)}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: form,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(text || `이미지 업로드 실패 (${uploadRes.status})`);
      }

      setCreated({ artworkId: data.artwork_id });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="flex flex-col p-8 bg-white rounded-xl border border-[#DDD6FE]">
      <h2 className="text-2xl font-bold text-[#4C1D95] mb-4">새 작품 등록 폼</h2>

      {missingAuth ? (
        <div className="mb-6 rounded-lg border border-[#DDD6FE] bg-[#FAF5FF] p-4 text-sm text-[#4C1D95]">
          <div className="font-semibold">로그인이 필요합니다</div>
          <div className="mt-1 text-[#6D28D9]">
            작품 등록은 로그인 필수입니다. 아직 로그인 플로우가 없다면 개발 중에는 브라우저 콘솔에서
            <Badge variant="secondary" className="ml-1">localStorage.setItem('access_token','dev-token')</Badge>
            처럼 토큰을 설정한 뒤 진행하세요.
          </div>
          <div className="mt-3">
            <Link href="/login" className="text-[#6D28D9] underline">
              로그인 페이지로 이동
            </Link>
          </div>
        </div>
      ) : null}

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#4C1D95]" htmlFor="title">
              작품 제목 (필수)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 text-[#4C1D95]"
              placeholder="작품 제목을 입력하세요"
            />
            <p className="text-sm text-[#6D28D9]">검색과 노출에 사용되는 주요 제목입니다.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#4C1D95]" htmlFor="category">
              카테고리 (필수)
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 text-[#4C1D95]"
            >
              <option value="illustration">일러스트레이션</option>
              <option value="painting">회화</option>
              <option value="photo">사진</option>
              <option value="graphic">그래픽</option>
            </select>
            <p className="text-sm text-[#6D28D9]">회화 / 사진 / 일러스트 등 카테고리를 선택하세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#4C1D95]" htmlFor="price">
              가격 (원, 필수)
            </Label>
            <Input
              id="price"
              inputMode="numeric"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 text-[#4C1D95]"
              placeholder="예: 150000"
              min={0}
            />
            <p className="text-sm text-[#6D28D9]">판매가로 노출됩니다. 세금/수수료는 정산 기준에 따릅니다.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#4C1D95]" htmlFor="stock">
              재고 / 수량
            </Label>
            <Input
              id="stock"
              inputMode="numeric"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 text-[#4C1D95]"
              placeholder="예: 1"
              min={0}
            />
            <p className="text-sm text-[#6D28D9]">원본일 경우 1로 설정하세요. 판화 등은 수량 입력이 가능합니다.</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm text-[#4C1D95]">대표 이미지 (필수)</Label>
          <ImageUploadBox
            file={imageFile}
            previewUrl={imagePreviewUrl}
            onChange={(file, previewUrl) => {
              setImageFile(file);
              setImagePreviewUrl(previewUrl);
            }}
          />
          <p className="text-sm text-[#6D28D9]">권장 해상도 1200px 이상, JPG/PNG. 미리보기에 따라 노출 이미지가 결정됩니다.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm text-[#4C1D95]" htmlFor="desc">
            상세 설명
          </Label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-36 bg-white shadow-lg border border-[#DDD6FE] rounded-lg p-3 text-[#4C1D95]"
            placeholder="재료, 제작 연도, 사이즈, 작품 설명 및 보증 정보 등을 입력하세요."
          />
          <p className="text-sm text-[#6D28D9]">구매자의 신뢰를 높이는 상세 정보를 입력하면 전환율이 증가합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#4C1D95]" htmlFor="sizeCm">
              작품 규격 (가로 x 세로 cm)
            </Label>
            <Input
              id="sizeCm"
              value={sizeCm}
              onChange={(e) => setSizeCm(e.target.value)}
              className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 text-[#4C1D95]"
              placeholder="예: 60 x 80"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#4C1D95]" htmlFor="shipping">
              배송비 설정
            </Label>
            <select
              id="shipping"
              value={shippingFeeType}
              onChange={(e) => setShippingFeeType(e.target.value as "COLLECT" | "PREPAID")}
              className="h-10 bg-white shadow-lg border border-[#DDD6FE] rounded-lg px-3 text-[#4C1D95]"
            >
              <option value="COLLECT">착불</option>
              <option value="PREPAID">선불</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#4C1D95]">판매 상태</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={visibility === "PUBLIC" ? "default" : "outline"}
                className={cn(
                  "h-10 shadow-lg rounded-lg px-4",
                  visibility === "PUBLIC"
                    ? "bg-[#6D28D9] text-white hover:bg-[#5B21B6]"
                    : "border-[#DDD6FE] text-[#4C1D95]"
                )}
                onClick={() => setVisibility("PUBLIC")}
              >
                <Eye className="mr-2 h-4 w-4" />
                즉시 공개
              </Button>
              <Button
                type="button"
                variant={visibility === "PRIVATE" ? "default" : "outline"}
                className={cn(
                  "h-10 shadow-lg rounded-lg px-4",
                  visibility === "PRIVATE"
                    ? "bg-[#4C1D95] text-white hover:bg-[#3B1673]"
                    : "border-[#DDD6FE] text-[#4C1D95]"
                )}
                onClick={() => setVisibility("PRIVATE")}
              >
                <Lock className="mr-2 h-4 w-4" />
                비공개 저장
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-[#DDD6FE]" />

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4 border border-[#DDD6FE] rounded"
            />
            <span className="text-sm text-[#4C1D95]">작품 등록 약관 및 결제/정산 정책에 동의합니다 (필수)</span>
          </label>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-sm text-[#6D28D9]">
              입력 검증: 필수 항목이 비어 있거나 이미지가 없으면 저장/공개가 불가합니다. 결제/정산 정보는
              프로필 &gt; 정산 정보에서 별도 설정하세요.
            </div>

            <div className="flex gap-3 justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    ref={previewRef}
                    type="button"
                    variant="outline"
                    className="h-10 bg-white shadow-lg border border-[#DDD6FE] text-[#4C1D95] rounded-lg px-4"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    미리보기
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>작품 미리보기</DialogTitle>
                    <DialogDescription>실제 노출에 가까운 형태로 내용을 확인하세요.</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-[#DDD6FE] bg-white overflow-hidden">
                      <div className="relative aspect-[4/3] w-full bg-[#FAF5FF]">
                        {imagePreviewUrl ? (
                          <Image src={imagePreviewUrl} alt="미리보기" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[#6D28D9] text-sm">
                            <ImageUp className="mr-2 h-4 w-4" />
                            대표 이미지가 없습니다
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-lg font-semibold text-[#4C1D95]">{previewTitle}</div>
                        <div className="mt-1 text-sm text-[#6D28D9]">
                          {previewPrice !== null ? `${previewPrice.toLocaleString()}원` : "가격 미입력"}
                        </div>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <Badge variant="secondary">{category}</Badge>
                          <Badge variant="secondary">{visibility}</Badge>
                          <Badge variant="secondary">{shippingFeeType === "COLLECT" ? "착불" : "선불"}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#DDD6FE] bg-white p-4">
                      <div className="text-sm font-semibold text-[#4C1D95]">설명</div>
                      <div className="mt-2 text-sm text-[#6D28D9] whitespace-pre-wrap">
                        {description.trim() ? description.trim() : "(설명 없음)"}
                      </div>
                      <Separator className="my-4 bg-[#DDD6FE]" />
                      <div className="text-sm font-semibold text-[#4C1D95]">규격</div>
                      <div className="mt-2 text-sm text-[#6D28D9]">{sizeCm.trim() ? sizeCm.trim() : "(미입력)"}</div>
                      <Separator className="my-4 bg-[#DDD6FE]" />
                      <div className="text-sm font-semibold text-[#4C1D95]">재고</div>
                      <div className="mt-2 text-sm text-[#6D28D9]">{stock.trim() ? stock.trim() : "(미입력)"}</div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                type="submit"
                disabled={submitting || missingAuth}
                className={cn(
                  "h-10 rounded-lg px-4",
                  "bg-[#FFFFFF] text-[#4C1D95] border border-[#DDD6FE] shadow-lg hover:bg-[#FAF5FF]",
                  (!canSubmit || missingAuth) && "opacity-60"
                )}
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                등록 완료
              </Button>
            </div>
          </div>
        </div>

        {apiError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{apiError}</div>
        ) : null}

        {created ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-2 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4" />
              <div>
                <div className="font-semibold">등록이 완료되었습니다</div>
                <div className="mt-1">작품 ID: {created.artworkId}</div>
                <div className="mt-2 flex gap-3">
                  <Link href="/me/artworks" className="text-green-800 underline">
                    내 작품으로 이동
                  </Link>
                  <Link href="/artworks" className="text-green-800 underline">
                    작품 둘러보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="text-sm text-[#6D28D9]">
          <p>
            참고: 이 페이지의 API는 서버리스 데모를 위해 간단 구현되어 있으며, 실제 운영에서는 스토리지(S3
            등)와 DB 연동, JWT 검증/권한(ARTIST) 검증, 업로드 URL 서명(프리사인드) 등을 적용해야 합니다.
          </p>
        </div>
      </form>
    </Card>
  );
}
