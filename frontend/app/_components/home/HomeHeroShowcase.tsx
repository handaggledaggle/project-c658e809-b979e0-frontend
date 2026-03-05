import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HomeHeroShowcase() {
  return (
    <section
      data-section-type="hero"
      className="flex flex-col items-center justify-center bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] px-8 py-20"
    >
      <div className="flex w-full justify-center">
        <Card
          data-component="card"
          className="w-[1120px] overflow-hidden rounded-xl border border-white/20 bg-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"
        >
          <div className="p-6">
            <div className="flex justify-between gap-4">
              <Button
                data-component="button"
                className="flex-1 justify-start rounded-lg border border-white/30 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] px-6 py-3 text-white/90 hover:opacity-95"
              >
                작품 등록하기
              </Button>
              <Button
                data-component="button"
                className="flex-1 justify-start rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] px-6 py-3 text-white/90 hover:opacity-95"
              >
                작품 둘러보기
              </Button>
            </div>

            <div className="mt-6 h-[160px] w-full rounded-md bg-gray-200" />

            <div className="mt-6 flex gap-4">
              <Button
                data-component="button"
                className="flex-1 justify-start rounded-lg border border-white/30 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] px-4 py-2 text-white/90 hover:opacity-95"
              >
                상세보기
              </Button>
              <Button
                data-component="button"
                className="flex-1 justify-start rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] px-4 py-2 text-white/90 hover:opacity-95"
              >
                작품 공유
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
