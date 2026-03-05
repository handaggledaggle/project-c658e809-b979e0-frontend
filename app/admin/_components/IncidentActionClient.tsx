"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type IncidentAction = "TEMP_HIDE" | "PERMA_HIDE" | "REQUEST_REVIEW";

export default function IncidentActionClient() {
  const [submitting, setSubmitting] = React.useState(false);
  const [lastResult, setLastResult] = React.useState<string | null>(null);

  const incidentId = "INC-20260305-0098";

  const submit = async (action: IncidentAction) => {
    setSubmitting(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, incidentId }),
      });
      if (!res.ok) throw new Error("action_failed");
      const data = (await res.json()) as { ok: boolean; message?: string };
      setLastResult(data.message ?? "처리 완료");
    } catch {
      setLastResult("처리 중 오류가 발생했습니다. 다시 시도하세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label className="text-sm text-[#4C1D95]">사건 ID</Label>
        <div className="flex h-10 items-center rounded-lg border border-[#DDD6FE] bg-white px-3 text-[#4C1D95] shadow-lg">
          {incidentId}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm text-[#4C1D95]">관련 작품</Label>
        <div className="flex h-10 items-center rounded-lg border border-[#DDD6FE] bg-white px-3 text-[#4C1D95] shadow-lg">
          작품ID: art_4521 — "해변의 오후" / 작가: 정현
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <Label className="text-sm text-[#4C1D95]">조치 유형</Label>
          <div className="flex h-10 items-center rounded-lg border border-[#DDD6FE] bg-white px-3 text-[#4C1D95] shadow-lg">
            임시 비공개
          </div>
        </div>
        <div className="flex w-48 flex-col gap-1">
          <Label className="text-sm text-[#4C1D95]">우선도</Label>
          <div className="flex h-10 items-center rounded-lg border border-[#DDD6FE] bg-white px-3 text-[#4C1D95] shadow-lg">
            높음
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-sm text-[#4C1D95]">조치 사유(운영 메모)</Label>
        <div className="h-24 rounded-lg border border-[#DDD6FE] bg-white p-3 text-[#4C1D95] shadow-lg">
          저작권 침해 신고 접수. 신고자가 제공한 증빙 이미지와 비교 필요. 아티스트에 증빙 제출 요청 예정.
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          className="bg-white text-[#4C1D95] hover:bg-gray-50"
          disabled={submitting}
          variant="ghost"
          onClick={() => void submit("TEMP_HIDE")}
        >
          임시 비공개 적용
        </Button>
        <Button
          className="border border-[#DDD6FE] bg-white text-[#4C1D95] shadow-lg hover:bg-white"
          disabled={submitting}
          variant="outline"
          onClick={() => void submit("PERMA_HIDE")}
        >
          영구 비공개 처리
        </Button>
        <Button
          className="border border-[#DDD6FE] bg-white text-[#4C1D95] shadow-lg hover:bg-white"
          disabled={submitting}
          variant="outline"
          onClick={() => void submit("REQUEST_REVIEW")}
        >
          재심사 요청
        </Button>
      </div>

      {lastResult ? <div className="text-sm text-[#6D28D9]">{lastResult}</div> : null}
    </div>
  );
}
