import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Plus, LogOut } from "lucide-react";
import ArtworkDashboard from "./_components/artwork-dashboard";

export default function Page() {
  return (
    <div className="min-h-dvh w-full bg-white">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8">
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
          <Link className="text-[#4C1D95] font-semibold" href="/seller/artworks">
            내 작품
          </Link>
          <Link className="text-[#6D28D9] hover:underline" href="/orders">
            주문/결제
          </Link>
          <Link className="text-[#6D28D9] hover:underline" href="/admin">
            관리자 콘솔
          </Link>
        </div>

        <Button variant="secondary" className="text-[#6D28D9]" type="button">
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </nav>

      {/* Hero / Overview */}
      <header className="flex flex-col bg-white px-8 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#4C1D95]">내 작품 관리</h1>
            <p className="text-[#6D28D9] mt-2">
              등록한 작품을 한눈에 보고 기본 정보 수정, 공개 상태 변경, 판매 상태를 확인하세요.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="text-[#4C1D95] border-[#DDD6FE]"
              asChild
            >
              <Link href="/artworks/new">
                <Plus className="size-4" />
                새 작품 등록
              </Link>
            </Button>
            <Button
              id="export-dashboard"
              variant="outline"
              className="text-[#4C1D95] border-[#DDD6FE]"
              type="button"
              formAction={undefined}
              onClick={undefined}
            >
              <Download className="size-4" />
              대시보드 내보내기
            </Button>
          </div>
        </div>

        <section className="flex items-center justify-start gap-8 mt-6 bg-white shadow-lg p-6 border border-[#DDD6FE] rounded-lg">
          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-[#4C1D95]">+12</p>
              <p className="text-[#6D28D9] text-sm">신규 가입 아티스트 (주)</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-[#4C1D95]">34</p>
              <p className="text-[#6D28D9] text-sm">작품 등록 완료 (주)</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-[#4C1D95]">18%</p>
              <p className="text-[#6D28D9] text-sm">등록 전환율</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-bold text-[#4C1D95]">62%</p>
              <p className="text-[#6D28D9] text-sm">작품 보유 판매자 비율</p>
            </div>
          </div>
        </section>
      </header>

      <main className="flex flex-col px-8 py-10 bg-[#FAF5FF] gap-10">
        {/* Card Grid (interactive) */}
        <ArtworkDashboard />

        {/* Sales & Ops Stats */}
        <section className="flex flex-col bg-white shadow-lg p-6 border border-[#DDD6FE] rounded-lg">
          <h3 className="text-lg font-semibold text-[#4C1D95] mb-4">판매 & 운영 지표</h3>
          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col items-start">
              <p className="text-3xl font-bold text-[#4C1D95]">4.8%</p>
              <p className="text-[#6D28D9] text-sm">구매 전환율 (상세→결제)</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-3xl font-bold text-[#4C1D95]">97%</p>
              <p className="text-[#6D28D9] text-sm">결제 성공률</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-3xl font-bold text-[#4C1D95]">₩42,000</p>
              <p className="text-[#6D28D9] text-sm">객단가 (AOV)</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-3xl font-bold text-[#4C1D95]">₩3.4M</p>
              <p className="text-[#6D28D9] text-sm">거래액 (GMV, 월)</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col items-start bg-white p-6 rounded-lg border border-[#DDD6FE] shadow-sm">
          <h2 className="text-2xl font-bold text-[#4C1D95] mb-4">도움이 필요하신가요?</h2>
          <div className="flex flex-col gap-4 w-full max-w-3xl">
            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg border border-[#DDD6FE]">
              <h3 className="text-lg font-semibold text-[#4C1D95]">작품을 비공개로 전환하면 무엇이 변경되나요?</h3>
              <p className="text-[#6D28D9]">
                비공개로 전환하면 작품 목록과 검색 결과에서 숨겨지며, 외부 링크를 통해서만 접근 가능합니다.
                기존 주문에는 영향이 없습니다.
              </p>
            </div>
            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg border border-[#DDD6FE]">
              <h3 className="text-lg font-semibold text-[#4C1D95]">가격을 수정하면 즉시 반영되나요?</h3>
              <p className="text-[#6D28D9]">
                수정 즉시 상세페이지와 장바구니에 반영됩니다. 단, 이미 결제 프로세스에 진입한 주문에는 적용되지 않습니다.
              </p>
            </div>
            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg border border-[#DDD6FE]">
              <h3 className="text-lg font-semibold text-[#4C1D95]">작품 등록 전환율을 높이려면?</h3>
              <p className="text-[#6D28D9]">
                등록 과정을 간소화하고, 이미지 가이드와 템플릿을 제공하세요. 등록 페이지 진입 후 유실 지점을 분석해 필수 입력 항목을 최소화하는 것이 좋습니다.
              </p>
            </div>
          </div>
        </section>

        <Separator className="bg-[#DDD6FE]" />
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row md:justify-between gap-8 py-12 px-8 bg-white">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold text-gray-900">printtie</span>
          <p className="text-[#6D28D9] text-sm">© 2026 printtie. All rights reserved.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-10 md:gap-12">
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">Company</p>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">About</Link>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">Careers</Link>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">Contact</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">Support</p>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">Help Center</Link>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">Terms</Link>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">Privacy Policy</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-semibold">For Artists</p>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">How to Sell</Link>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">Fees &amp; Payouts</Link>
            <Link className="text-[#6D28D9] text-sm hover:underline" href="#">Guidelines</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
