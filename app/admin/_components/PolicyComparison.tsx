import { Card } from "@/components/ui/card";

export default function PolicyComparison() {
  return (
    <section className="flex flex-col items-start">
      <Card className="w-full rounded-xl border border-[#DDD6FE] bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold text-[#4C1D95]">운영 조치 비교: 비공개 처리 기준</h2>

        <div className="mt-4 flex w-full">
          <div className="flex-1 p-4">
            <p className="font-semibold text-[#4C1D95]">사유</p>
          </div>
          <div className="w-56 p-4">
            <p className="font-semibold text-[#4C1D95]">임시 비공개</p>
          </div>
          <div className="w-56 p-4">
            <p className="font-semibold text-[#4C1D95]">영구 비공개</p>
          </div>
          <div className="w-56 p-4">
            <p className="font-semibold text-[#4C1D95]">신고 보류</p>
          </div>
        </div>

        <div className="flex border-t border-gray-100">
          <div className="flex-1 p-4">
            <p className="text-[#4C1D95]">저작권 침해 신고 접수</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">조사 중 임시 비공개</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">증빙 확인 시 영구 비공개</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">고객 추가 정보 요청</p>
          </div>
        </div>

        <div className="flex border-t border-gray-100">
          <div className="flex-1 p-4">
            <p className="text-[#4C1D95]">결제 사기 의심</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">거래 일시 정지</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">계정 영구 정지</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">추가 모니터링</p>
          </div>
        </div>

        <div className="flex border-t border-gray-100">
          <div className="flex-1 p-4">
            <p className="text-[#4C1D95]">콘텐츠 품질 저하(반복 불량)</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">경고 및 노출 제한</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">노출 차단</p>
          </div>
          <div className="w-56 p-4">
            <p className="text-[#6D28D9]">재심사 요청 가능</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
