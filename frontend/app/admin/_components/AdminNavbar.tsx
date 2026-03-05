import Link from "next/link";

import LogoutButton from "./LogoutButton";

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
        <LogoutButton />
      </div>
    </nav>
  );
}
