import Link from "next/link";

import { HomeHeroShowcase } from "@/app/_components/home/HomeHeroShowcase";
import { HomeNavbar } from "@/app/_components/home/HomeNavbar";
import { ArtworkGridSection } from "@/app/_components/home/ArtworkGridSection";
import { FeaturesSection } from "@/app/_components/home/FeaturesSection";
import { StatsSection } from "@/app/_components/home/StatsSection";
import { CtaSection } from "@/app/_components/home/CtaSection";
import { HomeFooter } from "@/app/_components/home/HomeFooter";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex w-[1440px] flex-col">
        <HomeNavbar />

        <main>
          <HomeHeroShowcase />
          <ArtworkGridSection />
          <FeaturesSection />
          <StatsSection />
          <CtaSection />
        </main>

        <HomeFooter />

        {/* hidden anchor targets (nav demo) */}
        <div className="sr-only">
          <Link href="#browse">browse</Link>
          <Link href="#register">register</Link>
          <Link href="#my">my</Link>
          <Link href="#orders">orders</Link>
          <Link href="#admin">admin</Link>
        </div>
      </div>
    </div>
  );
}
