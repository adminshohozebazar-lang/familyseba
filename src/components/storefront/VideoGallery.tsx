import { YoutubeEmbed } from "@/components/storefront/YoutubeEmbed";

interface VideoGalleryProps {
  videoIds: string[];
}

// Renders nothing at all when there are no videos yet, rather than an
// empty/broken-looking section — see VIDEO_GALLERY_IDS in homepage config.
export function VideoGallery({ videoIds }: VideoGalleryProps) {
  if (videoIds.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-6 text-xl font-bold text-brand-neutral-dark">Video Gallery</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videoIds.map((id) => (
          <YoutubeEmbed key={id} embedUrl={`https://www.youtube.com/embed/${id}`} title="Family Seba product video" />
        ))}
      </div>
    </section>
  );
}
