import { ArtworkGridClient } from "@/app/_components/home/ArtworkGridClient";

export function ArtworkGridSection() {
  return (
    <section
      data-section-type="card-grid"
      className="flex flex-col items-center bg-[#FFFFFF] px-8 py-16"
    >
      <ArtworkGridClient />
    </section>
  );
}
