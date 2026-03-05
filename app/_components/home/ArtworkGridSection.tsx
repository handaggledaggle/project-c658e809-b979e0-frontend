import { ArtworkGridClient } from "@/app/_components/home/ArtworkGridClient";

export function ArtworkGridSection() {
  return (
    <section
      data-section-type="card-grid"
      className="flex flex-col items-center py-16 px-8 bg-[#FFFFFF]"
    >
      <ArtworkGridClient />
    </section>
  );
}
