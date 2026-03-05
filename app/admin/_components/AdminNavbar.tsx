import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
  return (
    <nav className="flex h-16 items-center justify-between border-b border-[#DDD6FE] bg-white px-8 shadow-sm">
      <span className="text-xl font-bold text-[#4C1D95]">printtie 관리자 콘솔</span>

      <div className="flex gap-6">
        <Link className="text-[#6D28D9] hover:underline" href="/admin?tab=artworks">
          작품 관리
        </Link>
        <Link className="text-[#6D28D9] hover:underline" href="/admin?tab=users">
          사용자 관리
        </Link>
        <Link className="text-[#6D28D9] hover:underline" href="/admin?tab=orders">
          주문/결제
        </Link>
        <Link className="text-[#6D28D9] hover:underline" href="/admin?tab=reports">
          리포트
        </Link>
        <Link className="text-[#6D28D9] hover:underline" href="/admin?tab=settings">
          설정
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">운영자: 이민수</div>
        <form
          action={async () => {
            "use server";
            // 실제 인증/세션이 있는 경우 여기서 쿠키 삭제 등을 수행하세요.
          }}
        >
          <Button className="bg-gray-100 text-[#6D28D9] hover:bg-gray-200" type="button" onClick={async () => {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
              // eslint-disable-next-line no-restricted-globals
              location.reload();
            } catch {
              // ignore
            }
          }}>
            로그아웃
          </Button>
        </form>
      </div>
    </nav>
  );
}
