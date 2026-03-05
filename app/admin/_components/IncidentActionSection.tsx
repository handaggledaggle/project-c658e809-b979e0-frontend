import { Card } from "@/components/ui/card";
import IncidentActionClient from "./IncidentActionClient";

export default function IncidentActionSection() {
  return (
    <section className="flex flex-col items-start rounded-xl border border-[#DDD6FE] bg-white p-6">
      <div className="flex w-full gap-6">
        <Card className="flex-1 rounded-xl border border-[#DDD6FE] bg-white p-6 shadow-lg">
          <h2 className="text-lg font-bold text-[#4C1D95]">사건 상세 조치</h2>
          <IncidentActionClient />
        </Card>

        <aside className="w-96 rounded-xl border border-[#DDD6FE] bg-white p-6 shadow-lg">
          <h3 className="text-md font-semibold text-[#4C1D95]">이력 / 타임라인</h3>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="text-sm text-[#6D28D9]">2026-03-05 10:12</div>
              <div className="text-[#4C1D95]">사용자 신고 접수: 신고자 제공 스크린샷 첨부</div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-[#6D28D9]">2026-03-05 11:00</div>
              <div className="text-[#4C1D95]">운영자 A 1차 검토: 증빙 부족, 아티스트에 증빙 요청</div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-[#6D28D9]">2026-03-05 11:30</div>
              <div className="text-[#4C1D95]">임시 비공개 조치 적용</div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm text-[#6D28D9]">2026-03-06 09:20</div>
              <div className="text-[#4C1D95]">아티스트 응답 대기 중</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
