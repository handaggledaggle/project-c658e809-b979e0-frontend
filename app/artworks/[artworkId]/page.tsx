import ArtworkDetailClient from "./_components/artwork-detail-client";

export const dynamic = "force-dynamic";

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ artworkId: string }>;
}) {
  const { artworkId } = await params;

  return <ArtworkDetailClient artworkId={artworkId} />;
}
