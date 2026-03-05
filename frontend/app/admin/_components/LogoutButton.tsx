"use client";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button
      className="bg-gray-100 text-[#6D28D9] hover:bg-gray-200"
      type="button"
      onClick={async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          window.location.reload();
        } catch {
          // ignore
        }
      }}
    >
      로그아웃
    </Button>
  );
}
