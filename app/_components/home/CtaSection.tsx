import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section data-section-type="cta" className="flex flex-col items-center justify-center py-16 px-8 bg-[#FAF5FF]">
      <h2 className="text-3xl font-bold text-[#4C1D95] text-center">지금 계정을 만들고 첫 작품을 등록하세요</h2>
      <p className="text-lg text-[#6D28D9] text-center mt-2">간단한 등록 과정과 단계별 가이드로 판매 준비를 도와드립니다.</p>
      <div className="flex gap-4 mt-6">
        <Button
          data-component="button"
          className="bg-white shadow-lg text-[#4C1D95] border border-[#DDD6FE] rounded-lg px-8 py-3 h-11 hover:bg-white"
          variant="outline"
        >
          아티스트 가입
        </Button>
        <Button
          data-component="button"
          className="bg-[#FAF5FF] text-[#4C1D95] rounded-lg px-8 py-3 h-11 hover:bg-[#FAF5FF]"
          variant="ghost"
        >
          등록 가이드 보기
        </Button>
      </div>
    </section>
  );
}
