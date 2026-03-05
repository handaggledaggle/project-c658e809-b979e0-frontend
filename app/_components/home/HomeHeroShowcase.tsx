import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HomeHeroShowcase() {
  return (
    <section
      data-section-type="hero"
      className="flex flex-col items-center justify-center py-20 px-8 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]"
    >
      <div className="w-full flex justify-center">
        <Card
          data-component="card"
          className="w-[1120px] rounded-xl border border-white/20 bg-white/15 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          <div className="p-6">
            <div className="flex gap-4 justify-between">
              <Button
                data-component="button"
                className="flex-1 justify-start bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90 border border-white/30 rounded-lg px-6 py-3 hover:opacity-95"
              >
                작품 등록하기
              </Button>
              <Button
                data-component="button"
                className="flex-1 justify-start bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90 rounded-lg px-6 py-3 hover:opacity-95"
              >
                작품 둘러보기
              </Button>
            </div>

            <div className="mt-6 w-full h-[160px] rounded-md bg-gray-200" />

            <div className="mt-6 flex gap-4">
              <Button
                data-component="button"
                className="flex-1 justify-start bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90 border border-white/30 rounded-lg px-4 py-2 hover:opacity-95"
              >
                상세보기
              </Button>
              <Button
                data-component="button"
                className="flex-1 justify-start bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white/90 rounded-lg px-4 py-2 hover:opacity-95"
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
