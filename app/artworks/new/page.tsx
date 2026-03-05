import Link from "next/link";
import { ArtworkCreateForm } from "./_components/artwork-create-form";

export default function Page() {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col">
        <nav
          className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8"
          data-section-type="navbar"
        >
          <Link href="/" className="text-xl font-bold text-[#4C1D95]">
            printtie
          </Link>

          <div className="hidden md:flex gap-6">
            <Link className="text-[#6D28D9] hover:underline" href="/artworks">
              작품 둘러보기
            </Link>
            <Link className="text-[#6D28D9] hover:underline" href="/artworks/new">
              작품 등록
            </Link>
            <Link className="text-[#6D28D9] hover:underline" href="/me/artworks">
              내 작품
            </Link>
            <Link className="text-[#6D28D9] hover:underline" href="/orders">
              주문/결제
            </Link>
            <Link className="text-[#6D28D9] hover:underline" href="/admin">
              관리자 콘솔
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[#6D28D9]">환영합니다, 아티스트님</span>
            <button className="bg-gray-100 text-[#6D28D9] rounded-lg px-4 py-2">
              로그아웃
            </button>
          </div>
        </nav>

        <section
          data-section-type="hero"
          className="flex flex-col items-start py-12 px-6 md:px-12 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]"
        >
          <div className="flex flex-col gap-4 max-w-3xl">
            <h1 className="text-3xl font-bold text-white">작품 등록</h1>
            <p className="text-white/70">
              작품 정보를 입력하고 즉시 공개하거나 비공개로 저장할 수 있습니다. 간단한 등록으로 판매
              준비를 완료하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="text-sm text-white/70">필수 항목: 제목, 카테고리, 가격, 대표 이미지</div>
              <div className="text-sm text-white/70">권장: 상세 설명, 작품 규격, 배송/반품 안내</div>
            </div>
          </div>
        </section>

        <section
          data-section-type="form"
          className="flex flex-col items-center py-12 px-6 md:px-12 bg-white shadow-lg"
        >
          <div className="w-full max-w-4xl">
            <ArtworkCreateForm />
          </div>
        </section>

        <section
          data-section-type="features"
          className="flex flex-col items-center py-12 px-6 md:px-12 bg-white shadow-lg"
        >
          <h2 className="text-3xl font-bold text-[#4C1D95]">주요 기능</h2>
          <p className="text-lg text-[#6D28D9] mb-6">아티스트의 작품 등록과 판매를 간편하게 돕는 기능들</p>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-start p-6 bg-[#FAF5FF] rounded-xl w-full md:w-64 border border-[#DDD6FE]">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3" />
              <h3 className="text-xl font-semibold text-[#4C1D95]">원스탑 등록</h3>
              <p className="text-[#6D28D9]">대표 이미지, 상세 설명, 가격을 한 번에 입력하여 빠르게 등록합니다.</p>
            </div>

            <div className="flex flex-col items-start p-6 bg-[#FAF5FF] rounded-xl w-full md:w-64 border border-[#DDD6FE]">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3" />
              <h3 className="text-xl font-semibold text-[#4C1D95]">공개/비공개 전환</h3>
              <p className="text-[#6D28D9]">등록 시 즉시 공개 또는 비공개 저장을 선택하여 노출을 제어할 수 있습니다.</p>
            </div>

            <div className="flex flex-col items-start p-6 bg-[#FAF5FF] rounded-xl w-full md:w-64 border border-[#DDD6FE]">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3" />
              <h3 className="text-xl font-semibold text-[#4C1D95]">정산/결제 연결</h3>
              <p className="text-[#6D28D9]">판매 시 자동 정산을 위한 결제 수단 연결 및 정산 정보 관리가 가능합니다.</p>
            </div>
          </div>
        </section>

        <section data-section-type="faq" className="flex flex-col items-center py-12 px-6 md:px-12 bg-[#FFFFFF]">
          <h2 className="text-3xl font-bold text-[#4C1D95]">자주 묻는 질문</h2>
          <div className="flex flex-col gap-4 max-w-3xl mt-6 w-full">
            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg border border-[#DDD6FE]">
              <h3 className="text-lg font-semibold text-[#4C1D95]">등록 후 바로 판매되나요?</h3>
              <p className="text-[#6D28D9]">
                '즉시 공개'를 선택하면 등록 즉시 플랫폼에 노출되어 구매가 가능합니다. 별도 심사 항목은
                카테고리/서비스 정책에 따라 적용될 수 있습니다.
              </p>
            </div>

            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg border border-[#DDD6FE]">
              <h3 className="text-lg font-semibold text-[#4C1D95]">등록 필수 항목은 무엇인가요?</h3>
              <p className="text-[#6D28D9]">필수: 제목, 카테고리, 가격, 대표 이미지. 이 항목이 없으면 저장 또는 공개가 제한됩니다.</p>
            </div>

            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg border border-[#DDD6FE]">
              <h3 className="text-lg font-semibold text-[#4C1D95]">결제/정산 정보는 어디서 설정하나요?</h3>
              <p className="text-[#6D28D9]">
                계정 메뉴의 '정산 정보'에서 은행/정산 수단과 세금 정보를 입력할 수 있으며, 판매 발생 시
                해당 정보로 자동 정산됩니다.
              </p>
            </div>

            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg border border-[#DDD6FE]">
              <h3 className="text-lg font-semibold text-[#4C1D95]">등록 전환율을 올리려면?</h3>
              <p className="text-[#6D28D9]">
                고화질 이미지, 상세한 설명, 명확한 배송/반품 안내, 적절한 가격 설정이 전환율 향상에 도움이
                됩니다. 또한 검색 키워드를 제목/태그에 포함하세요.
              </p>
            </div>
          </div>
        </section>

        <footer data-section-type="footer" className="flex flex-col md:flex-row md:justify-between gap-10 py-12 px-8 bg-[#FFFFFF]">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-gray-900">printtie</span>
            <p className="text-[#6D28D9] text-sm">© 2026 printtie. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 font-semibold">Company</p>
              <p className="text-[#6D28D9] text-sm">About</p>
              <p className="text-[#6D28D9] text-sm">Careers</p>
              <p className="text-[#6D28D9] text-sm">Contact</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 font-semibold">Support</p>
              <p className="text-[#6D28D9] text-sm">Help Center</p>
              <p className="text-[#6D28D9] text-sm">Terms</p>
              <p className="text-[#6D28D9] text-sm">Privacy Policy</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 font-semibold">For Artists</p>
              <p className="text-[#6D28D9] text-sm">How to Sell</p>
              <p className="text-[#6D28D9] text-sm">Fees & Payouts</p>
              <p className="text-[#6D28D9] text-sm">Guidelines</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 font-semibold">Resources</p>
              <p className="text-[#6D28D9] text-sm">Blog</p>
              <p className="text-[#6D28D9] text-sm">FAQ</p>
              <p className="text-[#6D28D9] text-sm">API & Docs</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
