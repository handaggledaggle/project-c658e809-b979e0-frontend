import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HomeNavbar() {
  return (
    <nav
      className="flex h-16 items-center justify-between border-b border-[#DDD6FE] bg-white px-8 shadow-sm"
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

      <div className="flex items-center gap-4">
        <Button
          className="rounded-lg bg-gray-100 px-4 py-2 text-[#6D28D9] hover:bg-gray-100"
          variant="secondary"
        >
          회원가입
        </Button>
        <Button
          className="rounded-lg border border-[#DDD6FE] bg-white px-4 py-2 text-[#6D28D9] shadow-sm hover:bg-white"
          variant="outline"
        >
          로그인
        </Button>
      </div>
    </nav>
  );
}
