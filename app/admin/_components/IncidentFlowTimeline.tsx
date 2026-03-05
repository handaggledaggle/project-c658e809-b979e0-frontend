import { Card } from "@/components/ui/card";

export default function IncidentFlowTimeline() {
  return (
    <section className="flex flex-col items-start">
      <Card className="w-full rounded-xl border border-[#DDD6FE] bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold text-[#4C1D95]">사건 처리 흐름</h2>

        <div className="mt-6 flex gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <p className="font-bold text-[#4C1D95]">1</p>
            </div>
            <h3 className="text-sm font-semibold text-[#4C1D95]">신고 접수</h3>
            <p className="w-40 text-center text-[#6D28D9]">사용자 신고 접수 및 기본 메타데이터 수집</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <p className="font-bold text-[#4C1D95]">2</p>
            </div>
            <h3 className="text-sm font-semibold text-[#4C1D95]">1차 검토</h3>
            <p className="w-40 text-center text-[#6D28D9]">운영자 검토, 증빙 요청 여부 판단</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <p className="font-bold text-[#4C1D95]">3</p>
            </div>
            <h3 className="text-sm font-semibold text-[#4C1D95]">조치 실행</h3>
            <p className="w-40 text-center text-[#6D28D9]">임시 비공개 또는 즉시 차단 조치</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <p className="font-bold text-[#4C1D95]">4</p>
            </div>
            <h3 className="text-sm font-semibold text-[#4C1D95]">종결 및 기록</h3>
            <p className="w-40 text-center text-[#6D28D9]">조치 기록, 아티스트 통보 및 재심사 안내</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
