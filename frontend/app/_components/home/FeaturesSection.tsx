export function FeaturesSection() {
  return (
    <section
      data-section-type="features"
      className="flex flex-col items-center bg-white px-8 py-16 shadow-lg"
    >
      <h2 className="text-3xl font-bold text-[#4C1D95]">플랫폼 기능</h2>
      <p className="mt-2 text-lg text-[#6D28D9]">
        아티스트가 판매에 집중할 수 있도록 제공하는 핵심 기능들
      </p>

      <div className="mt-8 flex gap-8">
        <div className="flex w-64 flex-col items-center rounded-xl bg-[#FAF5FF] p-6">
          <div className="h-12 w-12 rounded-lg bg-gray-200" />
          <h3 className="mt-4 text-xl font-semibold text-[#4C1D95]">간편한 작품 등록</h3>
          <p className="mt-2 text-center text-[#6D28D9]">
            사진 업로드 및 메타데이터 입력을 한 번에. 샘플 템플릿과 자동 태깅 제공.
          </p>
        </div>

        <div className="flex w-64 flex-col items-center rounded-xl bg-[#FAF5FF] p-6">
          <div className="h-12 w-12 rounded-lg bg-gray-200" />
          <h3 className="mt-4 text-xl font-semibold text-[#4C1D95]">안전한 결제</h3>
          <p className="mt-2 text-center text-[#6D28D9]">
            여러 결제수단 지원과 결제 실패 복구 흐름으로 구매 전환을 높입니다.
          </p>
        </div>

        <div className="flex w-64 flex-col items-center rounded-xl bg-[#FAF5FF] p-6">
          <div className="h-12 w-12 rounded-lg bg-gray-200" />
          <h3 className="mt-4 text-xl font-semibold text-[#4C1D95]">노출 최적화</h3>
          <p className="mt-2 text-center text-[#6D28D9]">
            카테고리, 태그, 추천 큐레이션으로 적절한 컬렉터에게 작품을 노출합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
