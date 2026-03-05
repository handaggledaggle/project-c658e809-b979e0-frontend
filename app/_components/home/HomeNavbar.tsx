import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeNavbar() {
  return (
    <nav
      className="h-16 bg-white border-b border-[#DDD6FE] shadow-sm flex items-center justify-between px-8"
      data-section-type="navbar"
    >
      <span className="text-xl font-bold text-[#4C1D95]">printtie</span>

      <div className="flex gap-6">
        <Link className="text-[#6D28D9]" href="#browse">
          작품 둘러보기
        </Link>
        <Link className="text-[#6D28D9]" href="#register">
          작품 등록
        </Link>
        <Link className="text-[#6D28D9]" href="#my">
          내 작품
        </Link>
        <Link className="text-[#6D28D9]" href="#orders">
          주문/결제
        </Link>
        <Link className="text-[#6D28D9]" href="#admin">
          관리자 콘솔
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <Button
          className="bg-gray-100 text-[#6D28D9] rounded-lg px-4 py-2 hover:bg-gray-100"
          variant="secondary"
        >
          회원가입
        </Button>
        <Button
          className="bg-white text-[#6D28D9] border border-[#DDD6FE] shadow-sm rounded-lg px-4 py-2 hover:bg-white"
          variant="outline"
        >
          로그인
        </Button>
      </div>
    </nav>
  );
}
