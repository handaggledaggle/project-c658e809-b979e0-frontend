export function StatsSection() {
  return (
    <section
      data-section-type="stats"
      className="flex items-center justify-center py-16 px-8 bg-[#FAF5FF]"
    >
      <div className="w-full flex flex-wrap justify-center gap-x-28 gap-y-10">
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">1.2K+</p>
          <p className="text-[#6D28D9]">신규 가입 아티스트 (최근 30일)</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">3.4K</p>
          <p className="text-[#6D28D9]">등록 완료된 작품(주/월)</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold text-[#4C1D95]">42%</p>
          <p className="text-[#6D28D9]">구매 전환율 (상세→결제)</p>
        </div>

        <div className="flex flex-col items-center basis-full">
          <p className="text-4xl font-bold text-[#4C1D95]">98%</p>
          <p className="text-[#6D28D9]">결제 성공률</p>
        </div>
      </div>
    </section>
  );
}
