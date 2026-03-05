import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section
      data-section-type="cta"
      className="flex flex-col items-center justify-center bg-[#FAF5FF] px-8 py-16"
    >
      <h2 className="text-center text-3xl font-bold text-[#4C1D95]">
        지금 계정을 만들고 첫 작품을 등록하세요
      </h2>
      <p className="mt-2 text-center text-lg text-[#6D28D9]">
        간단한 등록 과정과 단계별 가이드로 판매 준비를 도와드립니다.
      </p>
      <div className="mt-6 flex gap-4">
        <Button
          data-component="button"
          className="h-11 rounded-lg border border-[#DDD6FE] bg-white px-8 py-3 text-[#4C1D95] shadow-lg hover:bg-white"
          variant="outline"
        >
          아티스트 가입
        </Button>
        <Button
          data-component="button"
          className="h-11 rounded-lg bg-[#FAF5FF] px-8 py-3 text-[#4C1D95] hover:bg-[#FAF5FF]"
          variant="ghost"
        >
          등록 가이드 보기
        </Button>
      </div>
    </section>
  );
}
